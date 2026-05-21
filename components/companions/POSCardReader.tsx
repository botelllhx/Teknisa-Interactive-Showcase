"use client";

import { motion } from "framer-motion";
import { CreditCard, Wifi } from "lucide-react";
import { cn } from "@/lib/cn";

interface POSCardReaderProps {
  amount?: number;
  status?: "idle" | "waiting" | "approved";
  className?: string;
}

export function POSCardReader({
  amount = 67.9,
  status = "waiting",
  className,
}: POSCardReaderProps) {
  const formatted = amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-56 rounded-frame bg-frame-body p-3 shadow-frame",
        className,
      )}
    >
      <div className="rounded-frame-inner bg-white p-4">
        <div className="flex items-center justify-between text-neutral-400">
          <Wifi size={12} strokeWidth={2.25} />
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                status === "approved" && "bg-success",
                status === "waiting" && "animate-pulse bg-brand",
                status === "idle" && "bg-neutral-300",
              )}
            />
            <span className="text-caption font-medium uppercase tracking-wider">
              {status === "approved" ? "Aprovado" : status === "waiting" ? "Aguardando" : "Ocioso"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-caption font-medium uppercase tracking-wider text-neutral-500">
            Valor
          </p>
          <p className="mt-0.5 font-display text-heading-xl font-bold text-neutral-900">
            {formatted}
          </p>
        </div>

        <div className="mt-4 flex h-14 items-center justify-center rounded-lg border border-dashed border-brand/30 bg-brand-ghost text-brand">
          <motion.div
            animate={status === "waiting" ? { scale: [1, 1.06, 1] } : undefined}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <CreditCard size={20} strokeWidth={2} />
            <span className="text-caption font-medium">
              {status === "approved" ? "Pagamento aprovado" : "Aproxime o cartão"}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="flex h-6 items-center justify-center rounded bg-white font-display text-caption font-semibold text-neutral-500 shadow-card"
          >
            {i < 9 ? i + 1 : i === 9 ? "*" : i === 10 ? "0" : "#"}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
