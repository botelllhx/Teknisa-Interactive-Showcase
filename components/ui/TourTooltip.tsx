"use client";

import { motion } from "framer-motion";
import { ArrowRight, MousePointer2, X } from "lucide-react";
import type { TourStep } from "@/data/solutions";

export interface TourTooltipProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TOOLTIP_WIDTH = 280;
const TOOLTIP_HEIGHT_ESTIMATE = 140;
const TOOLTIP_GAP = 14;
const VIEWPORT_MARGIN = 16;

type ArrowDirection = "top" | "bottom" | "left" | "right" | "none";

interface Position {
  top: number;
  left: number;
  arrowDirection: ArrowDirection;
  arrowOffset: number;
}

function computePosition(rect: DOMRect | null): Position {
  if (!rect || typeof window === "undefined") {
    const w = typeof window !== "undefined" ? window.innerWidth : 1920;
    const h = typeof window !== "undefined" ? window.innerHeight : 1080;
    return {
      top: h / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2,
      left: w / 2 - TOOLTIP_WIDTH / 2,
      arrowDirection: "none",
      arrowOffset: TOOLTIP_WIDTH / 2,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const targetCenterX = rect.left + rect.width / 2;
  const targetCenterY = rect.top + rect.height / 2;

  const spaceRight = vw - rect.right;
  const spaceLeft = rect.left;
  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;

  // Prefer side placement when target is wide enough
  // Order of preference: right, left, bottom, top
  let top = 0;
  let left = 0;
  let arrowDirection: ArrowDirection = "none";
  let arrowOffset = TOOLTIP_WIDTH / 2;

  if (spaceRight >= TOOLTIP_WIDTH + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    left = rect.right + TOOLTIP_GAP;
    top = targetCenterY - TOOLTIP_HEIGHT_ESTIMATE / 2;
    arrowDirection = "left";
    arrowOffset = Math.max(16, Math.min(targetCenterY - top, TOOLTIP_HEIGHT_ESTIMATE - 32));
  } else if (spaceLeft >= TOOLTIP_WIDTH + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
    top = targetCenterY - TOOLTIP_HEIGHT_ESTIMATE / 2;
    arrowDirection = "right";
    arrowOffset = Math.max(16, Math.min(targetCenterY - top, TOOLTIP_HEIGHT_ESTIMATE - 32));
  } else if (spaceBelow >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    top = rect.bottom + TOOLTIP_GAP;
    left = targetCenterX - TOOLTIP_WIDTH / 2;
    arrowDirection = "top";
    arrowOffset = Math.max(16, Math.min(targetCenterX - left, TOOLTIP_WIDTH - 32));
  } else if (spaceAbove >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
    left = targetCenterX - TOOLTIP_WIDTH / 2;
    arrowDirection = "bottom";
    arrowOffset = Math.max(16, Math.min(targetCenterX - left, TOOLTIP_WIDTH - 32));
  } else {
    // No good spot; center but don't draw arrow
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(targetCenterY - TOOLTIP_HEIGHT_ESTIMATE / 2, vh - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN),
    );
    left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(targetCenterX - TOOLTIP_WIDTH / 2, vw - TOOLTIP_WIDTH - VIEWPORT_MARGIN),
    );
    arrowDirection = "none";
  }

  // Clamp to viewport
  left = Math.max(VIEWPORT_MARGIN, Math.min(left, vw - TOOLTIP_WIDTH - VIEWPORT_MARGIN));
  top = Math.max(VIEWPORT_MARGIN, Math.min(top, vh - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN));

  return { top, left, arrowDirection, arrowOffset };
}

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onSkip,
  isLast,
}: TourTooltipProps) {
  const pos = computePosition(targetRect);
  const requiresInteraction = step.requiresInteraction === true;
  const showNextButton = !requiresInteraction || isLast;
  const actionLabel = step.actionLabel ?? (isLast ? "Concluir" : "Próximo");

  return (
    <motion.div
      key={step.id}
      role="dialog"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: TOOLTIP_WIDTH,
      }}
      className="pointer-events-auto z-[10000] rounded-2xl bg-white p-4 shadow-[0_16px_48px_rgba(0,0,0,0.18),0_2px_12px_rgba(0,0,0,0.08)]"
    >
      <TooltipArrow direction={pos.arrowDirection} offset={pos.arrowOffset} />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="font-ui text-[11px] font-semibold uppercase tracking-wider text-brand">
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Pular tour"
          className="-mr-1 -mt-1 flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X size={13} strokeWidth={2.25} />
        </button>
      </div>

      <h3 className="mt-2 font-display text-[15px] font-semibold leading-snug text-neutral-900">
        {step.title}
      </h3>
      <p className="mt-1 font-ui text-[12.5px] leading-snug text-neutral-600">
        {step.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        {requiresInteraction && !isLast ? (
          <motion.span
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 font-ui text-[11px] font-semibold uppercase tracking-wider text-brand"
          >
            <MousePointer2 size={13} strokeWidth={2.25} />
            Toque para continuar
          </motion.span>
        ) : (
          <span />
        )}

        {showNextButton && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-brand px-3.5 font-ui text-[12px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {actionLabel}
            <ArrowRight size={12} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function TooltipArrow({
  direction,
  offset,
}: {
  direction: ArrowDirection;
  offset: number;
}) {
  if (direction === "none") return null;
  const size = 10;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: size,
    height: size,
    background: "white",
    transform: "rotate(45deg)",
  };

  switch (direction) {
    case "top":
      return (
        <span
          aria-hidden
          style={{
            ...baseStyle,
            top: -size / 2,
            left: offset - size / 2,
            boxShadow: "-1px -1px 2px rgba(0,0,0,0.04)",
          }}
        />
      );
    case "bottom":
      return (
        <span
          aria-hidden
          style={{
            ...baseStyle,
            bottom: -size / 2,
            left: offset - size / 2,
            boxShadow: "1px 1px 2px rgba(0,0,0,0.04)",
          }}
        />
      );
    case "left":
      return (
        <span
          aria-hidden
          style={{
            ...baseStyle,
            left: -size / 2,
            top: offset - size / 2,
            boxShadow: "-1px 1px 2px rgba(0,0,0,0.04)",
          }}
        />
      );
    case "right":
      return (
        <span
          aria-hidden
          style={{
            ...baseStyle,
            right: -size / 2,
            top: offset - size / 2,
            boxShadow: "1px -1px 2px rgba(0,0,0,0.04)",
          }}
        />
      );
  }
}

export { TOOLTIP_WIDTH };
