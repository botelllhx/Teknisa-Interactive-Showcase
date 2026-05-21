"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { TargetGeometry } from "@/hooks/useTour";
import type { TourPlacement, TourStep } from "@/data/solutions";
import { TOOLTIP_WIDTH, TourTooltip } from "./TourTooltip";
import { PulsingDot } from "./PulsingDot";

interface TourOverlayProps {
  active: boolean;
  step: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  geometry: TargetGeometry | null;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const SPOTLIGHT_PADDING = 8;
const TOOLTIP_GAP = 20;
const TOOLTIP_HEIGHT_ESTIMATE = 220;
const VIEWPORT_MARGIN = 16;
const DOT_SIZE = 48;

export function TourOverlay({
  active,
  step,
  stepIndex,
  totalSteps,
  geometry,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: TourOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipPosition = useMemo(() => {
    if (!geometry || !step) {
      return { top: 0, left: 0 };
    }
    return computeTooltipPosition(geometry.rect, step.placement);
  }, [geometry, step]);

  const dotPosition = useMemo(() => {
    if (!geometry) return null;
    const { rect } = geometry;
    return {
      top: rect.top + rect.height / 2 - DOT_SIZE / 2,
      left: rect.right - DOT_SIZE / 2 - 4,
    };
  }, [geometry]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {active && step && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[9999]"
        >
          <Spotlight geometry={geometry} />

          {geometry && step.requiresInteraction && dotPosition && (
            <div
              className="pointer-events-none fixed z-[10000]"
              style={{ top: dotPosition.top, left: dotPosition.left }}
            >
              <PulsingDot size={DOT_SIZE} />
            </div>
          )}

          {!geometry && (
            <div className="pointer-events-none fixed inset-0 bg-black/55 backdrop-blur-[2px]" />
          )}

          <TourTooltip
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            position={tooltipPosition}
            placement={step.placement}
            onNext={onNext}
            onPrev={onPrev}
            onSkip={onSkip}
            isFirst={isFirst}
            isLast={isLast}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Spotlight({ geometry }: { geometry: TargetGeometry | null }) {
  if (!geometry) return null;
  const { rect, borderRadius } = geometry;
  const padded = {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        top: padded.top,
        left: padded.left,
        width: padded.width,
        height: padded.height,
        borderRadius,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
      className="pointer-events-none fixed"
      style={{
        boxShadow:
          "0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 2px rgba(2,7,136,0.5)",
      }}
    />
  );
}

function computeTooltipPosition(
  rect: DOMRect,
  placement: TourPlacement,
): { top: number; left: number } {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "top-start":
      top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
      left = rect.left;
      break;
    case "bottom":
      top = rect.bottom + TOOLTIP_GAP;
      left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "bottom-end":
      top = rect.bottom + TOOLTIP_GAP;
      left = rect.right - TOOLTIP_WIDTH;
      break;
    case "left":
      top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
      left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
      break;
    case "right":
      top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2;
      left = rect.right + TOOLTIP_GAP;
      break;
  }

  // Clamp to viewport with margin
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, viewportWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN),
  );
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, viewportHeight - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN),
  );

  return { top, left };
}
