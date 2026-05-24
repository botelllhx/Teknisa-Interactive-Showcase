"use client";

import { motion } from "framer-motion";
import { cloneElement, type ReactElement } from "react";
import { cn } from "@/lib/cn";

interface InsightCardProps {
  icon: ReactElement;
  /** Icon tone — drives bg + accent. */
  tone: "brand" | "ai" | "success" | "warning" | "danger" | "teal";
  /** Label / category like "Lead Quality Surge". */
  title: string;
  /** Body description. */
  description: string;
  /** Confidence 0-100. Renders a colored gradient bar at the bottom. */
  confidence: number;
  /** Status shown as a tiny pill (e.g. "IA aplicou", "Sugerido"). */
  status?: string;
  className?: string;
  /** Optional click handler if the card is interactive. */
  onClick?: () => void;
  /** Optional data-tour selector. */
  "data-tour"?: string;
}

const TONE_STYLES = {
  brand: { iconBg: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", iconColor: "#020788", bar: "linear-gradient(90deg, #020788, #6366f1)" },
  ai: { iconBg: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)", iconColor: "#7c3aed", bar: "linear-gradient(90deg, #7c3aed, #a855f7)" },
  success: { iconBg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", iconColor: "#16a34a", bar: "linear-gradient(90deg, #16a34a, #4ade80)" },
  warning: { iconBg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", iconColor: "#d97706", bar: "linear-gradient(90deg, #d97706, #fbbf24)" },
  danger: { iconBg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", iconColor: "#dc2626", bar: "linear-gradient(90deg, #dc2626, #f87171)" },
  teal: { iconBg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)", iconColor: "#0d9488", bar: "linear-gradient(90deg, #0d9488, #2dd4bf)" },
} as const;

/**
 * Reference: "AI Insights" column from the SaaS dashboard reference image —
 * stacked cards with icon + label + body + a colored confidence bar at the
 * bottom that visualizes 0-100% confidence.
 */
export function InsightCard({
  icon,
  tone,
  title,
  description,
  confidence,
  status,
  className,
  onClick,
  ...rest
}: InsightCardProps) {
  const styles = TONE_STYLES[tone];
  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      data-tour={rest["data-tour"]}
      whileHover={onClick ? { y: -1 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-white text-left transition-shadow",
        onClick && "hover:shadow-elevated",
        className,
      )}
      style={{
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="px-3.5 pb-3 pt-3">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            style={{ background: styles.iconBg, color: styles.iconColor }}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
          >
            {cloneElement(icon as ReactElement<{ size?: number; strokeWidth?: number }>, {
              size: 16,
              strokeWidth: 2.25,
            })}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="font-ui text-[12px] font-bold leading-tight text-neutral-900"
              style={{ letterSpacing: "-0.005em" }}
            >
              {title}
            </p>
            <p className="mt-1 line-clamp-3 font-ui text-[10.5px] leading-snug text-neutral-500">
              {description}
            </p>
            {status && (
              <span
                className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-ghost px-1.5 py-0.5 font-ui text-[8px] font-bold uppercase tracking-wider text-brand"
              >
                <span className="h-1 w-1 rounded-full bg-brand" />
                {status}
              </span>
            )}
          </div>
          <span
            className="font-ui text-[9px] font-bold tabular-nums"
            style={{ color: styles.iconColor, letterSpacing: "0.05em" }}
          >
            {confidence}%
          </span>
        </div>
      </div>
      {/* Confidence bar */}
      <div className="h-1 w-full bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", background: styles.bar }}
        />
      </div>
    </Component>
  );
}
