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
      <span className="absolute -left-1 top-24 h-12 w-1 rounded-l-full bg-frame-bezel" />
      <span className="absolute -left-1 top-40 h-20 w-1 rounded-l-full bg-frame-bezel" />
      <span className="absolute -right-1 top-32 h-16 w-1 rounded-r-full bg-frame-bezel" />

      <div className="rounded-device bg-frame-body p-2 shadow-frame">
        <div className="relative overflow-hidden rounded-[22px] bg-white" style={{ aspectRatio: "9 / 19.5" }}>
          <div className="absolute left-1/2 top-2 z-10 flex h-5 -translate-x-1/2 items-center gap-1 rounded-full bg-frame-body/80 px-3 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span className="h-1 w-8 rounded-full bg-neutral-300" />
          </div>
          <div className="absolute inset-0 pt-9">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
