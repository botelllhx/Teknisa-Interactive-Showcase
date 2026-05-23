"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface ToggleSwitchProps {
  checked: boolean;
  onChange?: (next: boolean) => void;
  /** "default" pill, "labeled" includes inline ON/OFF caption. */
  variant?: "default" | "labeled";
  /** Tone of the on state. */
  tone?: "brand" | "success";
  disabled?: boolean;
  /** Optional descriptive label rendered to the left. */
  label?: string;
  /** Optional helper text rendered below the label. */
  description?: string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Smooth iOS/Apple-style toggle. Slides + scales + brand check on activation.
 * Reference: Roles & Permissions card ("Assign travel policies" ON).
 */
export function ToggleSwitch({
  checked,
  onChange,
  variant = "default",
  tone = "brand",
  disabled,
  label,
  description,
  size = "md",
  className,
}: ToggleSwitchProps) {
  const w = size === "sm" ? 36 : 46;
  const h = size === "sm" ? 22 : 28;
  const knob = h - 4;
  const offX = 2;
  const onX = w - knob - 2;

  const onColor =
    tone === "success"
      ? "linear-gradient(180deg, #22c55e, #16a34a)"
      : "linear-gradient(180deg, #1a1fa8, #020788)";

  const knobShadow =
    "0 2px 4px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)";

  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const Switch = (
    <button
      type="button"
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      style={{ width: w, height: h }}
      className={cn(
        "relative flex flex-none items-center rounded-full transition-colors disabled:opacity-50",
        checked ? "" : "bg-neutral-200",
        !disabled && "cursor-pointer",
      )}
    >
      {/* On background */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        style={{ background: onColor }}
        className="absolute inset-0 rounded-full"
      />
      {/* Knob */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ x: checked ? onX : offX }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        style={{
          width: knob,
          height: knob,
          boxShadow: knobShadow,
        }}
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white"
      >
        {variant === "labeled" && checked && (
          <span className="flex h-full w-full items-center justify-center text-success">
            <Check size={Math.floor(knob * 0.55)} strokeWidth={3} />
          </span>
        )}
      </motion.span>
    </button>
  );

  if (!label && !description) return <span className={className}>{Switch}</span>;

  return (
    <div
      className={cn("flex items-center justify-between gap-3", className)}
    >
      <div className="min-w-0 flex-1">
        {label && (
          <p className="font-ui text-[13px] font-medium text-neutral-900">
            {label}
          </p>
        )}
        {description && (
          <p className="mt-0.5 font-ui text-[11px] text-neutral-500">
            {description}
          </p>
        )}
      </div>
      {Switch}
    </div>
  );
}
