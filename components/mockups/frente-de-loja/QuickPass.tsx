"use client";

import { motion } from "framer-motion";
import {
  Fingerprint,
  QrCode,
  Wallet,
  Utensils,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface QuickPassProps {
  step: number;
}

export function QuickPassMockup({ step }: QuickPassProps) {
  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-white via-white to-brand-ghost text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          QuickPass
        </p>
        <p className="text-[8px] text-neutral-500">Acesso ao refeitório</p>
      </header>

      {step === 0 && <LoginView />}
      {step === 1 && <BalanceView />}
      {step === 2 && <SelectionView />}
      {step === 3 && <AccessGrantedView />}
      {step >= 4 && <BalanceUpdatedView />}
    </div>
  );
}

function LoginView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-card"
      >
        <QrCode size={56} strokeWidth={1.5} className="text-brand" />
      </motion.div>
      <p className="text-center font-display text-[10px] font-bold text-neutral-900">
        Aproxime o QR Code
      </p>
      <div className="my-1 flex w-full items-center gap-2">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-[8px] font-medium uppercase tracking-wider text-neutral-400">
          ou
        </span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-2 text-white shadow-brand"
      >
        <Fingerprint size={14} strokeWidth={2} />
        <span className="text-[10px] font-bold">Usar biometria</span>
      </motion.button>
    </div>
  );
}

function BalanceView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="rounded-frame bg-brand p-3 text-white shadow-brand">
        <p className="text-[8px] font-medium uppercase tracking-wider opacity-80">
          Saldo disponível
        </p>
        <p className="mt-0.5 font-display text-[20px] font-bold tabular-nums">
          R$ 84,50
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2 text-[8px] opacity-90">
          <span>Mariana Costa</span>
          <span>Mat. 28471</span>
        </div>
      </div>

      <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Benefícios ativos
      </p>
      <ul className="mt-1.5 space-y-1.5">
        {[
          { label: "Refeição executiva", remaining: "12 de 22 dias" },
          { label: "Café da manhã", remaining: "Disponível" },
        ].map((b, i) => (
          <motion.li
            key={b.label}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.06 * i }}
            className="flex items-center justify-between rounded-md bg-white px-2 py-1.5 shadow-card"
          >
            <div className="flex items-center gap-1.5">
              <Wallet size={11} strokeWidth={2} className="text-brand" />
              <span className="text-[9px] font-semibold text-neutral-900">
                {b.label}
              </span>
            </div>
            <span className="text-[8px] font-bold text-brand">{b.remaining}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function SelectionView() {
  return (
    <div className="flex flex-1 flex-col px-3 py-2">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Escolha o refeitório
      </p>
      <div className="mt-2 space-y-1.5">
        {[
          {
            label: "Restaurante Central",
            sub: "200 m · 20 min de espera",
            active: true,
          },
          { label: "Restaurante Ala B", sub: "450 m · 8 min de espera" },
          { label: "Café da Praça", sub: "320 m · sem fila" },
        ].map((r, i) => (
          <motion.button
            key={r.label}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex w-full items-center gap-2 rounded-md p-2 text-left",
              r.active
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 flex-none items-center justify-center rounded-lg",
                r.active ? "bg-white/15" : "bg-brand-subtle text-brand",
              )}
            >
              <MapPin size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[9px] font-semibold">{r.label}</p>
              <p
                className={cn(
                  "truncate text-[8px]",
                  r.active ? "opacity-80" : "text-neutral-500",
                )}
              >
                {r.sub}
              </p>
            </div>
            <ArrowRight size={12} strokeWidth={2.25} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AccessGrantedView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <Utensils size={28} strokeWidth={2} />
      </motion.div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Acesso liberado
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Restaurante Central · Bom apetite
      </p>
    </motion.div>
  );
}

function BalanceUpdatedView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="flex items-center justify-between rounded-md border border-success/30 bg-success/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} strokeWidth={2} className="text-success" />
          <span className="text-[9px] font-semibold text-success">
            Refeição registrada
          </span>
        </div>
        <span className="text-[8px] text-neutral-500">há instantes</span>
      </div>

      <div className="mt-3 rounded-frame bg-brand p-3 text-white shadow-brand">
        <p className="text-[8px] font-medium uppercase tracking-wider opacity-80">
          Saldo atualizado
        </p>
        <p className="mt-0.5 font-display text-[20px] font-bold tabular-nums">
          R$ 72,90
        </p>
        <div className="mt-1 flex items-center gap-1 text-[8px] opacity-90">
          <span>–</span>
          <span className="tabular-nums">R$ 11,60 hoje</span>
        </div>
      </div>
    </motion.div>
  );
}
