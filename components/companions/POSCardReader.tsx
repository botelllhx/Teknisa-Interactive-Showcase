"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wifi, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface POSCardReaderProps {
  amount?: number;
  status?: "idle" | "waiting" | "approved";
  brand?: string;
  installments?: string;
  className?: string;
}

export function POSCardReader({
  amount = 61.7,
  status = "waiting",
  brand = "VISA",
  installments = "1× sem juros",
  className,
}: POSCardReaderProps) {
  const formatted = amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 16, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className={cn("w-full", className)}
      style={{ maxWidth: 320 }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #2a2d36 0%, #1a1d26 100%)",
          borderRadius: 22,
          padding: 18,
          boxShadow:
            "0 16px 40px rgba(0,0,0,0.30), 0 4px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top bar with status LED + wifi */}
        <div className="flex items-center justify-between px-1 pb-2">
          <div className="flex items-center gap-1.5">
            <motion.span
              animate={
                status === "waiting"
                  ? { opacity: [0.4, 1, 0.4] }
                  : { opacity: 1 }
              }
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  status === "approved"
                    ? "#22c55e"
                    : status === "waiting"
                      ? "#020788"
                      : "#5a5d66",
                boxShadow:
                  status === "approved"
                    ? "0 0 8px rgba(34,197,94,0.6)"
                    : status === "waiting"
                      ? "0 0 8px rgba(2,7,136,0.6)"
                      : "none",
              }}
            />
            <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-500">
              SMARTPOS · TEKNISA
            </span>
          </div>
          <Wifi size={9} strokeWidth={2.25} className="text-neutral-500" />
        </div>

        {/* Screen */}
        <div
          style={{
            background: "linear-gradient(180deg, #f5f7fa 0%, #e8ecf2 100%)",
            borderRadius: 10,
            padding: "14px 12px",
            color: "#1a1d26",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
            {status === "approved" ? "Aprovado" : "Valor a cobrar"}
          </p>
          <p
            className="font-display font-bold text-neutral-900 tabular-nums"
            style={{ fontSize: 24, lineHeight: 1.1 }}
          >
            {formatted}
          </p>
          <p className="mt-1 text-[9px] font-medium text-neutral-500">
            {brand} · {installments}
          </p>

          <AnimatePresence mode="wait">
            {status === "approved" ? (
              <motion.div
                key="approved"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-success/10 py-2 text-success"
              >
                <CheckCircle2 size={14} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Pagamento aprovado
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-dashed border-brand/30 bg-brand-ghost py-2 text-brand"
              >
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CreditCard size={14} strokeWidth={2} />
                </motion.span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Aproxime o cartão
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Numeric keypad */}
        <div className="mt-3 grid grid-cols-3 gap-1">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
            <div
              key={k}
              aria-hidden
              className="flex h-7 items-center justify-center rounded bg-white/8 font-display text-[11px] font-bold text-neutral-300"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {k}
            </div>
          ))}
        </div>

        {/* Card slot */}
        <div className="mt-2.5 flex h-1.5 items-center justify-center">
          <span
            aria-hidden
            className="h-1 w-24 rounded-full"
            style={{ background: "rgba(255,255,255,0.10)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
