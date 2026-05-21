"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface MobileFrameProps {
  children?: ReactNode;
  className?: string;
}

export function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <span aria-hidden className="absolute -left-1 top-24 h-12 w-1 rounded-l-full bg-frame-bezel shadow-[inset_-1px_0_0_rgba(0,0,0,0.06)]" />
      <span aria-hidden className="absolute -left-1 top-40 h-20 w-1 rounded-l-full bg-frame-bezel shadow-[inset_-1px_0_0_rgba(0,0,0,0.06)]" />
      <span aria-hidden className="absolute -right-1 top-32 h-16 w-1 rounded-r-full bg-frame-bezel shadow-[inset_1px_0_0_rgba(0,0,0,0.06)]" />

      <div className="rounded-[40px] bg-gradient-to-b from-frame-body via-frame-body to-[#d8dbe2] p-3 pb-5 shadow-[0_32px_80px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.08)]">
        <div className="relative overflow-hidden rounded-[32px] bg-white" style={{ aspectRatio: "9 / 19.5" }}>
          <div className="absolute left-1/2 top-2 z-10 flex h-[22px] w-[80px] -translate-x-1/2 items-center justify-center gap-1.5 rounded-full bg-frame-bezel/95 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400/80" />
            <span className="h-1 w-3 rounded-full bg-neutral-300" />
          </div>
          <div className="absolute inset-0 pt-9">{children}</div>
          <span aria-hidden className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-frame-bezel/80" />
        </div>
      </div>
    </motion.div>
  );
}
