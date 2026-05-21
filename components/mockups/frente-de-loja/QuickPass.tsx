"use client";

import { motion } from "framer-motion";
import {
  Fingerprint,
  QrCode,
  Wallet,
  Utensils,
  MapPin,
  CheckCircle2,
  Coffee,
  Sun,
  ArrowRight,
  Signal,
  Wifi,
  Battery,
  TrendingDown,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface QuickPassProps {
  step: number;
}

export function QuickPassMockup({ step }: QuickPassProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <StatusBar />
      {step === 0 && <LoginView />}
      {step === 1 && <BalanceView />}
      {step === 2 && <RestaurantPickerView />}
      {step === 3 && <AccessGrantedView />}
      {step >= 4 && <BalanceUpdatedView />}
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 py-1.5">
      <span className="font-display text-[11px] font-bold text-neutral-900 tabular-nums">
        11:42
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <Signal size={11} strokeWidth={2.25} />
        <Wifi size={11} strokeWidth={2.25} />
        <span className="text-[10px] font-bold tabular-nums">94%</span>
        <Battery size={13} strokeWidth={2} />
      </div>
    </div>
  );
}

function LoginView() {
  return (
    <div data-tour="qp-login" className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
      >
        <Sparkles size={22} strokeWidth={2} />
      </motion.div>

      <motion.h1
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 font-display text-[22px] font-bold text-neutral-900"
      >
        QuickPass
      </motion.h1>
      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-1 text-[12px] text-neutral-500"
      >
        Acesso ao refeitório · Teknisa
      </motion.p>

      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex h-44 w-44 items-center justify-center rounded-3xl border-4 border-brand/10 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle shadow-card"
      >
        <QrCode size={130} strokeWidth={1} className="text-brand" />
      </motion.div>

      <p className="mt-5 text-center text-[12px] font-bold text-neutral-900">
        Aproxime o QR Code do leitor
      </p>
      <p className="mt-1 text-center text-[10px] text-neutral-500">
        Você também pode usar biometria
      </p>

      <div className="my-5 flex w-full items-center gap-3 px-2">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
          ou
        </span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 font-display text-[13px] font-bold text-white shadow-brand"
      >
        <Fingerprint size={16} strokeWidth={2} />
        Usar biometria
      </motion.button>
    </div>
  );
}

