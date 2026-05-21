"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface LoadingBarProps {
  visible?: boolean;
  duration?: number;
  className?: string;
}

export function LoadingBar({
  visible = true,
  duration = 600,
  className,
}: LoadingBarProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          className={cn(
            "absolute left-0 right-0 top-0 z-20 h-[3px] overflow-hidden bg-brand/10",
            className,
          )}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-r-full bg-brand"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
