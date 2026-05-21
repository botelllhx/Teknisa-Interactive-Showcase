"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TabletFrameProps {
  children?: ReactNode;
  className?: string;
  orientation?: "portrait" | "landscape";
}

export function TabletFrame({
  children,
  className,
  orientation = "portrait",
}: TabletFrameProps) {
  const aspect = orientation === "portrait" ? "3 / 4" : "4 / 3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <span aria-hidden className="absolute -right-1 top-16 h-12 w-1 rounded-r-full bg-frame-bezel" />
      <div className="rounded-3xl bg-gradient-to-b from-frame-body to-[#d8dbe2] p-[14px] shadow-[0_32px_80px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)]">
        <div
          className="relative overflow-hidden rounded-2xl bg-white"
          style={{ aspectRatio: aspect }}
        >
          <span
            aria-hidden
            className={cn(
              "absolute h-1.5 w-1.5 rounded-full bg-neutral-300",
              orientation === "portrait"
                ? "left-1/2 top-2 -translate-x-1/2"
                : "left-2 top-1/2 -translate-y-1/2",
            )}
          />
          {children}
        </div>
      </div>
    </motion.div>
  );
}