function BalanceView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-5 py-3"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand font-display text-[14px] font-bold text-white shadow-brand">
          MC
        </div>
        <div>
          <p className="text-[10px] text-neutral-500">Bem-vinda</p>
          <p className="font-display text-[15px] font-bold text-neutral-900">
            Mariana Costa
          </p>
        </div>
      </div>

      <motion.div
        data-tour="qp-balance"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand-light to-brand-lighter p-5 text-white shadow-brand"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              Saldo disponível
            </p>
            <p className="mt-1 font-display text-[34px] font-bold tabular-nums leading-none">
              R$ 84,50
            </p>
            <p className="mt-2 text-[10px] opacity-90">
              Mat. 28471 · Departamento TI
            </p>
          </div>
          <Wallet size={22} strokeWidth={2} className="opacity-70" />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-white/15 px-3 py-2 backdrop-blur">
          <span className="text-[10px] font-medium opacity-90">
            Recarga mensal automática
          </span>
          <span className="text-[10px] font-bold">15/Jun</span>
        </div>
      </motion.div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Benefícios ativos
      </p>
      <div className="mt-2 space-y-2">
        {[
          {
            Icon: Utensils,
            label: "Refeição executiva",
            remaining: "12 de 22 dias",
            tone: "primary",
          },
          {
            Icon: Coffee,
            label: "Café da manhã",
            remaining: "Disponível",
            tone: "success",
          },
          {
            Icon: Sun,
            label: "Lanche tarde",
            remaining: "8 de 22 dias",
            tone: "neutral",
          },
        ].map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 + i * 0.06 }}
            className="flex items-center gap-3 rounded-xl border border-brand/10 bg-white p-3 shadow-card"
          >
            <span
              className={cn(
                "flex h-9 w-9 flex-none items-center justify-center rounded-lg",
                b.tone === "primary" && "bg-brand-subtle text-brand",
                b.tone === "success" && "bg-success/15 text-success",
                b.tone === "neutral" && "bg-neutral-100 text-neutral-500",
              )}
            >
              <b.Icon size={16} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="font-display text-[12px] font-bold text-neutral-900">
                {b.label}
              </p>
              <p className="text-[10px] text-neutral-500">{b.remaining}</p>
            </div>
            <ArrowRight size={14} strokeWidth={2} className="text-neutral-300" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RestaurantPickerView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-5 py-3"
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Almoço · 11:42
        </p>
        <h2 className="font-display text-[16px] font-bold text-neutral-900">
          Escolha o refeitório
        </h2>
      </div>

      <div data-tour="qp-restaurant" className="mt-3 flex-1 space-y-2">
        {[
          {
            label: "Restaurante Central",
            sub: "200 m · 20 min de espera",
            queue: 18,
            active: true,
            primary: true,
          },
          {
            label: "Restaurante Ala B",
            sub: "450 m · 8 min de espera",
            queue: 6,
            active: false,
          },
          {
            label: "Café da Praça",
            sub: "320 m · sem fila",
            queue: 0,
            active: false,
          },
        ].map((r, i) => (
          <motion.button
            key={r.label}
            initial={{ x: 8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-shadow",
              r.primary
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-800",
            )}
          >
            <span
              className={cn(
                "flex h-12 w-12 flex-none items-center justify-center rounded-xl",
                r.primary ? "bg-white/15" : "bg-brand-subtle text-brand",
              )}
            >
              <MapPin size={20} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <p className="font-display text-[13px] font-bold">{r.label}</p>
              <p
                className={cn(
                  "mt-0.5 text-[10px]",
                  r.primary ? "opacity-85" : "text-neutral-500",
                )}
              >
                {r.sub}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[9px] font-bold",
                  r.queue === 0 && "bg-success/20 text-success",
                  r.queue > 0 && r.queue < 10 && (r.primary ? "bg-white/20" : "bg-warning/15 text-warning"),
                  r.queue >= 10 && (r.primary ? "bg-white/20" : "bg-danger/15 text-danger"),
                )}
              >
                {r.queue === 0 ? "Livre" : `${r.queue} pessoas`}
              </span>
              <ArrowRight size={14} strokeWidth={2.25} className="mt-1" />
            </div>
          </motion.button>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3 font-display text-[13px] font-bold text-white shadow-brand"
      >
        Confirmar acesso
        <ArrowRight size={14} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

function AccessGrantedView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      <motion.div
        data-tour="qp-access"
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="relative flex h-28 w-28 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <motion.span
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute inset-0 rounded-full ring-2 ring-success/30"
        />
        <Utensils size={56} strokeWidth={2} />
      </motion.div>

      <motion.h2
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 font-display text-[24px] font-bold text-neutral-900"
      >
        Acesso liberado
      </motion.h2>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-1 text-center text-[12px] text-neutral-500"
      >
        Restaurante Central · 1 refeição executiva
      </motion.p>

      <motion.div
        initial={{ y: 14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 px-5 py-3"
      >
        <CheckCircle2 size={20} strokeWidth={2} className="text-success" />
        <div>
          <p className="font-display text-[12px] font-bold text-success">
            Refeição registrada
          </p>
          <p className="text-[10px] text-neutral-500">
            Catraca liberada · Bom apetite!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BalanceUpdatedView() {
  return (
    <motion.div
      data-tour="qp-updated"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-5 py-3"
    >
      <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2.5">
        <CheckCircle2 size={16} strokeWidth={2.25} className="text-success" />
        <div className="flex-1">
          <p className="text-[11px] font-bold text-success">
            Refeição registrada
          </p>
          <p className="text-[9px] text-neutral-500">há instantes · 11:42</p>
        </div>
      </div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-3 rounded-2xl bg-gradient-to-br from-brand via-brand-light to-brand-lighter p-5 text-white shadow-brand"
      >
        <p className="text-[10px] font-medium uppercase tracking-wider opacity-80">
          Saldo atualizado
        </p>
        <div className="mt-1 flex items-baseline gap-2">
          <p className="font-display text-[34px] font-bold tabular-nums leading-none">
            R$ 72,90
          </p>
          <p className="flex items-center gap-1 text-[11px] font-bold opacity-90">
            <TrendingDown size={12} strokeWidth={2.5} />
            R$ 11,60
          </p>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] opacity-90">
          <span>10 refeições restantes</span>
          <span>Recarga 15/Jun</span>
        </div>
      </motion.div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Histórico recente
      </p>
      <div className="mt-2 space-y-1.5">
        {[
          { label: "Refeição executiva", place: "Restaurante Central", time: "Agora", value: "− R$ 11,60" },
          { label: "Café da manhã", place: "Café da Praça", time: "Hoje · 07:48", value: "Grátis" },
          { label: "Refeição executiva", place: "Restaurante Ala B", time: "Ontem · 12:15", value: "− R$ 11,60" },
        ].map((h, i) => (
          <motion.div
            key={i}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center justify-between rounded-xl border border-brand/10 bg-white px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Clock size={12} strokeWidth={2} className="text-brand" />
              <div>
                <p className="font-display text-[11px] font-bold text-neutral-900">
                  {h.label}
                </p>
                <p className="text-[9px] text-neutral-500">{h.place} · {h.time}</p>
              </div>
            </div>
            <span className="font-display text-[11px] font-bold text-neutral-900 tabular-nums">
              {h.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
