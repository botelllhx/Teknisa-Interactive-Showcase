"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface PulsingDotProps {
  size?: number;
  className?: string;
}

export function PulsingDot({ size = 48, className }: PulsingDotProps) {
  const center = 12;

  return (
    <div
      className={cn("pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {[0, 0.4, 0.8].map((delay) => (
        <motion.span
          key={delay}
          animate={{
            scale: [center / size, 1, center / size],
            opacity: [0.55, 0, 0.55],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className="absolute inset-0 rounded-full bg-brand/40"
        />
      ))}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-light to-brand shadow-[0_0_12px_rgba(2,7,136,0.55)]"
        style={{ width: center, height: center }}
      />
    </div>
  );
}
