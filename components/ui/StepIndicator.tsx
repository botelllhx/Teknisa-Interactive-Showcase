"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { FlowStep } from "@/data/solutions";
import { cn } from "@/lib/cn";

interface StepIndicatorProps {
  steps: FlowStep[];
  currentStep: number;
  className?: string;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
  onStepClick,
}: StepIndicatorProps) {
  if (steps.length === 0) return null;
  const progress = steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="absolute left-5 right-5 top-5 h-[2px] -translate-y-1/2 rounded-full bg-neutral-200" />
        <motion.div
          className="absolute left-5 top-5 h-[2px] -translate-y-1/2 rounded-full bg-brand"
          initial={false}
          animate={{ width: `calc(${progress}% - ${progress > 0 ? 40 : 0}px)` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        <ol className="relative flex items-start justify-between gap-2">
          {steps.map((step, i) => {
            const status: "future" | "active" | "done" =
              i < currentStep ? "done" : i === currentStep ? "active" : "future";
            const clickable = onStepClick && i <= currentStep;

            return (
              <li key={step.id} className="flex flex-1 flex-col items-center">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(i)}
                  aria-label={`Etapa ${i + 1}: ${step.label}`}
                  aria-current={status === "active" ? "step" : undefined}
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                    status === "done" &&
                      "border-brand bg-brand text-white shadow-brand",
                    status === "active" &&
                      "border-brand bg-white text-brand shadow-brand",
                    status === "future" &&
                      "border-neutral-300 bg-white text-neutral-500",
                    !clickable && "cursor-default",
                  )}
                >
                  {status === "done" ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <span className="font-display text-body-md font-semibold">
                      {i + 1}
                    </span>
                  )}
                  {status === "active" && (
                    <motion.span
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 rounded-full ring-2 ring-brand/40"
                    />
                  )}
                </button>
                <span
                  className={cn(
                    "mt-2 max-w-[14ch] text-center text-label-sm font-medium leading-tight transition-colors",
                    status === "future" ? "text-neutral-500" : "text-neutral-800",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
