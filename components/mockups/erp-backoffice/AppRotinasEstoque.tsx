"use client";

import { motion } from "framer-motion";
import {
  PackageSearch,
  ClipboardCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Minus,
  Plus,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface AppRotinasEstoqueProps {
  step: number;
}

const TASKS = [
  { label: "Contagem · Açougue", count: "12 itens", done: false, active: true },
  { label: "Conferência · Mercearia", count: "34 itens", done: false },
  { label: "Validade · Câmara fria", count: "8 itens", done: true },
];

export function AppRotinasEstoqueMockup({ step }: AppRotinasEstoqueProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          Rotinas · Estoque
        </p>
        <p className="text-[8px] text-neutral-500">Quinta-feira · 21/05</p>
      </header>

      {step === 0 && <TaskListView />}
      {step === 1 && <CountingView />}
      {step === 2 && <DivergenceView />}
      {step === 3 && <JustificationView />}
      {step >= 4 && <SyncedView />}
    </div>
  );
}

function TaskListView() {
  return (
    <div className="flex-1 px-3 py-1">
      <div className="rounded-md bg-surface-raised p-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Hoje
        </p>
        <p className="font-display text-[10px] font-bold text-neutral-900">
          {TASKS.length} tarefas atribuídas
        </p>
      </div>

      <div className="mt-2 space-y-1.5">
        {TASKS.map((task, i) => (
          <motion.button
            key={task.label}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.06 * i }}
            type="button"
            className={cn(
              "flex w-full items-center gap-2 rounded-md p-2 text-left shadow-card",
              task.active
                ? "border-2 border-brand bg-brand-ghost"
                : "border border-brand/10 bg-white",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
                task.done
                  ? "bg-success/15 text-success"
                  : task.active
                    ? "bg-brand text-white shadow-brand"
                    : "bg-brand-subtle text-brand",
              )}
            >
              {task.done ? (
                <CheckCircle2 size={14} strokeWidth={2.25} />
              ) : (
                <PackageSearch size={14} strokeWidth={2} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-neutral-900">
                {task.label}
              </p>
              <p className="text-[8px] text-neutral-500">{task.count}</p>
            </div>
            {task.active && (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[7px] font-bold uppercase text-warning">
                Agora
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function CountingView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="rounded-md bg-surface-raised p-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Contando item 4 de 12
        </p>
        <p className="font-display text-[11px] font-bold text-neutral-900">
          Patinho moído kg
        </p>
        <p className="text-[8px] text-neutral-500">SKU 28471 · Açougue</p>
      </div>

      <p className="mt-3 text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Quantidade contada
      </p>
      <div className="mt-1 flex items-center justify-between rounded-md border-2 border-brand bg-white p-2 shadow-brand">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-neutral-600"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <motion.span
          key="qty"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          className="font-display text-[22px] font-bold text-neutral-900 tabular-nums"
        >
          18,4
        </motion.span>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-brand"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-2 rounded bg-brand-ghost px-2 py-1 text-center text-[8px] text-brand">
        Sistema esperava 22,0 kg
      </div>
    </motion.div>
  );
}

function DivergenceView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4"
    >
      <motion.div
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning"
      >
        <AlertTriangle size={32} strokeWidth={2} />
      </motion.div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Divergência detectada
      </p>
      <div className="grid w-full grid-cols-2 gap-1.5">
        <div className="rounded bg-surface-raised p-2 text-center">
          <p className="text-[7px] uppercase text-neutral-500">Sistema</p>
          <p className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
            22,0 kg
          </p>
        </div>
        <div className="rounded border-2 border-warning/40 bg-warning/5 p-2 text-center">
          <p className="text-[7px] uppercase text-warning">Contado</p>
          <p className="font-display text-[12px] font-bold text-warning tabular-nums">
            18,4 kg
          </p>
        </div>
      </div>
      <p className="text-[8px] font-bold text-warning">
        – 3,6 kg (-16,4%)
      </p>
    </motion.div>
  );
}

function JustificationView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-1"
    >
      <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500">
        Justificativa
      </p>
      <div className="mt-1 space-y-1">
        {[
          { label: "Quebra / perda", active: true },
          { label: "Erro de etiquetagem" },
          { label: "Transferência não registrada" },
          { label: "Validade vencida" },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={cn(
              "flex w-full items-center justify-between rounded-md p-1.5",
              opt.active
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <span className="text-[9px] font-semibold">{opt.label}</span>
            {opt.active && (
              <CheckCircle2 size={12} strokeWidth={2.5} className="text-white" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-md border border-dashed border-brand/30 bg-surface-raised p-2">
        <p className="text-[8px] text-neutral-500">Observação</p>
        <p className="mt-0.5 text-[9px] text-neutral-700">
          "Perda durante porcionamento, registrada em RP-2847"
        </p>
      </div>
    </motion.div>
  );
}

function SyncedView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-2 px-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <Cloud size={28} strokeWidth={2} />
      </motion.div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Sincronizado
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Contagem do açougue enviada ao ERP
      </p>
      <div className="mt-1 flex items-center gap-1 text-[8px] text-success">
        <RefreshCw size={9} strokeWidth={2.5} />
        12 itens · há instantes
      </div>
    </motion.div>
  );
}
