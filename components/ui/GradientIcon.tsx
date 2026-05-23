"use client";

import { cloneElement, type ReactElement } from "react";
import { cn } from "@/lib/cn";

interface GradientIconProps {
  /** Lucide icon element. Pass the unrendered icon, e.g. <Calendar /> */
  icon: ReactElement;
  /** Visual size in px. */
  size?: number;
  /** Tone palette — each maps to a balanced two-stop gradient. */
  tone?: "brand" | "ai" | "success" | "warning" | "danger" | "amber" | "teal" | "rose";
  /** Surface variant: "soft" puts the gradient in the BG behind a brand icon
   *  (Notion vibe), "solid" fills the icon area with the gradient and uses white. */
  variant?: "soft" | "solid";
  className?: string;
}

const TONES = {
  brand: { from: "#020788", to: "#7c3aed", softFrom: "#dbe4ff", softTo: "#ede9fe", text: "#020788" },
  ai: { from: "#1a1fa8", to: "#a855f7", softFrom: "#e0e7ff", softTo: "#f3e8ff", text: "#5b21b6" },
  success: { from: "#16a34a", to: "#0d9488", softFrom: "#d1fae5", softTo: "#ccfbf1", text: "#047857" },
  warning: { from: "#f59e0b", to: "#d97706", softFrom: "#fef3c7", softTo: "#fed7aa", text: "#b45309" },
  danger: { from: "#ef4444", to: "#dc2626", softFrom: "#fee2e2", softTo: "#fecaca", text: "#b91c1c" },
  amber: { from: "#f59e0b", to: "#ea580c", softFrom: "#fef3c7", softTo: "#ffedd5", text: "#c2410c" },
  teal: { from: "#0d9488", to: "#0891b2", softFrom: "#ccfbf1", softTo: "#cffafe", text: "#0f766e" },
  rose: { from: "#ec4899", to: "#a855f7", softFrom: "#fce7f3", softTo: "#f3e8ff", text: "#be185d" },
} as const;

/**
 * Notion-AI / Vercel-style decorative icon container. Two-stop gradient, soft
 * inner highlight, used to give every section its own subtle identity color
 * without screaming. Pair with ChipRemovable/Card for full vibe.
 */
export function GradientIcon({
  icon,
  size = 40,
  tone = "brand",
  variant = "soft",
  className,
}: GradientIconProps) {
  const t = TONES[tone];
  const iconSize = Math.floor(size * 0.45);

  if (variant === "solid") {
    return (
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl text-white",
          className,
        )}
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${t.from} 0%, ${t.to} 100%)`,
          boxShadow: `0 4px 14px ${t.from}26, inset 0 1px 0 rgba(255,255,255,0.22)`,
        }}
      >
        {wrap(icon, iconSize)}
      </span>
    );
  }

  // soft variant: pastel gradient bg + bold colored icon
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${t.softFrom} 0%, ${t.softTo} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.04)`,
        color: t.text,
      }}
    >
      {wrap(icon, iconSize)}
    </span>
  );
}

// Helper to size whatever lucide icon was passed in. lucide-react accepts
// `size` and `strokeWidth` props on every icon, so cloning is safe.
function wrap(icon: ReactElement, size: number) {
  return (
    <span style={{ display: "inline-flex" }} aria-hidden>
      {cloneElement(
        icon as ReactElement<{ size?: number; strokeWidth?: number }>,
        { size, strokeWidth: 2 },
      )}
    </span>
  );
}
