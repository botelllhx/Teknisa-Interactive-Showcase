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
      <div className="rounded-frame bg-frame-body p-3 shadow-frame">
        <div
          className="relative overflow-hidden rounded-[14px] bg-white"
          style={{ aspectRatio: aspect }}
        >
          <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neutral-300" />
          {children}
        </div>
      </div>
    </motion.div>
  );
}
