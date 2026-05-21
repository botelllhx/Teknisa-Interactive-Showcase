"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

interface FiscalBadgeProps {
  className?: string;
}

const TAGS = ["IBS", "CBS", "IS", "Split Payment"];

export function FiscalBadge({ className }: FiscalBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-64 overflow-hidden rounded-frame border border-warning/20 bg-gradient-to-br from-warning/5 via-white to-warning/10 p-4 shadow-frame",
        className,
      )}
    >
      <motion.span
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-warning/15"
      />

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-warning/15 text-warning">
          <ShieldCheck size={22} strokeWidth={2} />
        </div>
        <div>
          <p className="text-caption font-bold uppercase tracking-wider text-warning">
            Reforma Tributária 2026
          </p>
          <p className="font-display text-body-md font-semibold text-neutral-900">
            Preparado para o novo regime
          </p>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {TAGS.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.3 }}
            className="rounded-full bg-white px-2.5 py-1 text-caption font-semibold text-warning shadow-card"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
