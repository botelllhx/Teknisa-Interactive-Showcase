"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, MousePointer2, X } from "lucide-react";
import { resolveText, type TourStep } from "@/data/solutions";
import { useTourLive } from "@/lib/tourState";

export interface TourTooltipProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  frameRect: DOMRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TOOLTIP_WIDTH = 360;
// Conservative default before we measure the actual tooltip; we always
// re-clamp after layout to fit the real height. Bigger estimate keeps the
// first paint from spilling past the viewport on tall tooltips.
const TOOLTIP_HEIGHT_ESTIMATE = 260;
const FRAME_GAP = 28;
const VIEWPORT_MARGIN = 20;

export type Anchor = "right" | "left" | "below" | "above" | "center";

export interface TooltipPosition {
  top: number;
  left: number;
  anchor: Anchor;
}

/**
 * Pick a tooltip position that lives OUTSIDE the device frame so the tooltip
 * never covers the mockup. Falls back to alongside the target when there is
 * no frame info (early renders).
 */
function computePosition(
  targetRect: DOMRect | null,
  frameRect: DOMRect | null,
  tooltipHeight: number = TOOLTIP_HEIGHT_ESTIMATE,
): TooltipPosition {
  if (typeof window === "undefined") {
    return { top: 80, left: 80, anchor: "center" };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // No frame yet → center fallback
  if (!frameRect) {
    return {
      top: vh / 2 - tooltipHeight / 2,
      left: vw / 2 - TOOLTIP_WIDTH / 2,
      anchor: "center",
    };
  }

  const targetCenterX = targetRect
    ? targetRect.left + targetRect.width / 2
    : frameRect.left + frameRect.width / 2;
  const targetCenterY = targetRect
    ? targetRect.top + targetRect.height / 2
    : frameRect.top + frameRect.height / 2;

  // Space available on each side of the frame
  const spaceRight = vw - frameRect.right - FRAME_GAP - VIEWPORT_MARGIN;
  const spaceLeft = frameRect.left - FRAME_GAP - VIEWPORT_MARGIN;
  const spaceBelow = vh - frameRect.bottom - FRAME_GAP - VIEWPORT_MARGIN;
  const spaceAbove = frameRect.top - FRAME_GAP - VIEWPORT_MARGIN;

  // Candidate placements, ordered by preference
  const candidates: Array<{ anchor: Anchor; fits: boolean; space: number }> = [
    { anchor: "right", fits: spaceRight >= TOOLTIP_WIDTH, space: spaceRight },
    { anchor: "left", fits: spaceLeft >= TOOLTIP_WIDTH, space: spaceLeft },
    {
      anchor: "below",
      fits: spaceBelow >= tooltipHeight,
      space: spaceBelow,
    },
    {
      anchor: "above",
      fits: spaceAbove >= tooltipHeight,
      space: spaceAbove,
    },
  ];

  const fitting = candidates.filter((c) => c.fits);
  let chosen: Anchor;
  if (fitting.length === 0) {
    chosen = candidates.sort((a, b) => b.space - a.space)[0].anchor;
  } else {
    chosen = fitting[0].anchor;
  }

  let top = 0;
  let left = 0;
  switch (chosen) {
    case "right":
      left = frameRect.right + FRAME_GAP;
      top = targetCenterY - tooltipHeight / 2;
      break;
    case "left":
      left = frameRect.left - FRAME_GAP - TOOLTIP_WIDTH;
      top = targetCenterY - tooltipHeight / 2;
      break;
    case "below":
      top = frameRect.bottom + FRAME_GAP;
      left = targetCenterX - TOOLTIP_WIDTH / 2;
      break;
    case "above":
      top = frameRect.top - FRAME_GAP - tooltipHeight;
      left = targetCenterX - TOOLTIP_WIDTH / 2;
      break;
    case "center":
    default:
      top = vh / 2 - tooltipHeight / 2;
      left = vw / 2 - TOOLTIP_WIDTH / 2;
  }

  // Clamp to viewport using the actual height
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, vw - TOOLTIP_WIDTH - VIEWPORT_MARGIN),
  );
  top = Math.max(
    VIEWPORT_MARGIN,
    Math.min(top, vh - tooltipHeight - VIEWPORT_MARGIN),
  );

  return { top, left, anchor: chosen };
}

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  frameRect,
  onNext,
  onSkip,
  isLast,
}: TourTooltipProps) {
  const live = useTourLive((s) => s.live);
  const requiresInteraction = step.requiresInteraction === true;
  const showNextButton = !requiresInteraction || isLast;

  const title = resolveText(step.title, live);
  const description = resolveText(step.description, live);
  const actionLabel = step.actionLabel
    ? resolveText(step.actionLabel, live)
    : isLast
      ? "Concluir"
      : "Próximo";

  // Measure the actual tooltip after layout so we can re-clamp against the
  // real height. Tooltip content varies (long dynamic descriptions, etc.),
  // so a fixed estimate is not enough to guarantee it never spills past
  // the viewport.
  const ref = useRef<HTMLDivElement | null>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(
    TOOLTIP_HEIGHT_ESTIMATE,
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const height = el.getBoundingClientRect().height;
    // setState with the same value is a no-op, so no infinite loop here.
    setMeasuredHeight(height);
  }, [step.id, title, description]);

  const pos = computePosition(targetRect, frameRect, measuredHeight);

  return (
    <motion.div
      ref={ref}
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
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />
          <span className="font-ui text-[13px] font-semibold uppercase tracking-wider text-brand">
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

      <h3 className="mt-3 font-ui text-[19px] font-bold leading-snug text-neutral-900">
        {title}
      </h3>
      <p className="mt-1.5 font-ui text-[15px] leading-relaxed text-neutral-600">
        {description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        {requiresInteraction && !isLast ? (
          <motion.span
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1.5 font-ui text-[13px] font-semibold uppercase tracking-wider text-brand"
          >
            <MousePointer2 size={15} strokeWidth={2.25} />
            Toque no destacado
          </motion.span>
        ) : (
          <span />
        )}

        {showNextButton && (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand px-5 font-ui text-[14px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {actionLabel}
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Compute the start point on the tooltip rectangle closest to the target,
 * so the connector line emerges from the tooltip's edge facing the target.
 */
export function tooltipEdgePoint(
  pos: TooltipPosition,
  targetCx: number,
  targetCy: number,
  tooltipHeight: number = TOOLTIP_HEIGHT_ESTIMATE,
): { x: number; y: number } {
  const left = pos.left;
  const right = pos.left + TOOLTIP_WIDTH;
  const top = pos.top;
  const bottom = pos.top + tooltipHeight;
  switch (pos.anchor) {
    case "right":
      return { x: left, y: clamp(targetCy, top + 16, bottom - 16) };
    case "left":
      return { x: right, y: clamp(targetCy, top + 16, bottom - 16) };
    case "above":
      return { x: clamp(targetCx, left + 16, right - 16), y: bottom };
    case "below":
      return { x: clamp(targetCx, left + 16, right - 16), y: top };
    case "center":
    default:
      return { x: left + TOOLTIP_WIDTH / 2, y: top + tooltipHeight / 2 };
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export { TOOLTIP_WIDTH, TOOLTIP_HEIGHT_ESTIMATE, computePosition };
