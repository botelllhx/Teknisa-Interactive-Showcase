"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface HighlightArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PulsingDotProps {
  area?: HighlightArea;
  className?: string;
  variant?: "dot" | "area";
}

export function PulsingDot({ area, className, variant = "area" }: PulsingDotProps) {
  if (!area) return null;

  if (variant === "dot") {
    const cx = area.x + area.width / 2;
    const cy = area.y + area.height / 2;

    return (
      <div
        className={cn("pointer-events-none absolute z-30", className)}
        style={{
          left: `${cx}%`,
          top: `${cy}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Ring />
      </div>
    );
  }

  return (
    <div
      className={cn("pointer-events-none absolute z-30", className)}
      style={{
        left: `${area.x}%`,
        top: `${area.y}%`,
        width: `${area.width}%`,
        height: `${area.height}%`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative h-full w-full rounded-xl ring-2 ring-brand/40"
        style={{ boxShadow: "0 0 0 4px rgba(2,7,136,0.08)" }}
      >
        <span className="absolute inset-0 animate-pulse rounded-xl bg-brand/5" />
        <div className="absolute -right-3 -top-3">
          <Ring />
        </div>
      </motion.div>
    </div>
  );
}

function Ring() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      <motion.span
        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-brand/40"
      />
      <motion.span
        animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="absolute inset-0 rounded-full bg-brand/30"
      />
      <span className="relative h-4 w-4 rounded-full bg-brand shadow-brand" />
    </div>
  );
}
