"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TourStep } from "@/data/solutions";

export interface TargetGeometry {
  rect: DOMRect;
  frameRect: DOMRect | null;
  borderRadius: number;
}

export interface UseTourResult {
  active: boolean;
  index: number;
  total: number;
  step: TourStep | null;
  geometry: TargetGeometry | null;
  isLast: boolean;
  isFirst: boolean;
  next: () => void;
  prev: () => void;
  skip: () => void;
  restart: () => void;
  finished: boolean;
}

interface UseTourOptions {
  steps: TourStep[];
  // Delay before the tour auto-starts after mount
  autoStartDelay?: number;
  // Reset/re-key when a parent decides to restart the tour
  resetKey?: string | number;
  // Called when the tour completes (after last step's Next / after last interaction)
  onFinish?: () => void;
}

export function useTour({
  steps,
  autoStartDelay = 400,
  resetKey,
  onFinish,
}: UseTourOptions): UseTourResult {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [geometry, setGeometry] = useState<TargetGeometry | null>(null);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // Auto-start (and reset when resetKey changes)
  useEffect(() => {
    setActive(false);
    setIndex(0);
    setFinished(false);
    setGeometry(null);
    if (steps.length === 0) return;
    const timer = setTimeout(() => setActive(true), autoStartDelay);
    return () => clearTimeout(timer);
  }, [resetKey, steps.length, autoStartDelay]);

  const step = active && index < steps.length ? steps[index] : null;

  // Track target element geometry
  useLayoutEffect(() => {
    if (!step) {
      setGeometry(null);
      return;
    }

    let frameId: number;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let scrolledForThisStep = false;

    const measure = () => {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (!el) {
        setGeometry(null);
        return;
      }
      const frameEl = document.querySelector(
        "[data-tour-frame]",
      ) as HTMLElement | null;

      // Scroll the target into view inside the nearest scrollable ancestor
      // ONCE per step, BEFORE measuring. Without this, mockups with internal
      // overflow-y-auto (mobile catalogs, long lists) start the tour with
      // the spotlight anchored to an element below the fold of an internal
      // scrollable — user sees the tooltip but no visible target.
      //
      // Instant (non-smooth) scroll so the rect we capture next reflects
      // the post-scroll position. Scoped to scrollable ancestors INSIDE
      // the frame so the page never jumps.
      if (!scrolledForThisStep && frameEl && frameEl.contains(el)) {
        scrollIntoScrollableAncestor(el, frameEl);
        scrolledForThisStep = true;
      }

      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const radius = parseFloat(computed.borderRadius) || 12;
      const frameRect = frameEl ? frameEl.getBoundingClientRect() : null;

      setGeometry({ rect, frameRect, borderRadius: radius });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };

    scheduleMeasure();

    // Poll until the target element exists in the DOM AND its layout has
    // settled. We poll fast for the first second (8 × 100ms) to catch
    // mockup transition animations, then slow down to 250ms for up to
    // 12 seconds so long-running screens (e.g. Cardápio Inteligente AI
    // generation ~7s) can still mount their target before we give up.
    let polls = 0;
    let hasFound = false;
    intervalId = setInterval(() => {
      const el = document.querySelector(step.targetSelector);
      const found = !!el;
      scheduleMeasure();
      polls += 1;
      if (found && !hasFound) {
        hasFound = true;
      }
      // If we already found it once, keep polling a few more times to
      // settle layout, then stop. If we never found it, keep trying for
      // up to ~12 seconds total.
      if ((hasFound && polls > 12) || polls > 60) {
        if (intervalId) clearInterval(intervalId);
      }
    }, 200);

    const onResize = () => scheduleMeasure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      cancelAnimationFrame(frameId);
      if (intervalId) clearInterval(intervalId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [step]);

  const advance = useCallback(() => {
    setIndex((prev) => {
      if (prev >= steps.length - 1) {
        setActive(false);
        setFinished(true);
        onFinishRef.current?.();
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length]);

  const back = useCallback(() => {
    setIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const skip = useCallback(() => {
    setActive(false);
    setFinished(true);
    onFinishRef.current?.();
  }, []);

  const restart = useCallback(() => {
    setIndex(0);
    setFinished(false);
    setActive(true);
  }, []);

  // If the current step requires interaction, listen for click on target.
  // IMPORTANT: do NOT call stopPropagation here — that would block React's
  // delegated onClick handler at the document root, breaking the mockup's
  // own click behavior (e.g. "Adicionar ao carrinho"). We just observe the
  // click and advance the tour; the React handler runs normally.
  useEffect(() => {
    if (!step || !step.requiresInteraction) return;
    const el = document.querySelector(step.targetSelector) as HTMLElement | null;
    if (!el) return;

    const handler = () => {
      advance();
    };
    el.addEventListener("click", handler);
    return () => {
      el.removeEventListener("click", handler);
    };
  }, [step, advance, geometry]);

  return {
    active,
    index,
    total: steps.length,
    step,
    geometry,
    isLast: index === steps.length - 1,
    isFirst: index === 0,
    next: advance,
    prev: back,
    skip,
    restart,
    finished,
  };
}

/**
 * Walks up from `el` toward `frameEl` looking for the nearest ancestor with
 * its own scroll axis. If `el` is not fully visible inside it, scrolls so
 * `el` is centered (smooth). If `el` is already fully visible, no-op so we
 * don't fight the user's scroll position. Only scrolls INSIDE the frame.
 */
function scrollIntoScrollableAncestor(el: HTMLElement, frameEl: HTMLElement) {
  const SAFE_MARGIN = 12;
  let node: HTMLElement | null = el.parentElement;
  while (node && node !== frameEl) {
    const cs = window.getComputedStyle(node);
    const oy = cs.overflowY;
    const ox = cs.overflowX;
    const scrollableY =
      (oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight;
    const scrollableX =
      (ox === "auto" || ox === "scroll") && node.scrollWidth > node.clientWidth;
    if (scrollableY || scrollableX) {
      const elRect = el.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      if (scrollableY) {
        const above = elRect.top < nodeRect.top + SAFE_MARGIN;
        const below = elRect.bottom > nodeRect.bottom - SAFE_MARGIN;
        if (above || below) {
          const desiredCenter = nodeRect.top + nodeRect.height / 2;
          const currentCenter = elRect.top + elRect.height / 2;
          // Direct assignment ensures synchronous scroll so the next
          // getBoundingClientRect reflects the new position.
          node.scrollTop += currentCenter - desiredCenter;
        }
      }
      if (scrollableX) {
        const left = elRect.left < nodeRect.left + SAFE_MARGIN;
        const right = elRect.right > nodeRect.right - SAFE_MARGIN;
        if (left || right) {
          const desiredCenterX = nodeRect.left + nodeRect.width / 2;
          const currentCenterX = elRect.left + elRect.width / 2;
          node.scrollLeft += currentCenterX - desiredCenterX;
        }
      }
      // Only handle the nearest scrollable ancestor — anything above it is
      // outside the user's current scroll context.
      return;
    }
    node = node.parentElement;
  }
}
