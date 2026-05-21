"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";
import type { TourStep } from "@/data/solutions";
import { cn } from "@/lib/cn";

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

const TOOLTIP_WIDTH = 340;
const TOOLTIP_HEIGHT_ESTIMATE = 200;
const TOOLTIP_GAP = 16;
const VIEWPORT_MARGIN = 16;

type ArrowDirection = "top" | "bottom" | "none";

interface Position {
  top: number;
  left: number;
  arrowDirection: ArrowDirection;
  arrowLeft: number;
}

function computePosition(rect: DOMRect | null): Position {
  if (!rect || typeof window === "undefined") {
    return {
      top: window?.innerHeight ? window.innerHeight / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2 : 200,
      left: window?.innerWidth ? window.innerWidth / 2 - TOOLTIP_WIDTH / 2 : 200,
      arrowDirection: "none",
      arrowLeft: TOOLTIP_WIDTH / 2,
    };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const targetCenterX = rect.left + rect.width / 2;
  let left = targetCenterX - TOOLTIP_WIDTH / 2;
  left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(left, vw - TOOLTIP_WIDTH - VIEWPORT_MARGIN),
  );

  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;

  let top: number;
  let arrowDirection: ArrowDirection;
  if (spaceBelow >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    top = rect.bottom + TOOLTIP_GAP;
    arrowDirection = "top";
  } else if (spaceAbove >= TOOLTIP_HEIGHT_ESTIMATE + TOOLTIP_GAP + VIEWPORT_MARGIN) {
    top = rect.top - TOOLTIP_HEIGHT_ESTIMATE - TOOLTIP_GAP;
    arrowDirection = "bottom";
  } else {
    // Fallback: anchor on the side with more space, clamped
    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        rect.top + rect.height / 2 - TOOLTIP_HEIGHT_ESTIMATE / 2,
        vh - TOOLTIP_HEIGHT_ESTIMATE - VIEWPORT_MARGIN,
      ),
    );
    arrowDirection = "none";
  }

  const arrowLeft = Math.max(
    16,
    Math.min(targetCenterX - left, TOOLTIP_WIDTH - 32),
  );

  return { top, left, arrowDirection, arrowLeft };
}

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: TourTooltipProps) {
  const pos = computePosition(targetRect);
  const requiresInteraction = step.requiresInteraction === true;
  const actionLabel =
    step.actionLabel ??
    (isLast
      ? "Concluir"
      : requiresInteraction
        ? "Toque no elemento destacado"
        : "Próximo");

  return (
    <motion.div
      key={step.id}
      role="dialog"
      aria-live="polite"
      initial={{
        opacity: 0,
        y: pos.arrowDirection === "top" ? -8 : pos.arrowDirection === "bottom" ? 8 : 0,
        scale: 0.96,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: TOOLTIP_WIDTH,
      }}
      className="pointer-events-auto z-[10000] rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <TooltipArrow direction={pos.arrowDirection} leftOffset={pos.arrowLeft} />

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-ui text-[13px] font-semibold text-brand">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
          Passo {stepIndex + 1} de {totalSteps}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="font-ui text-[13px] font-medium text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Pular
        </button>
      </div>

      <h3 className="mt-3 font-display text-[18px] font-semibold leading-tight text-neutral-900">
        {step.title}
      </h3>
      <p className="mt-2 font-ui text-[14px] leading-[1.6] text-neutral-600">
        {step.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Etapa anterior"
          className={cn(
            "inline-flex h-10 items-center gap-1.5 rounded-full border border-brand/15 bg-white px-4 font-ui text-[13px] font-semibold text-brand transition-colors",
            isFirst
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-brand-ghost",
          )}
        >
          <ArrowLeft size={14} strokeWidth={2.25} />
          Anterior
        </button>

        {requiresInteraction && !isLast ? (
          <span className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-subtle px-4 font-ui text-[13px] font-semibold text-brand">
            <MousePointer2 size={14} strokeWidth={2.25} />
            {actionLabel}
          </span>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-brand px-5 font-ui text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {actionLabel}
            <ArrowRight size={14} strokeWidth={2.25} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function TooltipArrow({
  direction,
  leftOffset,
}: {
  direction: ArrowDirection;
  leftOffset: number;
}) {
  if (direction === "none") return null;
  const isTop = direction === "top";

  return (
    <span
      aria-hidden
      className="absolute"
      style={{
        top: isTop ? -7 : undefined,
        bottom: !isTop ? -7 : undefined,
        left: leftOffset - 7,
        width: 14,
        height: 14,
        background: "white",
        transform: "rotate(45deg)",
        boxShadow: isTop
          ? "-2px -2px 4px rgba(0,0,0,0.04)"
          : "2px 2px 4px rgba(0,0,0,0.04)",
      }}
    />
  );
}

export { TOOLTIP_WIDTH };
