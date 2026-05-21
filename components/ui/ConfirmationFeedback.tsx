"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

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
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-10 text-center",
        className,
      )}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 14,
          delay: 0.1,
        }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-brand/40"
        />
        <Check size={56} strokeWidth={3} />
      </motion.div>

      <div>
        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-lg leading-tight text-neutral-900"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 max-w-[40ch] text-body-lg text-neutral-600"
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 flex items-center gap-3"
      >
        {onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex h-14 items-center gap-2 rounded-full border border-brand/20 bg-white px-6 font-ui text-body-md font-medium text-brand transition-colors hover:bg-brand-ghost"
          >
            <RotateCcw size={18} strokeWidth={2} />
            {secondaryLabel}
          </button>
        )}
        {onPrimary && (
          <button
            type="button"
            onClick={onPrimary}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-brand px-7 font-ui text-body-md font-semibold text-white shadow-brand transition-colors hover:bg-brand-light"
          >
            {primaryLabel}
            <ArrowRight size={18} strokeWidth={2.25} />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
