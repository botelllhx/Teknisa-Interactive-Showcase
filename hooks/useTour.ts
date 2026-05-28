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
  /** ms remaining until auto-advance fires (also exposed for UI progress bars) */
  autoAdvanceMs: number;
  /** key that changes every time a new step's auto-advance timer (re)starts */
  autoAdvanceKey: number;
}

/**
 * Default auto-advance duration. The tour ticks through steps automatically
 * after this many ms so the showcase keeps moving while someone narrates it
 * to a crowd. Manual interaction (target click, Next button) still works and
 * resets the timer for the next step.
 *
 * Pause-on-touch: any user interaction (pointerdown/keydown anywhere on
 * the page) resets the timer back to full duration. So if the presenter
 * is gesturing on screen or wants to dwell on a step, touching the panel
 * keeps the current step alive.
 */
export const DEFAULT_AUTO_ADVANCE_MS = 10000;

interface UseTourOptions {
  steps: TourStep[];
  // Delay before the tour auto-starts after mount
  autoStartDelay?: number;
  // Reset/re-key when a parent decides to restart the tour
  resetKey?: string | number;
  // Called when the tour completes (after last step's Next / after last interaction)
  onFinish?: () => void;
  // Auto-advance interval (set <=0 to disable)
  autoAdvanceMs?: number;
}

export function useTour({
  steps,
  autoStartDelay = 400,
  resetKey,
  onFinish,
  autoAdvanceMs = DEFAULT_AUTO_ADVANCE_MS,
}: UseTourOptions): UseTourResult {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [geometry, setGeometry] = useState<TargetGeometry | null>(null);
  const [autoAdvanceKey, setAutoAdvanceKey] = useState(0);
  const onFinishRef = useRef(onFinish);
  const advanceRef = useRef<() => void>(() => {});

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
    // settled. If the target never appears within MAX_POLLS, auto-advance
    // so the user is not stuck on an invisible step — failsafe for missing
    // selectors and dead flows.
    const MAX_POLLS = 60;
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
      if (hasFound && polls > 12) {
        if (intervalId) clearInterval(intervalId);
        return;
      }
      if (!hasFound && polls >= MAX_POLLS) {
        if (intervalId) clearInterval(intervalId);
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[useTour] target "${step.targetSelector}" never appeared after ${MAX_POLLS * 200}ms — auto-advancing`,
          );
        }
        advanceRef.current();
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

  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

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

  // Auto-advance: after `autoAdvanceMs` of inactivity on a step, the tour
  // moves forward on its own so a presenter can keep talking without having
  // to tap the screen between steps.
  //   - passive steps  → call advance() directly
  //   - action steps   → synthesize a real click on the target element so
  //     the mockup's own onClick (carrinho, escala, etc.) fires AND the
  //     click listener above auto-advances the tour
  //   - missing target → fall back to advance() so the user is never stuck
  //
  // Pause-on-touch: any user interaction (pointerdown/keydown anywhere on
  // the document) resets the timer back to full duration. The progress bar
  // is keyed to autoAdvanceKey so it restarts the fill animation visually
  // each time. This lets a presenter touch the panel to "hold" the current
  // step while explaining without having to skip.
  useEffect(() => {
    if (!active || !step) return;
    if (autoAdvanceMs <= 0) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const fire = () => {
      if (step.requiresInteraction) {
        const el = document.querySelector(
          step.targetSelector,
        ) as HTMLElement | null;
        if (el) {
          el.click();
        } else {
          advance();
        }
      } else {
        advance();
      }
    };

    const startTimer = () => {
      setAutoAdvanceKey((k) => k + 1);
      timer = setTimeout(fire, autoAdvanceMs);
    };

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      startTimer();
    };

    startTimer();

    window.addEventListener("pointerdown", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("pointerdown", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
    // Keying off step?.id (not the whole object) prevents the timer from
    // restarting when the parent re-renders with a new reference of the
    // same step (which would otherwise reset the timer mid-step and never
    // let it fire).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, step?.id, autoAdvanceMs, advance]);

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
    autoAdvanceMs,
    autoAdvanceKey,
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
