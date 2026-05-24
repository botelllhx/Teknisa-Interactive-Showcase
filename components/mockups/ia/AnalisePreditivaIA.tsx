"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Sun,
  Moon,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { AreaChart } from "@/components/ui/charts";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StackedAvatars } from "@/components/ui/StackedAvatars";
import { people } from "@/lib/photos";

interface APIAProps {
  step: number;
}

/**
 * Análise Preditiva — restaurant-focused ML.
 *
 * v13.2 rewrite: stripped down to 4 sections following the Noteflow
 * reference (airy, generous spacing, very few cards per view). Previous
 * version was cramming 7+ panels into one screen; that's gone. Order:
 *
 *   1. Greeting hero (similar to Noteflow "Good morning Sajibur")
 *   2. 3-up KPI strip (only 3 cards, big numbers, room to breathe)
 *   3. Forecast chart — one big card, dominant visually
 *   4. AI decisions feed — single card, clean list (no agent dashboard
 *      gradient block, no feature importance, no model gauge — the
 *      kitchen sink is gone)
 */
export function AnalisePreditivaIAMockup({ step }: APIAProps) {
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({ apiaStep: step });
  }, [step, patchLive]);

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden font-ui text-neutral-900"
      style={{
        background:
          "radial-gradient(ellipse at top left, rgba(124,58,237,0.06), transparent 45%), radial-gradient(ellipse at top right, rgba(2,7,136,0.04), transparent 45%), #fafbfc",
      }}
    >
      <Header />
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto px-10 py-8">
        <GreetingHero />
        <KPIRow />
        <ForecastCard />
        <DecisionsCard />
      </main>
    </div>
  );
}

// ============================================================================
// Header — slim, Noteflow-style with right-side avatar group
// ============================================================================

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white/80 px-10 backdrop-blur">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={88} height={16} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
              boxShadow:
                "0 2px 6px rgba(124,58,237,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
            }}
          >
            <Sparkles size={13} strokeWidth={2.25} />
          </span>
          <p
            className="font-display text-[13.5px] font-bold text-neutral-900"
            style={{ letterSpacing: "-0.018em" }}
          >
            Análise Preditiva
          </p>
          <span
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-ui text-[8.5px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.14em" }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            Modelo ativo
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StackedAvatars
          size={28}
          overlap={0.36}
          people={[
            { name: "João Costa", photo: people.joao },
            { name: "Mariana Costa", photo: people.mariana },
            { name: "Carlos Mello", photo: people.carlos },
          ]}
          extraLabel="+5"
        />
        <PersonAvatar
          photo={people.joao}
          name="João Costa"
          size={32}
          ring
        />
      </div>
    </header>
  );
}

// ============================================================================
// Greeting hero
// ============================================================================

