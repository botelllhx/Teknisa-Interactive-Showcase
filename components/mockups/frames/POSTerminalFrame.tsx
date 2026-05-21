"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface POSTerminalFrameProps {
  children?: ReactNode;
  className?: string;
  showKeypad?: boolean;
}

export function POSTerminalFrame({
  children,
  className,
  showKeypad = true,
}: POSTerminalFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <div className="rounded-frame bg-frame-body p-3 shadow-frame">
        <div
          className="relative overflow-hidden rounded-[12px] bg-white"
          style={{ aspectRatio: "16 / 10" }}
        >
          {children}
        </div>

        {showKeypad && (
          <div className="mt-3 grid grid-cols-4 gap-2 rounded-frame-inner bg-frame-screen p-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-hidden
                className="flex h-12 items-center justify-center rounded-md bg-white font-display text-heading-lg font-semibold text-neutral-700 shadow-card"
                tabIndex={-1}
              >
                {keyLabel(i)}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function keyLabel(index: number): string {
  if (index === 9) return "*";
  if (index === 10) return "0";
  if (index === 11) return "#";
  return String(index + 1);
}
