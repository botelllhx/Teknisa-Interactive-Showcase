"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CompanionShellProps {
  label: string;
  sublabel?: string;
  live?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Visual wrapper that frames every companion as part of the operational
 * scene around the device. Adds a contextual header label and a small
 * "live" indicator so the companion reads as integrated equipment, not
 * a floating widget.
 *
 * Typography hierarchy:
 *  - eyebrow:  10px brand caps tracking 2px (label)
 *  - context:   9px neutral-400 (sublabel)
 *  - live pill: 8px success caps tracking
 */
export function CompanionShell({
  label,
  sublabel,
  live = true,
  pulse = false,
  className,
  children,
}: CompanionShellProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: pulse ? [1, 1.015, 1] : 1,
      }}
      transition={{
        duration: 0.3,
        scale: { duration: 0.5, ease: "easeOut" },
      }}
      className={cn(
        "flex w-full max-w-[380px] flex-col gap-2.5 font-ui",
        className,
      )}
    >
      {/* Context label */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-ui text-[11.5px] font-bold uppercase tracking-[2px] text-brand whitespace-nowrap">
            {label}
          </span>
          {sublabel && (
            <span className="truncate text-[10px] font-medium text-neutral-500">
              {sublabel}
            </span>
          )}
        </div>
        {live && (
          <span className="flex flex-none items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 ring-1 ring-success/15">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.18, 1] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="block h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_4px_rgba(22,163,74,0.6)]"
            />
            <span className="text-[9px] font-bold uppercase tracking-wider text-success">
              ao vivo
            </span>
          </span>
        )}
      </div>

      {/* Companion body */}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
