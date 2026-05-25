"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { CompanionShell } from "./CompanionShell";
import { brl } from "@/lib/format";

interface CustomerReceiptPhoneProps {
  amount?: number;
  brand?: string;
  delivered?: boolean;
}

export function CustomerReceiptPhone({
  amount = 24.0,
  brand = "VISA",
  delivered = false,
}: CustomerReceiptPhoneProps) {
  const time = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <CompanionShell
      label="Celular do cliente"
      sublabel="Comprovante via SMS"
      live
      pulse={delivered}
    >
      <motion.div
        layout
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          background:
            "linear-gradient(180deg, #ebedf1 0%, #dde0e5 65%, #d4d7de 100%)",
          borderRadius: 32,
          padding: "12px 10px",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.65)",
          position: "relative",
        }}
      >
        {/* Side buttons */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: -2,
            top: 60,
            width: 3,
            height: 24,
            background: "#cdd0d8",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: -2,
            top: 70,
            width: 3,
            height: 40,
            background: "#cdd0d8",
            borderRadius: "2px 0 0 2px",
          }}
        />

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            paddingTop: 28,
            paddingBottom: 12,
            minHeight: 280,
          }}
        >
          {/* Dynamic island */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 70,
              height: 18,
              background: "#1a1a1a",
              borderRadius: 12,
              zIndex: 10,
            }}
          />

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pb-2 pt-1">
            <span className="font-display text-[10px] font-bold text-neutral-900 tabular-nums">
              {time}
            </span>
            <div className="flex items-center gap-0.5 text-neutral-700">
              <span className="text-[9px] font-bold">5G</span>
              <span className="ml-1 text-[9px] font-bold tabular-nums">94%</span>
            </div>
          </div>

          {/* Notification card */}
          <AnimatePresence mode="wait">
            {!delivered ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-3 py-6"
              >
                <div className="rounded-2xl bg-surface-raised p-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-subtle text-brand">
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <MessageSquare size={20} strokeWidth={2} />
                    </motion.span>
                  </div>
                  <p className="mt-3 font-display text-[12px] font-bold text-neutral-900">
                    Aguardando comprovante
                  </p>
                  <p className="mt-0.5 text-[10px] text-neutral-500">
                    O cliente receberá por SMS
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="delivered"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="px-3"
              >
                {/* Notification banner */}
                <div className="rounded-2xl bg-white p-3 shadow-card">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                      <Mail size={14} strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-display text-[11px] font-bold text-neutral-900">
                          Teknisa Pay
                        </p>
                        <p className="text-[9px] text-neutral-400">agora</p>
                      </div>
                      <p className="truncate text-[10px] text-neutral-500">
                        Pagamento aprovado · Comprovante
                      </p>
                    </div>
                  </div>
                </div>

                {/* Receipt content */}
                <div className="mt-3 rounded-2xl bg-gradient-to-b from-brand-ghost via-white to-white p-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={14}
                      strokeWidth={2.5}
                      className="text-success"
                    />
                    <p className="font-display text-[10px] font-bold uppercase tracking-wider text-success">
                      Pagamento confirmado
                    </p>
                  </div>
                  <p className="mt-2 font-display text-[20px] font-bold leading-none text-brand tabular-nums">
                    {brl(amount)}
                  </p>
                  <p className="mt-1 text-[9px] text-neutral-500">
                    {brand} ****4128 · 1× sem juros
                  </p>

                  <div className="mt-3 space-y-1 border-t border-dashed border-neutral-200 pt-2 text-[9px]">
                    <div className="flex justify-between text-neutral-500">
                      <span>Estabelecimento</span>
                      <span className="font-semibold text-neutral-800">
                        Padaria Centro
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>NSU</span>
                      <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                        871402
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Horário</span>
                      <span className="font-semibold text-neutral-800 tabular-nums">
                        {time}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-center gap-1 rounded-md bg-brand-subtle py-1.5">
                    <ShieldCheck
                      size={10}
                      strokeWidth={2.25}
                      className="text-brand"
                    />
                    <p className="text-[9px] font-bold uppercase tracking-wider text-brand">
                      Transação segura
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </CompanionShell>
  );
}
