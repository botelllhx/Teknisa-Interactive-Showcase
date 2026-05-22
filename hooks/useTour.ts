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

    const measure = () => {
      const el = document.querySelector(step.targetSelector) as HTMLElement | null;
      if (!el) {
        setGeometry(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      const computed = window.getComputedStyle(el);
      const radius = parseFloat(computed.borderRadius) || 12;
      const frameEl = document.querySelector(
        "[data-tour-frame]",
      ) as HTMLElement | null;
      const frameRect = frameEl ? frameEl.getBoundingClientRect() : null;
      setGeometry({ rect, frameRect, borderRadius: radius });
    };

    const scheduleMeasure = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(measure);
    };

    scheduleMeasure();

    // Poll briefly to wait for mockup transition animations to settle
    let polls = 0;
    intervalId = setInterval(() => {
      scheduleMeasure();
      polls += 1;
      if (polls > 8) {
        if (intervalId) clearInterval(intervalId);
      }
    }, 80);

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
