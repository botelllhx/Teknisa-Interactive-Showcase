"use client";

import { motion } from "framer-motion";
import {
  PackageSearch,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Minus,
  Plus,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/shadcn";

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
    <div className="flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <header className="border-b border-brand/8 px-4 pb-2 pt-3">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          Rotinas · Estoque
        </p>
        <p className="font-ui text-[10px] text-neutral-500">
          Quinta-feira · 21/05
        </p>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {step === 0 && <TaskListView />}
        {step === 1 && <CountingView />}
        {step === 2 && <DivergenceView />}
        {step === 3 && <JustificationView />}
        {step >= 4 && <SyncedView />}
      </main>
    </div>
  );
}

function TaskListView() {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3">
      <div className="rounded-xl bg-brand-ghost px-3 py-2">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
          Hoje
        </p>
        <p className="font-ui text-[13px] font-bold text-neutral-900">
          {TASKS.length} tarefas atribuídas
        </p>
      </div>

      <div data-tour="ae-task-list" className="mt-1 space-y-2">
        {TASKS.map((task, i) => (
          <motion.button
            key={task.label}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.06 * i, duration: 0.22 }}
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl p-3 text-left transition-colors",
              task.active
                ? "border-2 border-brand bg-brand-ghost shadow-card"
                : "border border-brand/10 bg-white shadow-card",
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 flex-none items-center justify-center rounded-xl",
                task.done
                  ? "bg-success/15 text-success"
                  : task.active
                    ? "bg-brand text-white shadow-brand"
                    : "bg-brand-subtle text-brand",
              )}
            >
              {task.done ? (
                <CheckCircle2 size={16} strokeWidth={2.25} />
              ) : (
                <PackageSearch size={16} strokeWidth={2} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-ui text-[12px] font-bold text-neutral-900">
                {task.label}
              </p>
              <p className="font-ui text-[10px] text-neutral-500">
                {task.count}
              </p>
            </div>
            {task.active && (
              <Badge variant="warning">Agora</Badge>
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
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      <div className="rounded-xl bg-brand-ghost px-3 py-2.5">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
          Contando item 4 de 12
        </p>
        <p className="font-ui text-[15px] font-bold text-neutral-900">
          Patinho moído kg
        </p>
        <p className="font-ui text-[10px] text-neutral-500">
          SKU 28471 · Açougue
        </p>
      </div>

      <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
        Quantidade contada
      </p>
      <div
        data-tour="ae-counter"
        className="flex items-center justify-between rounded-xl border-2 border-brand bg-white p-3 shadow-brand"
      >
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 active:scale-95"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
        <motion.span
          key="qty"
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          className="font-ui text-[34px] font-bold tabular-nums leading-none text-neutral-900"
        >
          18,4
        </motion.span>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white shadow-brand transition-all hover:-translate-y-[1px] active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="rounded-lg bg-brand-ghost px-3 py-2 text-center font-ui text-[11px] font-medium text-brand">
        Sistema esperava 22,0 kg
      </div>
    </motion.div>
  );
}

function DivergenceView() {
  return (
    <motion.div
      data-tour="ae-divergence"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-5"
    >
      <motion.div
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 0.5, repeat: 3, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/15 text-warning"
      >
        <AlertTriangle size={36} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[15px] font-bold text-neutral-900">
        Divergência detectada
      </p>
      <div className="grid w-full grid-cols-2 gap-2">
        <div className="rounded-xl bg-neutral-50 px-3 py-3 text-center">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
            Sistema
          </p>
          <p className="mt-1 font-ui text-[20px] font-bold tabular-nums leading-none text-neutral-900">
            22,0 kg
          </p>
        </div>
        <div className="rounded-xl border-2 border-warning/40 bg-warning/5 px-3 py-3 text-center">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-warning">
            Contado
          </p>
          <p className="mt-1 font-ui text-[20px] font-bold tabular-nums leading-none text-warning">
            18,4 kg
          </p>
        </div>
      </div>
      <p className="font-ui text-[12px] font-bold text-warning tabular-nums">
        −3,6 kg (−16,4%)
      </p>
    </motion.div>
  );
}

function JustificationView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-3"
    >
      <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
        Justificativa
      </p>
      <div className="space-y-1.5">
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
              "flex w-full items-center justify-between rounded-lg p-2.5 transition-colors active:scale-[0.99]",
              opt.active
                ? "bg-brand text-white shadow-brand"
                : "border border-brand/10 bg-white text-neutral-700",
            )}
          >
            <span className="font-ui text-[12px] font-bold">{opt.label}</span>
            {opt.active && (
              <CheckCircle2 size={14} strokeWidth={2.5} className="text-white" />
            )}
          </button>
        ))}
      </div>
      <div
        data-tour="ae-justification"
        className="mt-2 rounded-xl border border-dashed border-brand/30 bg-brand-ghost/50 px-3 py-2.5"
      >
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
          Observação
        </p>
        <p className="mt-0.5 font-ui text-[11px] text-neutral-700">
          &ldquo;Perda durante porcionamento, registrada em RP-2847&rdquo;
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
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-5"
    >
      <motion.div
        data-tour="ae-sync"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-brand"
      >
        <Cloud size={32} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[15px] font-bold text-neutral-900">
        Sincronizado
      </p>
      <p className="text-center font-ui text-[11px] text-neutral-500">
        Contagem do açougue enviada ao ERP
      </p>
      <div className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 font-ui text-[10px] font-bold text-success">
        <RefreshCw size={11} strokeWidth={2.5} />
        12 itens · há instantes
      </div>
    </motion.div>
  );
}
