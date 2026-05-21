"use client";

import { useEffect, useRef, useState } from "react";

interface UseIdleTimerOptions {
  timeout?: number;
  graceTimeout?: number;
  onIdle?: () => void;
  onReset?: () => void;
  enabled?: boolean;
}

export function useIdleTimer({
  timeout = 90_000,
  graceTimeout = 5_000,
  onIdle,
  onReset,
  enabled = true,
}: UseIdleTimerOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const graceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsIdle(false);
      setShouldReset(false);
      return;
    }

    const clearTimers = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (graceTimer.current) clearTimeout(graceTimer.current);
    };

    const startTimers = () => {
      clearTimers();
      idleTimer.current = setTimeout(() => {
        setIsIdle(true);
        onIdle?.();
        graceTimer.current = setTimeout(() => {
          setShouldReset(true);
        }, graceTimeout);
      }, timeout);
    };

    const handleActivity = () => {
      setIsIdle((prev) => {
        if (prev) {
          onReset?.();
        }
        return false;
      });
      setShouldReset(false);
      startTimers();
    };

    const events: (keyof DocumentEventMap)[] = [
      "pointerdown",
      "pointermove",
      "touchstart",
      "keydown",
      "wheel",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    startTimers();

    return () => {
      clearTimers();
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [enabled, timeout, graceTimeout, onIdle, onReset]);

  return { isIdle, shouldReset };
}
