"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, Button } from "@/components/ui/shadcn";

interface ConfirmationFeedbackProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
}

export function ConfirmationFeedback({
  title = "Pronto!",
  description = "Fluxo concluído com sucesso.",
  primaryLabel = "Explorar outra solução",
  secondaryLabel = "Refazer",
  onPrimary,
  onSecondary,
  className,
}: ConfirmationFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex items-center justify-center p-6", className)}
    >
      <Card className="relative w-full max-w-[560px] overflow-hidden p-10 text-center shadow-[0_24px_72px_rgba(2,7,136,0.12),0_4px_16px_rgba(0,0,0,0.06)]">
        {/* Decorative top accent — apenas indigo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand via-brand-light to-brand-lighter"
        />
        {/* Soft halo behind the check */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="pointer-events-none absolute left-1/2 top-12 h-44 w-44 -translate-x-1/2 rounded-full bg-brand/8 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-6">
          {/* Animated success check */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 14,
              delay: 0.1,
            }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full text-white shadow-[0_16px_40px_rgba(2,7,136,0.30),inset_0_1px_0_rgba(255,255,255,0.18)]"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
            }}
          >
            {/* Inner pulsing ring */}
            <motion.span
              animate={{ scale: [1, 1.55, 1], opacity: [0.45, 0, 0.45] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full ring-2 ring-brand/35"
            />
            {/* Outer ambient ring */}
            <motion.span
              animate={{ scale: [1, 1.8, 1], opacity: [0.25, 0, 0.25] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="absolute inset-0 rounded-full ring-2 ring-brand/25"
            />
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 16,
                delay: 0.32,
              }}
            >
              <Check size={58} strokeWidth={3} />
            </motion.div>
          </motion.div>

          <div>
            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.28,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[34px] font-bold leading-[1.08] text-neutral-900"
              style={{ letterSpacing: "-0.028em" }}
            >
              {title}
            </motion.h3>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.38,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-3 max-w-[42ch] font-ui text-[16px] leading-[1.55] text-neutral-500"
              style={{ letterSpacing: "-0.005em" }}
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.48,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-1 flex flex-wrap items-center justify-center gap-3"
          >
            {onSecondary && (
              <Button
                type="button"
                variant="outline"
                size="xl"
                onClick={onSecondary}
                className="rounded-full"
              >
                <RotateCcw size={18} strokeWidth={2} />
                {secondaryLabel}
              </Button>
            )}
            {onPrimary && (
              <Button
                type="button"
                size="xl"
                onClick={onPrimary}
                className="rounded-full"
              >
                {primaryLabel}
                <ArrowRight size={18} strokeWidth={2.25} />
              </Button>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
