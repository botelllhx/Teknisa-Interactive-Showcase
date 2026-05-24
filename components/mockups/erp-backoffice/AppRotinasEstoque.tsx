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
import { GradientIcon } from "@/components/ui/GradientIcon";

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
      <header
        className="flex items-center justify-between border-b border-brand/8 px-4 pb-2.5 pt-3"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #fafbfd 100%)",
        }}
      >
        <div>
          <p
            className="font-ui text-[10px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            Rotinas · Estoque
          </p>
          <p
            className="mt-0.5 font-ui text-[10px] text-neutral-500 tabular-nums"
            style={{ letterSpacing: "-0.005em" }}
          >
            Quinta-feira · 21/05
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-ui text-[8.5px] font-bold uppercase text-success"
          style={{ letterSpacing: "0.14em" }}
        >
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-success"
          />
          Online
        </span>
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
      <div
        className="overflow-hidden rounded-2xl bg-ai-soft p-3.5"
        style={{
          border: "1px solid rgba(2,7,136,0.08)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <GradientIcon icon={<PackageSearch />} tone="brand" size={36} />
          <div>
            <p
              className="font-ui text-[10px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.10em" }}
            >
              Hoje · 21 mai
            </p>
            <p
              className="mt-0.5 font-ui text-[17px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.01em" }}
            >
              {TASKS.length} tarefas atribuídas
            </p>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            { l: "Pendentes", v: "2", tone: "warning" as const },
            { l: "Concluídas", v: "1", tone: "success" as const },
            { l: "Itens hoje", v: "54", tone: "brand" as const },
          ].map((k) => (
            <div
              key={k.l}
              className="rounded-lg bg-white/80 px-2 py-1.5 backdrop-blur"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <p
                className="font-ui text-[8px] font-bold uppercase text-neutral-400"
                style={{ letterSpacing: "0.08em" }}
              >
                {k.l}
              </p>
              <p
                className={cn(
                  "mt-0.5 font-ui text-[15px] font-bold tabular-nums leading-none",
                  k.tone === "warning" && "text-warning",
                  k.tone === "success" && "text-success",
                  k.tone === "brand" && "text-brand",
                )}
                style={{ letterSpacing: "-0.02em" }}
              >
                {k.v}
              </p>
            </div>
          ))}
        </div>
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
      className="flex flex-1 flex-col items-center justify-center px-5"
    >
      {/* data-tour no wrapper estático — o motion rotativo do Cloud
          rotacionaria o spotlight junto */}
      <div
        data-tour="ae-sync"
        className="flex flex-col items-center gap-3.5 rounded-2xl bg-white px-6 py-6"
        style={{
          border: "1px solid rgba(2,7,136,0.08)",
          boxShadow:
            "0 4px 16px rgba(2,7,136,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-full text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
            boxShadow:
              "0 8px 20px rgba(2,7,136,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
          }}
        >
          <Cloud size={32} strokeWidth={2.25} />
        </motion.div>
        <p
          className="font-display text-[16px] font-bold text-neutral-900"
          style={{ letterSpacing: "-0.020em" }}
        >
          Sincronizado
        </p>
        <p
          className="text-center font-ui text-[11.5px] text-neutral-500"
          style={{ letterSpacing: "-0.005em" }}
        >
          Contagem do açougue enviada ao ERP
        </p>
        <div
          className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 font-ui text-[10px] font-bold uppercase text-success"
          style={{ letterSpacing: "0.14em" }}
        >
          <RefreshCw size={11} strokeWidth={2.5} />
          <span className="tabular-nums">12 itens</span> · há instantes
        </div>
      </div>
    </motion.div>
  );
}
