"use client";

import { motion } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  TrendingDown,
  Leaf,
  Recycle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface WasteControlProps {
  step: number;
}

const ITEMS = [
  { name: "Arroz integral", weighed: 4.2, status: "ok" as const },
  { name: "Frango grelhado", weighed: 6.8, status: "high" as const },
  { name: "Salada caesar", weighed: 1.5, status: "ok" as const },
];

const CATEGORIES = [
  { Icon: Recycle, label: "Sobra limpa", value: 6.4 },
  { Icon: Leaf, label: "Resto consumido", value: 5.1 },
];

const COMPARISON = [
  { day: "Seg", value: 9.4 },
  { day: "Ter", value: 11.2 },
  { day: "Qua", value: 8.1 },
  { day: "Qui", value: 14.6 },
  { day: "Sex", value: 12.5 },
];

export function WasteControlMockup({ step }: WasteControlProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-3 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <Scale size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              WasteControl
            </p>
            <p className="text-[8px] text-neutral-500">
              Quinta-feira · 21/05 · Almoço
            </p>
          </div>
        </div>
        <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[8px] font-semibold text-brand">
          Restaurante Central
        </span>
      </header>

      {step === 0 && <RegisterView />}
      {step === 1 && <WeighingView />}
      {step === 2 && <ComparisonView highlight={false} />}
      {step === 3 && <ComparisonView highlight />}
      {step >= 4 && <ReportView />}
    </div>
  );
}

function RegisterView() {
  return (
    <div className="flex-1 px-3 py-2">
      <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Sobras a registrar
      </p>
      <div className="mt-2 space-y-1.5">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex items-center gap-2 rounded-md p-2 shadow-card",
              i === 0 ? "border-2 border-brand bg-brand-ghost" : "bg-white",
            )}
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-brand-subtle text-brand">
              <Scale size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-neutral-900">
                {item.name}
              </p>
              <p className="text-[8px] text-neutral-500">
                {item.weighed} kg pesados
              </p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[7px] font-bold uppercase",
                item.status === "ok"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning",
              )}
            >
              {item.status === "ok" ? "OK" : "Alto"}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WeighingView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="rounded-md bg-white p-3 text-center shadow-card">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
          Pesagem em andamento
        </p>
        <p className="mt-1 font-display text-[10px] font-bold text-neutral-900">
          Arroz integral
        </p>
        <motion.p
          key="weight"
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          className="mt-3 font-display text-[26px] font-bold text-brand tabular-nums"
        >
          4,20 kg
        </motion.p>
        <p className="mt-1 text-[8px] text-neutral-500">Balança · TF-200</p>
      </div>

      <p className="mt-3 text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Categoria
      </p>
      <div className="mt-1 grid grid-cols-2 gap-1.5">
        {CATEGORIES.map(({ Icon, label, value }, i) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex flex-col items-center gap-1 rounded-md p-2",
              i === 0
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <Icon size={14} strokeWidth={2} />
            <span className="text-[8px] font-bold">{label}</span>
            <span className="text-[7px] opacity-80 tabular-nums">
              {value} kg
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ComparisonView({ highlight }: { highlight: boolean }) {
  const max = Math.max(...COMPARISON.map((d) => d.value));
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="rounded-md bg-white p-2 shadow-card">
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
            Sobra · esta semana
          </p>
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
            <TrendingDown size={9} strokeWidth={2.5} />
            -12%
          </span>
        </div>

        <div className="mt-3 flex h-20 items-end gap-1.5">
          {COMPARISON.map((d, i) => {
            const isToday = d.day === "Qui";
            return (
              <motion.div
                key={d.day}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.06 * i, duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span
                  style={{ height: `${(d.value / max) * 100}%` }}
                  className={cn(
                    "w-full rounded-t",
                    isToday && highlight
                      ? "bg-warning"
                      : isToday
                        ? "bg-brand"
                        : "bg-brand/30",
                  )}
                />
                <span
                  className={cn(
                    "text-[7px] font-medium",
                    isToday ? "font-bold text-neutral-900" : "text-neutral-500",
                  )}
                >
                  {d.day}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-dashed border-neutral-200 pt-2 text-[8px]">
          <span className="text-neutral-500">Meta diária</span>
          <span className="font-bold text-neutral-900 tabular-nums">10,0 kg</span>
        </div>
      </div>

      {highlight && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/5 p-2"
        >
          <AlertTriangle size={14} strokeWidth={2.25} className="text-warning" />
          <div>
            <p className="text-[9px] font-bold text-warning">
              Desvio detectado
            </p>
            <p className="text-[8px] text-neutral-600">
              Sobra de quinta supera meta em 4,6 kg (46%)
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ReportView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-brand">
        <FileText size={28} strokeWidth={1.75} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Relatório gerado
      </p>
      <div className="w-full rounded-md bg-white p-2 shadow-card">
        {[
          { label: "Total pesado", value: "12,5 kg" },
          { label: "Sobra limpa", value: "6,4 kg" },
          { label: "Resto consumido", value: "5,1 kg" },
          { label: "Desvio da meta", value: "+25%" },
        ].map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between border-b border-dashed border-neutral-100 py-1 text-[8px] last:border-0"
          >
            <span className="text-neutral-500">{r.label}</span>
            <span className="font-bold text-neutral-900 tabular-nums">
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[8px] text-success">
        <CheckCircle2 size={10} strokeWidth={2.5} />
        Enviado à supervisão · 21/05 14:38
      </div>
    </motion.div>
  );
}
