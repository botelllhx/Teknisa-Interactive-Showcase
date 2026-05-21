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
      <div className="relative rounded-3xl bg-gradient-to-b from-frame-body to-[#d8dbe2] p-4 shadow-[0_32px_80px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="mb-2 flex h-2 items-center justify-center rounded-t-md bg-brand/80" aria-hidden />
        <div
          className="relative overflow-hidden rounded-xl bg-white"
          style={{ aspectRatio: "9 / 16" }}
        >
          <span
            aria-hidden
            className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-neutral-300"
          />
          {children}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-md bg-frame-screen px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success/70" />
            <span className="font-display text-caption font-semibold uppercase tracking-wider text-neutral-500">
              Teknisa
            </span>
          </span>
          <span
            aria-hidden
            className="h-1 w-12 rounded-full bg-neutral-300"
            title="Slot de impressão"
          />
        </div>
        <div
          aria-hidden
          className="mt-1.5 mx-auto h-2.5 w-16 rounded-sm bg-neutral-300/80"
          title="Leitor de cartão"
        />
      </div>
      <div className="-mt-px h-3 w-3/4 rounded-b-3xl bg-gradient-to-b from-[#d8dbe2] to-frame-body" />
      <div className="h-6 w-full max-w-[92%] rounded-b-2xl bg-frame-bezel/70 shadow-[0_10px_24px_rgba(0,0,0,0.10)]" />
    </motion.div>
  );
}
