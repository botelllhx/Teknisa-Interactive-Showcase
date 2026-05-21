"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DesktopFrameProps {
  children?: ReactNode;
  className?: string;
  url?: string;
}

export function DesktopFrame({
  children,
  className,
  url = "teknisa.com.br/app",
}: DesktopFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative flex flex-col items-center", className)}
    >
      <div className="w-full rounded-frame bg-frame-body p-3 shadow-frame">
        <div className="rounded-frame-inner bg-frame-screen p-1">
          <div className="flex h-7 items-center gap-1.5 rounded-t-md bg-frame-body px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <div className="ml-3 flex h-5 flex-1 items-center justify-center rounded bg-white/70 px-3 text-caption font-medium text-neutral-500">
              {url}
            </div>
          </div>
          <div
            className="relative overflow-hidden rounded-b-md bg-white"
            style={{ aspectRatio: "16 / 10" }}
          >
            {children}
          </div>
        </div>
      </div>
      <div className="mt-2 h-3 w-32 rounded-b-2xl bg-frame-body shadow-[0_4px_10px_rgba(0,0,0,0.08)]" />
      <div className="h-2 w-48 rounded-b-3xl bg-frame-bezel/70" />
    </motion.div>
  );
}
