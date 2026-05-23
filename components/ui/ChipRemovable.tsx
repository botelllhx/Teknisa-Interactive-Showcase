"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChipRemovableProps {
  /** Visible label. */
  label: string;
  /** Optional leading icon (lucide). */
  leading?: React.ReactNode;
  /** Tone variants. */
  tone?: "brand" | "neutral" | "success" | "warning" | "danger";
  onRemove?: () => void;
  /** Visual size. */
  size?: "sm" | "md";
  className?: string;
}

const TONES = {
  brand: {
    bg: "bg-brand-ghost",
    border: "border-brand/15",
    text: "text-brand",
    iconBg: "hover:bg-brand/10",
  },
  neutral: {
    bg: "bg-neutral-100",
    border: "border-neutral-200",
    text: "text-neutral-700",
    iconBg: "hover:bg-neutral-200",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/25",
    text: "text-success",
    iconBg: "hover:bg-success/15",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/25",
    text: "text-warning",
    iconBg: "hover:bg-warning/15",
  },
  danger: {
    bg: "bg-danger/10",
    border: "border-danger/25",
    text: "text-danger",
    iconBg: "hover:bg-danger/15",
  },
} as const;

/**
 * Pill chip with a close ✕ button — Roles & Permissions ref ("Liam Carter ✕").
 * Animates in with scale, X button has hover background.
 */
export function ChipRemovable({
  label,
  leading,
  tone = "brand",
  onRemove,
  size = "md",
  className,
}: ChipRemovableProps) {
  const t = TONES[tone];
  const padY = size === "sm" ? "py-0.5" : "py-1";
  const padX = size === "sm" ? "px-2" : "px-2.5";
  const text = size === "sm" ? "text-[10px]" : "text-[11px]";
  const closeSize = size === "sm" ? 10 : 12;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-ui font-medium",
        padY,
        padX,
        text,
        t.bg,
        t.border,
        t.text,
        className,
      )}
    >
      {leading && <span className="-ml-0.5">{leading}</span>}
      <span className="whitespace-nowrap">{label}</span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remover ${label}`}
          onClick={onRemove}
          className={cn(
            "ml-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full transition-colors",
            t.iconBg,
          )}
        >
          <X size={closeSize} strokeWidth={2.5} />
        </button>
      )}
    </motion.span>
  );
}
