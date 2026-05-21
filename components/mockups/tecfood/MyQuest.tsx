"use client";

import { motion } from "framer-motion";
import {
  Users,
  Timer,
  CheckCircle2,
  Bell,
  Star,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MyQuestProps {
  step: number;
}

export function MyQuestMockup({ step }: MyQuestProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          MyQuest
        </p>
        <p className="text-[8px] text-neutral-500">Fila virtual · Almoço</p>
      </header>

      {step === 0 && <CheckInView />}
      {step === 1 && <QueueView />}
      {step === 2 && <CallView />}
      {step === 3 && <ConfirmView />}
      {step >= 4 && <RatingView />}
    </div>
  );
}

function CheckInView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
        <MapPin size={28} strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="font-display text-[11px] font-bold text-neutral-900">
          Restaurante Central
        </p>
        <p className="mt-0.5 text-[9px] text-neutral-500">
          Pico atual · ~ 24 pessoas
        </p>
      </div>
      <div className="w-full rounded-md bg-surface-raised p-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[8px] text-neutral-500">
            <Users size={9} strokeWidth={2.25} />
            Aguardando
          </span>
          <span className="font-display text-[9px] font-bold text-brand">
            12 pessoas
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1 text-[8px] text-neutral-500">
            <Timer size={9} strokeWidth={2.25} />
            Tempo médio
          </span>
          <span className="font-display text-[9px] font-bold text-brand">
            14 min
          </span>
        </div>
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Entrar na fila
      </button>
    </div>
  );
}

function QueueView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center px-3"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brand/15"
        />
        <motion.span
          animate={{ scale: [1, 1.36, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute inset-0 rounded-full bg-brand/10"
        />
        <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-brand text-white shadow-brand">
          <span className="text-[8px] font-medium uppercase tracking-wider opacity-80">
            Posição
          </span>
          <span className="font-display text-[28px] font-bold leading-none">
            7
          </span>
        </div>
      </div>

      <div className="mt-3 grid w-full grid-cols-2 gap-1.5">
        <div className="rounded-md bg-surface-raised p-2 text-center">
          <p className="text-[8px] text-neutral-500">Tempo estimado</p>
          <p className="font-display text-[12px] font-bold text-brand">8 min</p>
        </div>
        <div className="rounded-md bg-surface-raised p-2 text-center">
          <p className="text-[8px] text-neutral-500">À sua frente</p>
          <p className="font-display text-[12px] font-bold text-brand">6 pessoas</p>
        </div>
      </div>
    </motion.div>
  );
}

function CallView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4"
    >
      <motion.div
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 0.8, repeat: 5, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <Bell size={28} strokeWidth={2} />
      </motion.div>
      <p className="text-center font-display text-[12px] font-bold text-neutral-900">
        Sua vez chegou
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Dirija-se ao Restaurante Central
      </p>
      <div className="rounded-md border border-dashed border-brand/30 bg-brand-ghost px-3 py-1.5 text-center">
        <p className="text-[8px] text-neutral-500">Posição</p>
        <p className="font-display text-[14px] font-bold text-brand">1</p>
      </div>
    </motion.div>
  );
}

function ConfirmView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={28} strokeWidth={2} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Presença confirmada
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Bom apetite, Mariana
      </p>
      <button
        type="button"
        className="mt-2 w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Confirmar presença
      </button>
    </motion.div>
  );
}

function RatingView() {
  return (
    <div className="flex flex-1 flex-col px-3 py-3">
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Como foi sua experiência?
      </p>
      <p className="mt-0.5 text-[8px] text-neutral-500">
        Sua avaliação ajuda a melhorar o serviço
      </p>

      <div className="mt-4 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.08 * i, type: "spring", stiffness: 240, damping: 14 }}
          >
            <Star
              size={22}
              strokeWidth={1.5}
              className={cn(
                i < 4 ? "fill-warning text-warning" : "text-neutral-300",
              )}
            />
          </motion.div>
        ))}
      </div>

      <div className="mt-3 space-y-1">
        {["Comida", "Atendimento", "Higiene"].map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-md bg-surface-raised px-2 py-1.5"
          >
            <span className="text-[9px] text-neutral-700">{label}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  size={9}
                  strokeWidth={1.5}
                  className={cn(
                    j < (i === 1 ? 4 : 5)
                      ? "fill-warning text-warning"
                      : "text-neutral-300",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Enviar avaliação
      </button>
    </div>
  );
}
