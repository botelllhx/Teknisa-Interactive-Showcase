"use client";

import { motion } from "framer-motion";
import { ArrowRight, MousePointer2, X } from "lucide-react";
import { resolveText, type TourStep } from "@/data/solutions";
import { useTourLive } from "@/lib/tourState";

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

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT_ESTIMATE = 168;
const TOOLTIP_GAP = 28;
const VIEWPORT_MARGIN = 20;

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

  const centerRatio = targetCenterX / vw;
  const isInCenterZone = centerRatio > 0.3 && centerRatio < 0.7;

  let top = 0;
  let left = 0;
  let arrowDirection: ArrowDirection = "none";
  let arrowOffset = TOOLTIP_WIDTH / 2;

  const tryRight = () =>
    spaceRight >= TOOLTIP_WIDTH + TOOLTIP_GAP + VIEWPORT_MARGIN;
  const tryLeft = () =>
    spaceLeft >= TOOLTIP_WIDTH + TOOLTIP_GAP + VIEWPORT_MARGIN;
  const tryBelow = () =>
    spaceBelow >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN;
  const tryAbove = () =>
    spaceAbove >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN;

  const placeRight = () => {
    left = rect.right + TOOLTIP_GAP;
    top = targetCenterY - TOOLTIP_HEIGHT_ESTIMATE / 2;
    arrowDirection = "left";
    arrowOffset = Math.max(
      16,
      Math.min(targetCenterY - top, TOOLTIP_HEIGHT_ESTIMATE - 32),
    );
  };
  const placeLeft = () => {
    left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
    top = targetCenterY - TOOLTIP_HEIGHT_ESTIMATE / 2;
    arrowDirection = "right";
    arrowOffset = Math.max(
      16,
      Math.min(targetCenterY - top, TOOLTIP_HEIGHT_ESTIMATE - 32),
    );
  };
  const placeBelow = () => {
    top = rect.bottom + TOOLTIP_GAP;
    left = targetCenterX - TOOLTIP_WIDTH / 2;
    arrowDirection = "top";
    arrowOffset = Math.max(
      16,
      Math.min(targetCenterX - left, TOOLTIP_WIDTH - 32),
    );
  };
  const placeAbove = () => {
    top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
    left = targetCenterX - TOOLTIP_WIDTH / 2;
    arrowDirection = "bottom";
    arrowOffset = Math.max(
      16,
      Math.min(targetCenterX - left, TOOLTIP_WIDTH - 32),
    );
  };

  let placed = false;

  if (isInCenterZone) {
    if (tryBelow()) {
      placeBelow();
      placed = true;
    } else if (tryAbove()) {
      placeAbove();
      placed = true;
    } else if (tryRight()) {
      placeRight();
      placed = true;
    } else if (tryLeft()) {
      placeLeft();
      placed = true;
    }
  } else {
    if (centerRatio <= 0.3) {
      if (tryRight()) {
        placeRight();
        placed = true;
      } else if (tryBelow()) {
        placeBelow();
        placed = true;
      } else if (tryAbove()) {
        placeAbove();
        placed = true;
      } else if (tryLeft()) {
        placeLeft();
        placed = true;
      }
    } else {
      if (tryLeft()) {
        placeLeft();
        placed = true;
      } else if (tryBelow()) {
        placeBelow();
        placed = true;
      } else if (tryAbove()) {
        placeAbove();
        placed = true;
      } else if (tryRight()) {
        placeRight();
        placed = true;
      }
    }
  }

  if (!placed) {
    if (spaceBelow > spaceAbove) {
      placeBelow();
    } else {
      placeAbove();
    }
  }

  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, vw - TOOLTIP_WIDTH - VIEWPORT_MARGIN),
  );
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, vh - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN),
  );

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
  const live = useTourLive((s) => s.live);
  const pos = computePosition(targetRect);
  const requiresInteraction = step.requiresInteraction === true;
  const showNextButton = !requiresInteraction || isLast;

  const title = resolveText(step.title, live);
  const description = resolveText(step.description, live);
  const actionLabel = step.actionLabel
    ? resolveText(step.actionLabel, live)
    : isLast
      ? "Concluir"
      : "Próximo";

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
      className="pointer-events-auto z-[10000] rounded-2xl bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.18),0_2px_12px_rgba(0,0,0,0.08)] font-ui"
    >
      <TooltipArrow direction={pos.arrowDirection} offset={pos.arrowOffset} />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />
          <span className="font-ui text-[12px] font-semibold uppercase tracking-wider text-brand">
            Passo {stepIndex + 1} de {totalSteps}
          </span>
        </div>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Pular tour"
          className="-mr-1 -mt-1 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X size={14} strokeWidth={2.25} />
        </button>
      </div>

      <h3 className="mt-3 font-ui text-[17px] font-bold leading-snug text-neutral-900">
        {title}
      </h3>
      <p className="mt-1.5 font-ui text-[14px] leading-relaxed text-neutral-600">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        {requiresInteraction && !isLast ? (
          <motion.span
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 font-ui text-[12px] font-semibold uppercase tracking-wider text-brand"
          >
            <MousePointer2 size={14} strokeWidth={2.25} />
            Toque para continuar
          </motion.span>
        ) : (
          <span />
        )}

        {showNextButton && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 font-ui text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {actionLabel}
            <ArrowRight size={14} strokeWidth={2.5} />
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
  const size = 12;

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
