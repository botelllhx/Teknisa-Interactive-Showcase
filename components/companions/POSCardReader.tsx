"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Wifi, CheckCircle2, Signal } from "lucide-react";
import { CompanionShell } from "./CompanionShell";

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
    <CompanionShell
      label="Maquininha"
      sublabel="Operador · Caixa 02"
      live
      pulse={status === "approved"}
      className={className}
    >
      <motion.div
        layout
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        style={{
          width: "100%",
          background: "linear-gradient(180deg, #ebedf1 0%, #dde0e5 65%, #d4d7de 100%)",
          borderRadius: 22,
          padding: 14,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Top bezel: speaker + LED + signal */}
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden
              style={{
                width: 20,
                height: 3,
                borderRadius: 2,
                background: "#b8bcc6",
              }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <motion.span
              animate={
                status === "waiting"
                  ? { opacity: [0.3, 1, 0.3] }
                  : { opacity: 1 }
              }
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background:
                  status === "approved"
                    ? "#16a34a"
                    : status === "waiting"
                      ? "#020788"
                      : "#9ea4b0",
                boxShadow:
                  status === "approved"
                    ? "0 0 10px rgba(22,163,74,0.65)"
                    : status === "waiting"
                      ? "0 0 10px rgba(2,7,136,0.55)"
                      : "none",
              }}
            />
            <Signal size={9} strokeWidth={2.5} className="text-neutral-500" />
            <Wifi size={9} strokeWidth={2.5} className="text-neutral-500" />
          </div>
        </div>

        {/* LCD Screen */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #fbfcff 0%, #eef1f6 100%)",
            borderRadius: 14,
            padding: "18px 16px",
            border: "1px solid #c8ccd5",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
              {status === "approved" ? "Aprovado" : "Valor a cobrar"}
            </p>
            <p className="text-[9px] font-bold text-neutral-500 tabular-nums">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <motion.p
            key={formatted}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="font-display font-bold tabular-nums"
            style={{ fontSize: 30, lineHeight: 1.05, color: "#1a1d26" }}
          >
            {formatted}
          </motion.p>
          <p className="mt-1 text-[10px] font-semibold text-neutral-500">
            {brand} · {installments}
          </p>

          <AnimatePresence mode="wait">
            {status === "approved" ? (
              <motion.div
                key="approved"
                initial={{ scale: 0.9, opacity: 0, y: 4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-success/15 py-2.5 text-success"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </motion.span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
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
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-dashed border-brand/30 bg-brand-ghost py-2.5 text-brand"
              >
                <motion.span
                  animate={{ scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CreditCard size={16} strokeWidth={2} />
                </motion.span>
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Aproxime o cartão
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "*",
            "0",
            "#",
          ].map((k) => (
            <div
              key={k}
              aria-hidden
              className="flex h-7 items-center justify-center rounded-md font-display text-[11px] font-bold text-neutral-700"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f0f2f6 100%)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.05) inset, 0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              {k}
            </div>
          ))}
        </div>

        {/* Action keys */}
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="h-6 rounded-md text-[9px] font-bold uppercase tracking-wider text-white"
            style={{
              background: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="h-6 rounded-md text-[9px] font-bold uppercase tracking-wider text-white"
            style={{
              background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.2) inset, 0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Confirmar
          </button>
        </div>

        {/* Card slot */}
        <div className="mt-3 flex flex-col items-center gap-1.5">
          <span
            aria-hidden
            className="h-1 w-24 rounded-full"
            style={{ background: "rgba(0,0,0,0.10)" }}
          />
          <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
            Insira ou aproxime
          </span>
        </div>
      </motion.div>
    </CompanionShell>
  );
}
