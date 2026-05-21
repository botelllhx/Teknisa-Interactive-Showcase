"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Wand2,
  Settings2,
  Eye,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface AssistenteRegrasProps {
  step: number;
}

const EXISTING_RULES = [
  { name: "Hora extra acima de 2h", on: true },
  { name: "Adicional noturno > 22h", on: true },
  { name: "Sobreaviso final de semana", on: false },
];

export function AssistenteRegrasMockup({ step }: AssistenteRegrasProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <Wand2 size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Assistente de Regras
            </p>
            <p className="text-[8px] text-neutral-500">
              Configuração inteligente · sem código
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-brand">
          <Sparkles size={9} strokeWidth={2.5} />
          IA
        </span>
      </header>

      <main className="flex-1 p-3">
        {step === 0 && <ExistingRulesView />}
        {step === 1 && <WizardView />}
        {step === 2 && <ConditionsView />}
        {step === 3 && <PreviewView />}
        {step >= 4 && <ActivatedView />}
      </main>
    </div>
  );
}

function ExistingRulesView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Regras configuradas
        </p>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[9px] font-bold text-white shadow-brand"
        >
          <Plus size={11} strokeWidth={2.5} />
          Nova regra
        </button>
      </div>
      <div className="mt-2 space-y-1.5">
        {EXISTING_RULES.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center justify-between rounded-md border border-brand/10 bg-white p-2 shadow-card"
          >
            <div className="flex items-center gap-2">
              <Settings2 size={12} strokeWidth={2} className="text-brand" />
              <span className="text-[9px] font-semibold text-neutral-900">
                {r.name}
              </span>
            </div>
            <span
              className={cn(
                "flex h-4 w-7 items-center rounded-full px-0.5",
                r.on ? "bg-brand" : "bg-neutral-300",
              )}
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full bg-white transition-transform",
                  r.on ? "translate-x-3" : "translate-x-0",
                )}
              />
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function WizardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <div className="rounded-md border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-brand">
            <Sparkles size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
              Wizard · descreva o que precisa
            </p>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Como deseja configurar a regra?
            </p>
          </div>
        </div>
        <div className="mt-3 rounded border-2 border-brand/30 bg-white p-2">
          <p className="text-[9px] font-medium text-neutral-700">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              &ldquo;Quando funcionário fizer hora extra aos sábados, pagar 80%
              a mais e notificar gestor automaticamente&rdquo;
            </motion.span>
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Sugestões da IA
        </p>
        {[
          "Hora extra acima de 4h no domingo",
          "Adicional para feriados",
          "Compensação de banco de horas",
        ].map((s, i) => (
          <motion.button
            key={s}
            initial={{ x: 4, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            type="button"
            className="flex w-full items-center gap-2 rounded border border-brand/10 bg-white px-2 py-1.5 text-left text-[9px] text-neutral-700"
          >
            <Sparkles size={10} strokeWidth={2} className="text-brand" />
            {s}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ConditionsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
        Configuração detectada
      </p>
      <div className="mt-2 space-y-1.5">
        <Block
          label="Quando"
          value="Hora extra realizada"
          chip="Trigger"
          tone="brand"
        />
        <Block
          label="Filtro"
          value="Dia da semana = Sábado"
          chip="AND"
          tone="neutral"
        />
        <Block
          label="Ação"
          value="Pagar 80% adicional"
          chip="THEN"
          tone="success"
        />
        <Block
          label="Notificação"
          value="Enviar para gestor direto"
          chip="ALSO"
          tone="brand"
        />
      </div>
    </motion.div>
  );
}

function PreviewView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-brand">
          <Eye size={10} strokeWidth={2.25} />
          Preview da regra
        </p>
        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[8px] font-semibold text-warning">
          Rascunho
        </span>
      </div>
      <div className="mt-2 flex-1 rounded-md border border-brand/30 bg-white p-3 shadow-card">
        <p className="font-display text-[11px] font-bold text-neutral-900">
          Hora extra sábado · adicional 80%
        </p>
        <p className="mt-1 text-[8px] text-neutral-500">
          Aplicar quando colaborador realizar hora extra aos sábados
        </p>

        <div className="mt-3 space-y-1.5 border-t border-dashed border-neutral-200 pt-2">
          <PreviewLine label="Trigger" value="Hora extra registrada" />
          <PreviewLine label="Condição" value="weekday === 'sat'" mono />
          <PreviewLine label="Cálculo" value="valor_hora × 1,80" mono />
          <PreviewLine label="Notificação" value="gestor.direto via push" />
        </div>

        <div className="mt-3 rounded bg-brand-ghost p-2 text-[8px] text-brand">
          Impacto estimado: 12 colaboradores · custo médio R$ 320/mês
        </div>
      </div>
    </motion.div>
  );
}

function ActivatedView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center justify-center gap-3"
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
        <Zap size={28} strokeWidth={2} />
      </motion.div>
      <p className="font-display text-[12px] font-bold text-neutral-900">
        Regra ativada
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Vai começar a valer no próximo sábado
      </p>
      <div className="flex items-center gap-1 rounded bg-success/10 px-3 py-1 text-[8px] font-semibold text-success">
        <CheckCircle2 size={10} strokeWidth={2.5} />
        Folha de pagamento sincronizada
      </div>
    </motion.div>
  );
}

function Block({
  label,
  value,
  chip,
  tone,
}: {
  label: string;
  value: string;
  chip: string;
  tone: "brand" | "neutral" | "success";
}) {
  return (
    <div
      className={cn(
        "rounded-md border bg-white p-2 shadow-card",
        tone === "brand" && "border-brand/20",
        tone === "neutral" && "border-neutral-200",
        tone === "success" && "border-success/30",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[7px] uppercase tracking-wider text-neutral-500">
          {label}
        </p>
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase",
            tone === "brand" && "bg-brand-subtle text-brand",
            tone === "neutral" && "bg-neutral-100 text-neutral-600",
            tone === "success" && "bg-success/10 text-success",
          )}
        >
          {chip}
        </span>
      </div>
      <p className="mt-0.5 text-[9px] font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function PreviewLine({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-[8px]">
      <span className="text-neutral-500">{label}</span>
      <span
        className={cn(
          "font-semibold text-neutral-900",
          mono && "font-mono text-brand",
        )}
      >
        {value}
      </span>
    </div>
  );
}
