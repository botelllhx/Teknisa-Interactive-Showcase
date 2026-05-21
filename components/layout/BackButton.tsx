"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useShowcase } from "@/lib/store";

interface BackButtonProps {
  label?: string;
}

export function BackButton({ label = "Voltar" }: BackButtonProps) {
  const goBack = useShowcase((s) => s.goBack);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.94 }}
      onClick={goBack}
      aria-label={label}
      className="inline-flex h-14 items-center gap-3 rounded-full border border-brand/10 bg-white pl-3 pr-6 font-ui text-body-lg font-medium text-neutral-800 shadow-card transition-colors hover:bg-brand-ghost"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
        <ArrowLeft size={20} strokeWidth={2.25} />
      </span>
      {label}
    </motion.button>
  );
}
