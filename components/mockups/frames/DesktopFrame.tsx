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
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-frame-body to-[#d8dbe2] p-[14px] shadow-[0_32px_80px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)]">
        <span
          aria-hidden
          className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-neutral-300"
        />
        <div className="rounded-xl bg-frame-screen p-[3px]">
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
      <div className="relative -mt-px h-6 w-32 rounded-b-[14px] bg-gradient-to-b from-[#d8dbe2] to-frame-body" />
      <div className="h-1.5 w-56 rounded-full bg-frame-bezel/70 shadow-[0_6px_16px_rgba(0,0,0,0.08)]" />
    </motion.div>
  );
}