function GreetingHero() {
  return (
    <section className="flex items-start justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Sun size={14} strokeWidth={2.25} className="text-amber-500" />
          <span
            className="font-ui text-[11px] font-medium uppercase text-neutral-500"
            style={{ letterSpacing: "0.08em" }}
          >
            Bom dia, João
          </span>
        </div>
        <h1
          className="mt-2 font-display text-[34px] font-bold leading-[1.05] text-neutral-900"
          style={{ letterSpacing: "-0.025em" }}
        >
          O modelo já tomou{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            7 decisões
          </span>{" "}
          enquanto você dormia.
        </h1>
        <p
          className="mt-2 max-w-[58ch] font-ui text-[13.5px] leading-relaxed text-neutral-500"
          style={{ letterSpacing: "-0.005em" }}
        >
          Modelo XGBoost cruzando 24 meses de histórico, clima e calendário —
          atualizado há 4 horas. Sua intervenção só é necessária quando aparece
          algo vermelho.
        </p>
      </div>

      <div
        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-subtle"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-success"
        />
        <span
          className="font-ui text-[11px] font-medium text-neutral-700"
          style={{ letterSpacing: "-0.005em" }}
        >
          Modelo ativo · 87,4%
        </span>
      </div>
    </section>
  );
}

// ============================================================================
// 3-up KPI row — big, breathing, Noteflow-style
// ============================================================================

function KPIRow() {
  const kpis = [
    {
      label: "Demanda prevista",
      value: "1.847",
      sub: "refeições · hoje",
      delta: "+8,2%",
      deltaTone: "up" as const,
      icon: <TrendingUp size={16} strokeWidth={2} />,
      accent: "linear-gradient(135deg, #020788, #7c3aed)",
    },
    {
      label: "Risco de desperdício",
      value: "14,2",
      sub: "kg · acima da meta",
      delta: "Sexta · pico",
      deltaTone: "warn" as const,
      icon: <Brain size={16} strokeWidth={2} />,
      accent: "linear-gradient(135deg, #d97706, #f59e0b)",
    },
    {
      label: "Acurácia do modelo",
      value: "87,4%",
      sub: "MAE ±42 refeições",
      delta: "+2,1pp",
      deltaTone: "up" as const,
      icon: <Sparkles size={16} strokeWidth={2} />,
      accent: "linear-gradient(135deg, #16a34a, #0d9488)",
    },
  ];

  return (
    <section data-tour="apia-kpis" className="grid grid-cols-3 gap-4">
      {kpis.map((k, i) => (
        <motion.div
          key={k.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-white p-5"
          style={{
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div className="flex items-start justify-between">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{ background: k.accent, boxShadow: "0 4px 12px rgba(2,7,136,0.10)" }}
            >
              {k.icon}
            </span>
            <span
              className={cn(
                "font-ui text-[11px] font-medium tabular-nums",
                k.deltaTone === "up"
                  ? "text-success"
                  : k.deltaTone === "warn"
                    ? "text-warning"
                    : "text-neutral-500",
              )}
              style={{ letterSpacing: "-0.005em" }}
            >
              {k.delta}
            </span>
          </div>
          <p
            className="mt-5 font-ui text-[12px] font-medium text-neutral-500"
            style={{ letterSpacing: "-0.005em" }}
          >
            {k.label}
          </p>
          <p
            className="mt-1 font-display text-[36px] font-bold leading-none tabular-nums text-neutral-900"
            style={{ letterSpacing: "-0.03em" }}
          >
            {k.value}
          </p>
          <p
            className="mt-1.5 font-ui text-[11.5px] text-neutral-400"
            style={{ letterSpacing: "-0.005em" }}
          >
            {k.sub}
          </p>
        </motion.div>
      ))}
    </section>
  );
}

// ============================================================================
// Forecast card — single big card, dominant visually
// ============================================================================

function ForecastCard() {
  const forecast = [
    { x: "S-7", y: 1620 },
    { x: "S-6", y: 1710 },
    { x: "S-5", y: 1680 },
    { x: "S-4", y: 1820 },
    { x: "S-3", y: 1790 },
    { x: "S-2", y: 1900 },
    { x: "S-1", y: 1847 },
    { x: "Hoje", y: 1847 },
    { x: "S+1", y: 1890 },
    { x: "S+2", y: 1920 },
    { x: "S+3", y: 1980 },
    { x: "S+4", y: 2040 },
    { x: "S+5", y: 2150 },
    { x: "S+6", y: 2200 },
  ];

  return (
    <motion.section
      data-tour="apia-forecast"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white px-6 py-5"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="font-display text-[18px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            Demanda prevista
          </h2>
          <p
            className="mt-1 font-ui text-[12px] text-neutral-500"
            style={{ letterSpacing: "-0.005em" }}
          >
            7 dias de histórico + 7 dias de previsão · XGBoost v4.2
          </p>
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: "7d", active: false },
            { label: "14d", active: true },
            { label: "30d", active: false },
          ].map((t) => (
            <button
              key={t.label}
              type="button"
              className={cn(
                "rounded-md px-2.5 py-1 font-ui text-[11px] font-medium transition-all",
                t.active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[180px]">
        <AreaChart
          data={forecast}
          color="#7c3aed"
          yMin={1500}
          yMax={2300}
          aspectRatio="16/4"
          formatY={(v) => `${v.toFixed(0)} refeições`}
        />
      </div>
    </motion.section>
  );
}

// ============================================================================
// Decisions card — Noteflow-style clean list
// ============================================================================

interface Decision {
  id: string;
  what: string;
  detail: string;
  when: string;
  status: "applied" | "pending" | "alert";
}

function DecisionsCard() {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const decisions: Decision[] = [
    {
      id: "d1",
      what: "Pedido de queijo aumentado",
      detail: "Subiu 4kg para sexta-feira (previsão de pico).",
      when: "Há 5 min",
      status: "applied",
    },
    {
      id: "d2",
      what: "Cardápio quinta ajustado",
      detail: "Removeu 2 pratos com risco alto de sobra.",
      when: "Há 1h",
      status: "applied",
    },
    {
      id: "d3",
      what: "Alerta de pico enviado",
      detail: "Feriado prolongado, +14% de demanda projetada.",
      when: "Há 3h",
      status: "alert",
    },
    {
      id: "d4",
      what: "Aguarda sua aprovação",
      detail: "Renegociar contrato de óleo com fornecedor preferencial.",
      when: "Há 6h",
      status: "pending",
    },
  ];

  return (
    <motion.section
      data-tour="apia-agent"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white px-6 py-5"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="font-display text-[18px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            Decisões do agente
          </h2>
          <p
            className="mt-1 font-ui text-[12px] text-neutral-500"
            style={{ letterSpacing: "-0.005em" }}
          >
            Últimas 24h · 7 ações tomadas, 1 aguarda você
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-ui text-[11px] font-medium text-neutral-600 hover:bg-neutral-100"
        >
          Ver tudo
          <ArrowUpRight size={11} strokeWidth={2.25} />
        </button>
      </div>

      <ul className="mt-3 divide-y divide-neutral-100">
        {decisions.map((d, i) => {
          const isAck = acknowledged.has(d.id);
          const ack = isAck || d.status !== "pending";
          return (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.25 }}
              className="flex items-start gap-3 py-3"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full",
                  d.status === "applied" && "bg-success/12 text-success",
                  d.status === "pending" && "bg-warning/12 text-warning",
                  d.status === "alert" && "bg-brand-ghost text-brand",
                  isAck && d.status === "pending" && "bg-success/12 text-success",
                )}
              >
                {ack ? (
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                ) : d.status === "alert" ? (
                  <Sparkles size={12} strokeWidth={2.5} />
                ) : (
                  <Moon size={12} strokeWidth={2.5} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-ui text-[13px] font-bold text-neutral-900"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {d.what}
                </p>
                <p
                  className="mt-0.5 font-ui text-[12px] text-neutral-500"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {d.detail}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {d.status === "pending" && !isAck ? (
                  <button
                    type="button"
                    onClick={() =>
                      setAcknowledged((prev) => {
                        const next = new Set(prev);
                        next.add(d.id);
                        return next;
                      })
                    }
                    className="rounded-md bg-neutral-900 px-2.5 py-1 font-ui text-[11px] font-medium text-white transition-all hover:bg-neutral-800"
                  >
                    Aprovar
                  </button>
                ) : (
                  <span
                    className="font-ui text-[11px] text-neutral-400 tabular-nums"
                    style={{ letterSpacing: "-0.005em" }}
                  >
                    {d.when}
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
