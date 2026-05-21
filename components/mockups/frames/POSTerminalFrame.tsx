"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface POSTerminalFrameProps {
  children?: ReactNode;
  className?: string;
  showKeypad?: boolean;
}

const KEYPAD = [
  { label: "1" }, { label: "2" }, { label: "3" },
  { label: "4" }, { label: "5" }, { label: "6" },
  { label: "7" }, { label: "8" }, { label: "9" },
  { label: "*" }, { label: "0" }, { label: "#" },
];

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
      <div className="rounded-2xl bg-gradient-to-b from-frame-body to-[#d8dbe2] p-3 shadow-[0_32px_80px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)]">
        <div className="rounded-xl bg-frame-screen p-[3px]">
          <span aria-hidden className="mx-auto mb-0.5 block h-0.5 w-1.5 rounded-full bg-neutral-300" />
          <div
            className="relative overflow-hidden rounded-md bg-white"
            style={{ aspectRatio: "16 / 10" }}
          >
            {children}
          </div>
        </div>

        {showKeypad && (
          <div className="mt-3 rounded-xl bg-gradient-to-b from-[#e8ebef] to-frame-body p-2.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="grid grid-cols-3 gap-1.5">
              {KEYPAD.map((k) => (
                <button
                  key={k.label}
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  className="flex h-9 items-center justify-center rounded-lg bg-white font-display text-body-lg font-semibold text-neutral-700 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_1px_3px_rgba(0,0,0,0.06)]"
                >
                  {k.label}
                </button>
              ))}
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                className="flex h-8 items-center justify-center rounded-lg bg-danger/80 font-display text-label-sm font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.10)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                tabIndex={-1}
                aria-hidden
                className="flex h-8 items-center justify-center rounded-lg bg-success/85 font-display text-label-sm font-bold text-white shadow-[0_1px_3px_rgba(0,0,0,0.10)]"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
