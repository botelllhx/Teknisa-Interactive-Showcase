"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
import { Badge, Button, Card } from "@/components/ui/shadcn";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { ChipRemovable } from "@/components/ui/ChipRemovable";

interface AssistenteRegrasProps {
  step: number;
}

const EXISTING_RULES = [
  { name: "Hora extra acima de 2h", category: "Ponto", on: true },
  { name: "Adicional noturno > 22h", category: "Folha", on: true },
  { name: "Sobreaviso final de semana", category: "Escala", on: false },
];

export function AssistenteRegrasMockup({ step }: AssistenteRegrasProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
        <div className="flex items-center gap-3">
          <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
          <span className="h-5 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-white"
              style={{ background: "#020788" }}
            >
              <Wand2 size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Assistente de Regras
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                Configuração inteligente, sem código
              </p>
            </div>
          </div>
        </div>
        <Badge variant="ai">
          <Sparkles size={10} strokeWidth={2.5} />
          IA
        </Badge>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden p-4">
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
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-3 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          Regras configuradas
        </p>
        <Button
          type="button"
          data-tour="ar-new-rule"
          variant="ai"
          size="default"
        >
          <Plus size={14} strokeWidth={2.5} />
          Nova regra
        </Button>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {EXISTING_RULES.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
          >
            <Card
              className="flex items-center justify-between p-3.5 shadow-subtle"
              style={{ borderColor: "rgba(2,7,136,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <GradientIcon
                  icon={<Settings2 />}
                  tone={r.on ? "brand" : "ai"}
                  size={36}
                  variant={r.on ? "solid" : "soft"}
                />
                <div>
                  <p
                    className="font-ui text-[12px] font-bold text-neutral-900"
                    style={{ letterSpacing: "-0.005em" }}
                  >
                    {r.name}
                  </p>
                  <p
                    className="font-ui text-[9px] font-bold uppercase text-neutral-500"
                    style={{ letterSpacing: "0.10em" }}
                  >
                    {r.category}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={r.on}
                variant="labeled"
                size="md"
                tone="brand"
              />
            </Card>
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
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-3 overflow-y-auto"
    >
      <div
        data-tour="ar-wizard"
        className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white shadow-brand">
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand">
              Wizard, descreva o que precisa
            </p>
            <p className="font-ui text-[14px] font-bold text-neutral-900">
              Como deseja configurar a regra?
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border-2 border-brand/30 bg-white p-3">
          <p className="font-ui text-[12px] font-medium leading-relaxed text-neutral-700">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              &ldquo;Quando funcionário fizer hora extra aos sábados, pagar 80%
              a mais e notificar gestor automaticamente&rdquo;
            </motion.span>
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
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
            transition={{ delay: 0.05 * i, duration: 0.22 }}
            type="button"
            className="flex w-full items-center gap-2 rounded-lg border border-brand/10 bg-white px-3 py-2.5 text-left font-ui text-[12px] text-neutral-700 transition-all hover:-translate-y-[1px] hover:shadow-card"
          >
            <Sparkles size={12} strokeWidth={2.25} className="text-brand" />
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
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-3 overflow-y-auto"
    >
      <div className="flex items-center justify-between">
        <p
          className="font-ui text-[10px] font-bold uppercase text-brand"
          style={{ letterSpacing: "0.10em" }}
        >
          Configuração detectada
        </p>
        <Badge variant="ai">
          <Sparkles size={9} strokeWidth={2.5} />
          IA estruturou
        </Badge>
      </div>

      {/* Chips removíveis representam tokens da regra detectada — usuário pode
          tirar o que não faz sentido. Padrão Roles & Permissions. */}
      <div data-tour="ar-conditions" className="flex flex-wrap gap-1.5">
        <ChipRemovable
          label="Hora extra"
          tone="brand"
          leading={<Sparkles size={10} strokeWidth={2.5} />}
          onRemove={() => {}}
        />
        <ChipRemovable
          label="Sábado"
          tone="neutral"
          onRemove={() => {}}
        />
        <ChipRemovable
          label="Adicional 80%"
          tone="success"
          onRemove={() => {}}
        />
        <ChipRemovable
          label="Notifica gestor"
          tone="brand"
          onRemove={() => {}}
        />
      </div>

      <div className="space-y-2">
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
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-2 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          <Eye size={12} strokeWidth={2.25} />
          Preview da regra
        </p>
        <Badge variant="warning">Rascunho</Badge>
      </div>
      <div data-tour="ar-preview" className="flex-1 overflow-hidden">
        <Card className="flex h-full flex-col border-brand/30 p-4">
          <p className="font-ui text-[15px] font-bold text-neutral-900">
            Hora extra sábado · adicional 80%
          </p>
          <p className="mt-1 font-ui text-[11px] text-neutral-500">
            Aplicar quando colaborador realizar hora extra aos sábados
          </p>

          <div className="mt-4 space-y-2 border-t border-dashed border-neutral-200 pt-3">
            <PreviewLine label="Trigger" value="Hora extra registrada" />
            <PreviewLine label="Condição" value="weekday === 'sat'" mono />
            <PreviewLine label="Cálculo" value="valor_hora × 1,80" mono />
            <PreviewLine label="Notificação" value="gestor.direto via push" />
          </div>

          <div className="mt-auto rounded-xl bg-brand-ghost px-3 py-2.5 font-ui text-[11px] text-brand">
            Impacto estimado: 12 colaboradores · custo médio R$ 320/mês
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function ActivatedView() {
  return (
    <motion.div
      data-tour="ar-activated"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col items-center justify-center gap-4"
    >
      <motion.div
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-[0_8px_30px_rgba(22,163,74,0.35)]"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-success/40"
        />
        <Zap size={32} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[16px] font-bold text-neutral-900">
        Regra ativada
      </p>
      <p className="text-center font-ui text-[11px] text-neutral-500">
        Vai começar a valer no próximo sábado
      </p>
      <Badge variant="success">
        <CheckCircle2 size={11} strokeWidth={2.5} />
        Folha de pagamento sincronizada
      </Badge>
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
        "rounded-xl border bg-white p-3 shadow-card",
        tone === "brand" && "border-brand/20",
        tone === "neutral" && "border-neutral-200",
        tone === "success" && "border-success/30",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
          {label}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-ui text-[9px] font-bold uppercase tracking-wider",
            tone === "brand" && "bg-brand-subtle text-brand",
            tone === "neutral" && "bg-neutral-100 text-neutral-600",
            tone === "success" && "bg-success/10 text-success",
          )}
        >
          {chip}
        </span>
      </div>
      <p className="mt-1 font-ui text-[13px] font-bold text-neutral-900">
        {value}
      </p>
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
    <div className="flex items-center justify-between font-ui text-[11px]">
      <span className="text-neutral-500">{label}</span>
      <span
        className={cn(
          "font-bold text-neutral-900",
          mono && "font-mono text-brand",
        )}
      >
        {value}
      </span>
    </div>
  );
}
