"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Hand, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface FlowGuideProps {
  message?: string;
  stepLabel?: string;
  visible?: boolean;
  className?: string;
}

export function FlowGuide({
  message,
  stepLabel,
  visible = true,
  className,
}: FlowGuideProps) {
  return (
    <AnimatePresence mode="wait">
      {visible && message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-none flex max-w-md items-start gap-4 rounded-frame border border-brand/10 bg-white px-5 py-4 shadow-card",
            className,
          )}
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand-subtle text-brand">
            <Hand size={22} strokeWidth={2} />
          </span>
          <div className="flex-1">
            {stepLabel && (
              <p className="text-caption font-semibold uppercase tracking-wider text-brand">
                {stepLabel}
              </p>
            )}
            <p className="mt-0.5 flex items-center gap-2 font-display text-body-lg font-medium text-neutral-900">
              {message}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="text-brand"
              >
                <ArrowRight size={18} strokeWidth={2.25} />
              </motion.span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
