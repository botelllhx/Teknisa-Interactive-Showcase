"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react";
import type { TourPlacement, TourStep } from "@/data/solutions";
import { cn } from "@/lib/cn";

export interface TourTooltipProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  position: { top: number; left: number };
  placement: TourPlacement;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const TOOLTIP_WIDTH = 320;

export function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  position,
  placement,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: TourTooltipProps) {
  const requiresInteraction = step.requiresInteraction === true;
  const actionLabel =
    step.actionLabel ??
    (requiresInteraction
      ? "Toque no elemento destacado"
      : isLast
        ? "Finalizar"
        : "Próximo");

  return (
    <motion.div
      key={step.id}
      role="dialog"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.96, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: TOOLTIP_WIDTH,
      }}
      className="pointer-events-auto z-[10000] rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.10)]"
    >
      <TooltipArrow placement={placement} />

      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-label-sm font-semibold text-brand">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
          Passo {stepIndex + 1} de {totalSteps}
        </span>
        <button
          type="button"
          onClick={onSkip}
          className="text-label-sm font-medium text-neutral-500 transition-colors hover:text-neutral-800"
        >
          Pular
        </button>
      </div>

      <h3 className="mt-3 font-display text-[18px] font-semibold leading-tight text-neutral-900">
        {step.title}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.55] text-neutral-600">
        {step.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Etapa anterior"
          className={cn(
            "inline-flex h-11 items-center gap-1.5 rounded-full border border-brand/15 bg-white px-4 text-[14px] font-semibold text-brand transition-colors",
            isFirst
              ? "cursor-not-allowed opacity-40"
              : "hover:bg-brand-ghost",
          )}
        >
          <ArrowLeft size={16} strokeWidth={2.25} />
          Anterior
        </button>

        {requiresInteraction ? (
          <span className="inline-flex h-11 items-center gap-2 rounded-full bg-brand-subtle px-4 text-[14px] font-semibold text-brand">
            <MousePointer2 size={16} strokeWidth={2.25} />
            {actionLabel}
          </span>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand px-5 text-[14px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {actionLabel}
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function TooltipArrow({ placement }: { placement: TourPlacement }) {
  const base = "absolute h-3 w-3 rotate-45 bg-white";

  switch (placement) {
    case "top":
    case "top-start":
      return (
        <span
          className={cn(base, "shadow-[2px_2px_2px_rgba(0,0,0,0.04)]")}
          style={{ bottom: -6, left: placement === "top-start" ? 24 : "50%", marginLeft: placement === "top-start" ? 0 : -6 }}
        />
      );
    case "bottom":
    case "bottom-end":
      return (
        <span
          className={cn(base, "shadow-[-2px_-2px_2px_rgba(0,0,0,0.04)]")}
          style={{ top: -6, left: placement === "bottom-end" ? "auto" : "50%", right: placement === "bottom-end" ? 24 : "auto", marginLeft: placement === "bottom-end" ? 0 : -6 }}
        />
      );
    case "left":
      return (
        <span
          className={cn(base, "shadow-[2px_-2px_2px_rgba(0,0,0,0.04)]")}
          style={{ right: -6, top: "50%", marginTop: -6 }}
        />
      );
    case "right":
      return (
        <span
          className={cn(base, "shadow-[-2px_2px_2px_rgba(0,0,0,0.04)]")}
          style={{ left: -6, top: "50%", marginTop: -6 }}
        />
      );
  }
}

export { TOOLTIP_WIDTH };
