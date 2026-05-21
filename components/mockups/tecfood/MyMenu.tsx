"use client";

import { motion } from "framer-motion";
import {
  Salad,
  Flame,
  Leaf,
  Wheat,
  Calendar,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MyMenuProps {
  step: number;
}

const RESTAURANTS = ["Central", "Ala B", "Café"];

const DISHES = [
  {
    name: "Frango grelhado com brócolis",
    kcal: 480,
    desc: "Frango ao molho de ervas, arroz 7 grãos, brócolis no vapor",
    pricePoints: 1,
  },
  {
    name: "Lasanha de berinjela",
    kcal: 540,
    desc: "Vegetariana · molho de tomate rústico, parmesão",
    pricePoints: 1,
  },
];

export function MyMenuMockup({ step }: MyMenuProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          MyMenu
        </p>
        <p className="text-[8px] text-neutral-500">Quarta-feira · 21 Maio</p>
      </header>

      {step === 0 && <MenuOfDayView />}
      {step === 1 && <DetailView />}
      {step === 2 && <ReserveView />}
      {step === 3 && <ConfirmView />}
      {step >= 4 && <QRView />}
    </div>
  );
}

function MenuOfDayView() {
  return (
    <div className="flex-1 px-3 py-1">
      <div className="flex items-center gap-1">
        {RESTAURANTS.map((r, i) => (
          <button
            key={r}
            type="button"
            className={cn(
              "flex-1 rounded py-1 text-[8px] font-semibold",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 text-neutral-600",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="mt-2 text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Almoço
      </p>
      <div data-tour="mm-menu-list" className="mt-1 space-y-1.5">
        {DISHES.map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.06 * i }}
            className="flex items-center gap-2 rounded-md border border-brand/10 bg-white p-2 shadow-card"
          >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-brand-subtle text-brand">
              <Salad size={16} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-[9px] font-semibold text-neutral-900">
                {d.name}
              </p>
              <p className="text-[8px] text-neutral-500">{d.kcal} kcal</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DetailView() {
  return (
    <div data-tour="mm-dish-detail" className="flex-1 px-3 py-1">
      <div className="h-20 w-full rounded-md bg-gradient-to-br from-brand-subtle via-brand-ghost to-white" />
      <h3 className="mt-2 font-display text-[11px] font-bold text-neutral-900">
        Frango grelhado com brócolis
      </h3>
      <p className="mt-0.5 text-[8px] text-neutral-500">
        Frango ao molho de ervas, arroz 7 grãos, brócolis no vapor
      </p>

      <div className="mt-2 grid grid-cols-3 gap-1">
        {[
          { Icon: Flame, label: "480 kcal" },
          { Icon: Leaf, label: "8 g fibra" },
          { Icon: Wheat, label: "38 g carbo" },
        ].map(({ Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded bg-surface-raised py-1.5"
          >
            <Icon size={11} strokeWidth={2} className="text-brand" />
            <span className="mt-0.5 text-[7px] font-semibold text-neutral-700">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2 rounded-md bg-success/10 px-2 py-1.5">
        <p className="text-[8px] font-semibold text-success">
          Compatível com sua dieta
        </p>
      </div>
    </div>
  );
}

function ReserveView() {
  return (
    <div className="flex flex-1 flex-col px-3 py-1">
      <div className="rounded-md bg-surface-raised p-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Reservar para
        </p>
        <div className="mt-1 flex items-center gap-2">
          <Calendar size={12} strokeWidth={2} className="text-brand" />
          <span className="font-display text-[10px] font-bold text-neutral-900">
            Hoje · 12:30
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {["11:30", "12:00", "12:30", "13:00", "13:30"].map((t) => (
          <button
            key={t}
            type="button"
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5",
              t === "12:30"
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <span className="text-[9px] font-semibold">{t}</span>
            <span className="text-[8px]">
              {t === "12:30" ? "Selecionado" : "Disponível"}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        data-tour="mm-reserve"
        className="mt-auto w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Reservar
      </button>
    </div>
  );
}

function ConfirmView() {
  return (
    <motion.div
      data-tour="mm-confirmed"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 size={28} strokeWidth={2} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Reserva confirmada
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Hoje · 12:30 · Restaurante Central
      </p>
    </motion.div>
  );
}

function QRView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <div data-tour="mm-qr" className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-card">
        <QrCode size={68} strokeWidth={1.5} className="text-brand" />
      </div>
      <p className="font-display text-[10px] font-bold text-neutral-900">
        QR de acesso
      </p>
      <p className="text-center text-[8px] text-neutral-500">
        Apresente no balcão do refeitório
      </p>
      <div className="rounded border border-dashed border-brand/30 bg-brand-ghost px-3 py-1 text-center">
        <p className="font-display text-[10px] font-bold text-brand tabular-nums">
          #M-218747
        </p>
      </div>
    </motion.div>
  );
}
