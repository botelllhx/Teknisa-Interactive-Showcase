"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface KioskFrameProps {
  children?: ReactNode;
  className?: string;
}

export function KioskFrame({ children, className }: KioskFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
    >
      <div className="rounded-frame bg-frame-body p-4 shadow-frame">
        <div
          className="relative overflow-hidden rounded-[16px] bg-white"
          style={{ aspectRatio: "9 / 16" }}
        >
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-neutral-300" />
          {children}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 rounded-md bg-frame-screen px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-success/70" />
          <span className="font-display text-caption font-semibold uppercase tracking-wider text-neutral-500">
            Teknisa
          </span>
        </div>
      </div>
      <div className="mt-1 h-2 w-3/4 rounded-b-3xl bg-frame-bezel" />
      <div className="mt-px h-6 w-full max-w-[90%] rounded-b-frame bg-frame-bezel/70 shadow-[0_8px_18px_rgba(0,0,0,0.08)]" />
    </motion.div>
  );
}
