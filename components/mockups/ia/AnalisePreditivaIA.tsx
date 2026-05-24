"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Sun,
  TrendingUp,
  AlertTriangle,
  Cloud,
  Calendar,
  History,
  PartyPopper,
  Zap,
  RefreshCw,
  Target,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { AreaChart, RadialGauge } from "@/components/ui/charts";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StackedAvatars } from "@/components/ui/StackedAvatars";
import { people } from "@/lib/photos";

interface APIAProps {
  step: number;
}

/**
 * Forecast IA — restaurant demand/cost/waste prediction.
 *
 * v13.24 — renomeado de "Análise Preditiva" para "Forecast IA" (conflito
 * com Análise Preditiva de turnover em Pessoas e RH). Redesign focado em:
 *
 * 1. Hero compacto (uma linha) — não mais bloco de 150px
 * 2. KPI strip 3-up slim (apia-kpis preserved)
 * 3. Grid 2-col: Forecast (1.45fr, taller chart) | XGBoost model (1fr)
 *    - O selector apia-model agora finalmente existe no DOM com card visível
 *    - Gauge 87,4% + métricas + feature importance bars + retrain button
 * 4. Decisões inline ao invés de lista grande — só pending + slim history
 *
 * Resultado: menos cards, mais densidade útil, XGBoost visível e
 * interativo, gráfico ganhou altura (~260px) e parou de parecer esticado.
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
      <main className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-6">
        <GreetingHero />
        <KPIRow />
        <div className="grid grid-cols-[1.45fr_1fr] gap-4">
          <ForecastCard />
          <XGBoostCard />
        </div>
        <DecisionsCard />
      </main>
    </div>
  );
}

// ============================================================================
// Header
// ============================================================================

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200/70 bg-white/80 px-8 backdrop-blur">
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
            className="font-display text-[14px] font-bold text-neutral-900"
            style={{ letterSpacing: "-0.018em" }}
          >
            Forecast IA
          </p>
          <span
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.14em" }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            XGBoost v4.2.1
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
// Greeting — compact single-line strip
// ============================================================================

function GreetingHero() {
  return (
    <section className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <Sun size={15} strokeWidth={2.25} className="text-amber-500" />
        <p
          className="font-display text-[24px] font-bold leading-tight text-neutral-900"
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
        </p>
      </div>
      <div
        className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <RefreshCw size={11} strokeWidth={2.5} className="text-neutral-400" />
        <span
          className="font-ui text-[11px] font-medium text-neutral-600"
          style={{ letterSpacing: "-0.005em" }}
        >
          Atualizado há 4h
        </span>
      </div>
    </section>
  );
}

// ============================================================================
// KPI strip — slim 3-up
// ============================================================================

interface KPI {
  id: string;
  label: string;
  value: string;
  sub: string;
  delta: string;
  deltaTone: "up" | "warn";
  icon: React.ReactNode;
  accent: string;
}

function KPIRow() {
  const [activeKPI, setActiveKPI] = useState<string>("demanda");
  const kpis: KPI[] = [
    {
      id: "demanda",
      label: "Demanda prevista",
      value: "1.847",
      sub: "refeições · hoje",
      delta: "+8,2%",
      deltaTone: "up",
      icon: <TrendingUp size={14} strokeWidth={2.25} />,
      accent: "linear-gradient(135deg, #020788, #7c3aed)",
    },
    {
      id: "risco",
      label: "Risco de desperdício",
      value: "14,2",
      sub: "kg · acima da meta",
      delta: "Sexta · pico",
      deltaTone: "warn",
      icon: <AlertTriangle size={14} strokeWidth={2.25} />,
      accent: "linear-gradient(135deg, #d97706, #f59e0b)",
    },
    {
      id: "acuracia",
      label: "Acurácia do modelo",
      value: "87,4%",
      sub: "MAE ±42 refeições",
      delta: "+2,1pp",
      deltaTone: "up",
      icon: <Target size={14} strokeWidth={2.25} />,
      accent: "linear-gradient(135deg, #16a34a, #0d9488)",
    },
  ];

  return (
    <section data-tour="apia-kpis" className="grid grid-cols-3 gap-3">
      {kpis.map((k, i) => {
        const active = k.id === activeKPI;
        return (
          <motion.button
            key={k.id}
            type="button"
            onClick={() => setActiveKPI(k.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl bg-white p-4 text-left transition-all",
            )}
            style={{
              border: active
                ? "1.5px solid rgba(2,7,136,0.45)"
                : "1px solid rgba(0,0,0,0.05)",
              boxShadow: active
                ? "0 6px 18px rgba(2,7,136,0.12), 0 0 0 4px rgba(2,7,136,0.04)"
                : "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <span
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-white"
              style={{ background: k.accent, boxShadow: "0 4px 12px rgba(2,7,136,0.10)" }}
            >
              {k.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className="font-display text-[26px] font-bold leading-none tabular-nums text-neutral-900"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {k.value}
                </p>
                <span
                  className={cn(
                    "font-ui text-[10.5px] font-bold tabular-nums",
                    k.deltaTone === "up" ? "text-success" : "text-warning",
                  )}
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {k.delta}
                </span>
              </div>
              <p
                className="mt-1 font-ui text-[11.5px] font-medium text-neutral-500"
                style={{ letterSpacing: "-0.005em" }}
              >
                {k.label}
              </p>
              <p
                className="font-ui text-[10.5px] text-neutral-400"
                style={{ letterSpacing: "-0.005em" }}
              >
                {k.sub}
              </p>
            </div>
          </motion.button>
        );
      })}
    </section>
  );
}

// ============================================================================
// Forecast card — taller, less stretched
// ============================================================================

function ForecastCard() {
  const [range, setRange] = useState<"7d" | "14d" | "30d">("14d");

  const series7 = [
    { x: "S-3", y: 1790 },
    { x: "S-2", y: 1900 },
    { x: "S-1", y: 1847 },
    { x: "Hoje", y: 1847 },
    { x: "S+1", y: 1890 },
    { x: "S+2", y: 1920 },
    { x: "S+3", y: 1980 },
  ];
  const series14 = [
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
  const series30 = [
    { x: "Sem-4", y: 1480 },
    { x: "Sem-3", y: 1620 },
    { x: "Sem-2", y: 1750 },
    { x: "Sem-1", y: 1820 },
    { x: "Atual", y: 1847 },
    { x: "Sem+1", y: 1930 },
    { x: "Sem+2", y: 2050 },
    { x: "Sem+3", y: 2180 },
    { x: "Sem+4", y: 2300 },
  ];

  const data =
    range === "7d" ? series7 : range === "30d" ? series30 : series14;

  const tabs: { label: typeof range; subtitle: string }[] = [
    { label: "7d", subtitle: "última semana + próxima" },
    { label: "14d", subtitle: "2 semanas centradas em hoje" },
    { label: "30d", subtitle: "4 semanas + 4 projetadas" },
  ];
  const activeTab = tabs.find((t) => t.label === range)!;

  return (
    <motion.section
      data-tour="apia-forecast"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col rounded-2xl bg-white p-5"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="font-ui text-[10px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            Demanda prevista · refeições
          </p>
          <h2
            className="mt-1 font-display text-[20px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.022em" }}
          >
            Próximas 2 semanas
          </h2>
          <motion.p
            key={range}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-0.5 font-ui text-[11.5px] text-neutral-500"
            style={{ letterSpacing: "-0.005em" }}
          >
            {activeTab.subtitle}
          </motion.p>
        </div>
        <div
          className="flex items-center gap-0.5 rounded-lg bg-neutral-100 p-1"
          style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)" }}
        >
          {tabs.map((t) => {
            const active = t.label === range;
            return (
              <motion.button
                key={t.label}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setRange(t.label)}
                className={cn(
                  "relative rounded-md px-3 py-1.5 font-ui text-[11.5px] font-bold transition-colors",
                  active ? "text-white" : "text-neutral-500 hover:text-neutral-700",
                )}
                style={{ letterSpacing: "-0.005em" }}
              >
                {active && (
                  <motion.span
                    layoutId="apia-forecast-tab"
                    className="absolute inset-0 rounded-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
                      boxShadow:
                        "0 2px 6px rgba(2,7,136,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
                    }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex-1">
        <AreaChart
          key={range}
          data={data}
          color="#7c3aed"
          yMin={1400}
          yMax={2400}
          aspectRatio="16/8"
          formatY={(v) => `${v.toFixed(0)} refeições`}
          showYLabels
        />
      </div>
    </motion.section>
  );
}

// ============================================================================
// XGBoost model card — finally visible (data-tour="apia-model")
// ============================================================================

interface ModelFeature {
  id: string;
  label: string;
  weight: number;
  icon: React.ReactNode;
  color: string;
}

const FEATURES: ModelFeature[] = [
  {
    id: "historico",
    label: "Histórico (24m)",
    weight: 38,
    icon: <History size={11} strokeWidth={2.5} />,
    color: "#020788",
  },
  {
    id: "calendario",
    label: "Calendário & feriados",
    weight: 24,
    icon: <Calendar size={11} strokeWidth={2.5} />,
    color: "#1a1fa8",
  },
  {
    id: "clima",
    label: "Clima previsto",
    weight: 18,
    icon: <Cloud size={11} strokeWidth={2.5} />,
    color: "#3b42c4",
  },
  {
    id: "eventos",
    label: "Eventos locais",
    weight: 12,
    icon: <PartyPopper size={11} strokeWidth={2.5} />,
    color: "#7c3aed",
  },
];

function XGBoostCard() {
  const [selected, setSelected] = useState<string>("historico");
  const [retraining, setRetraining] = useState(false);

  const handleRetrain = () => {
    if (retraining) return;
    setRetraining(true);
    setTimeout(() => setRetraining(false), 2000);
  };

  return (
    <motion.section
      data-tour="apia-model"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col overflow-hidden rounded-2xl p-5 text-white"
      style={{
        background:
          "linear-gradient(180deg, #0a0e3d 0%, #050829 60%, #020616 100%)",
        boxShadow:
          "0 12px 32px rgba(2,7,136,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(124,58,237,0.20), transparent 55%), radial-gradient(ellipse at bottom left, rgba(2,7,136,0.18), transparent 55%)",
        }}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p
              className="flex items-center gap-1.5 font-ui text-[10px] font-bold uppercase"
              style={{
                letterSpacing: "0.20em",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              <Brain size={11} strokeWidth={2.5} />
              Modelo ativo
            </p>
            <h2
              className="mt-1 font-display text-[20px] font-bold leading-tight"
              style={{ letterSpacing: "-0.024em" }}
            >
              XGBoost <span style={{ color: "rgba(255,255,255,0.55)" }}>v4.2.1</span>
            </h2>
          </div>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-ui text-[9.5px] font-bold uppercase"
            style={{
              letterSpacing: "0.14em",
              background: "rgba(22,163,74,0.18)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.30)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            Treinado
          </span>
        </div>

        {/* Gauge + metrics */}
        <div className="mt-3 flex items-center gap-4">
          <RadialGaugeDark value={87.4} />
          <div className="flex-1">
            <div className="flex justify-between gap-2">
              <Metric label="F1 Score" value="0,84" />
              <Metric label="MAE" value="±42" />
            </div>
            <div className="mt-2 flex justify-between gap-2">
              <Metric label="RMSE" value="56" />
              <Metric label="Treino" value="4h" />
            </div>
          </div>
        </div>

        {/* Feature importance */}
        <div className="mt-4">
          <p
            className="font-ui text-[10px] font-bold uppercase"
            style={{
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.50)",
            }}
          >
            Pesos do modelo
          </p>
          <ul className="mt-2 space-y-1.5">
            {FEATURES.map((f, i) => {
              const isSelected = f.id === selected;
              return (
                <motion.li
                  key={f.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.25 }}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(f.id)}
                    className="group flex w-full items-center gap-2.5 rounded-md py-1 transition-all"
                  >
                    <span
                      className="flex h-5 w-5 flex-none items-center justify-center rounded-md transition-colors"
                      style={{
                        background: isSelected
                          ? f.color
                          : "rgba(255,255,255,0.06)",
                        color: isSelected ? "white" : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {f.icon}
                    </span>
                    <span
                      className="flex-none font-ui text-[11.5px] font-medium"
                      style={{
                        letterSpacing: "-0.005em",
                        color: isSelected
                          ? "white"
                          : "rgba(255,255,255,0.65)",
                      }}
                    >
                      {f.label}
                    </span>
                    <div className="flex-1">
                      <div
                        className="relative h-1.5 overflow-hidden rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)" }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.weight * 2.4}%` }}
                          transition={{
                            delay: 0.4 + i * 0.06,
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${f.color}, ${f.color}dd)`,
                            boxShadow: isSelected
                              ? `0 0 12px ${f.color}88`
                              : undefined,
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="w-9 flex-none text-right font-ui text-[11px] font-bold tabular-nums"
                      style={{
                        letterSpacing: "-0.005em",
                        color: isSelected
                          ? "white"
                          : "rgba(255,255,255,0.65)",
                      }}
                    >
                      {f.weight}%
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Retrain button */}
        <div className="mt-auto pt-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleRetrain}
            className="group flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-ui text-[12px] font-bold transition-all disabled:cursor-default"
            disabled={retraining}
            style={{
              background: retraining
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.14)",
              letterSpacing: "-0.005em",
              color: "white",
            }}
          >
            <motion.span
              animate={retraining ? { rotate: 360 } : { rotate: 0 }}
              transition={
                retraining
                  ? { duration: 1, repeat: Infinity, ease: "linear" }
                  : { duration: 0.3 }
              }
            >
              {retraining ? (
                <RefreshCw size={13} strokeWidth={2.5} />
              ) : (
                <Zap size={13} strokeWidth={2.5} />
              )}
            </motion.span>
            {retraining ? "Retreinando..." : "Retreinar modelo"}
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

function RadialGaugeDark({ value }: { value: number }) {
  return (
    <div className="flex flex-none items-end justify-center" style={{ width: 130 }}>
      <RadialGauge
        value={value}
        size={130}
        thickness={9}
        colors={{ from: "#a78bfa", to: "#7c3aed" }}
        label={`${value.toFixed(1)}%`}
        sublabel="Acurácia"
        labelColor="#ffffff"
        sublabelColor="rgba(255,255,255,0.50)"
        trackColor="rgba(255,255,255,0.08)"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-1 rounded-lg px-2.5 py-1.5"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="font-ui text-[9px] font-bold uppercase"
        style={{
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {label}
      </p>
      <p
        className="font-ui text-[14px] font-bold tabular-nums"
        style={{ letterSpacing: "-0.015em", color: "white" }}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// Decisions — focused, action-first
// ============================================================================

interface Decision {
  id: string;
  what: string;
  detail: string;
  when: string;
  status: "applied" | "pending" | "alert";
  impact?: string;
}

function DecisionsCard() {
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const decisions: Decision[] = [
    {
      id: "d4",
      what: "Aguarda sua aprovação",
      detail: "Renegociar contrato de óleo com fornecedor preferencial.",
      when: "Há 6h",
      status: "pending",
      impact: "Economia estimada: R$ 2.840/mês",
    },
    {
      id: "d3",
      what: "Alerta de pico enviado",
      detail: "Feriado prolongado, +14% de demanda projetada para sexta.",
      when: "Há 3h",
      status: "alert",
      impact: "3 unidades notificadas",
    },
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
  ];

  return (
    <motion.section
      data-tour="apia-agent"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white p-5"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="font-ui text-[10px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            Agente preditivo · 24h
          </p>
          <h2
            className="mt-1 font-display text-[18px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            Decisões do agente
          </h2>
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
          const wasOriginallyPending = d.status === "pending";
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
                  wasOriginallyPending && !isAck && "bg-warning/15 text-warning",
                  wasOriginallyPending && isAck && "bg-success/12 text-success",
                  d.status === "alert" && "bg-brand-ghost text-brand",
                )}
              >
                {d.status === "applied" || (wasOriginallyPending && isAck) ? (
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                ) : d.status === "alert" ? (
                  <AlertTriangle size={12} strokeWidth={2.5} />
                ) : (
                  <Sparkles size={12} strokeWidth={2.5} />
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
                  className="mt-0.5 font-ui text-[11.5px] text-neutral-500"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  {d.detail}
                </p>
                <AnimatePresence>
                  {d.impact && (!wasOriginallyPending || isAck) && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-1 inline-flex items-center gap-1 rounded-md bg-success/8 px-1.5 py-0.5 font-ui text-[10.5px] font-bold tabular-nums text-success"
                      style={{ letterSpacing: "-0.005em" }}
                    >
                      <CheckCircle2 size={10} strokeWidth={2.5} />
                      {d.impact}
                    </motion.p>
                  )}
                  {d.impact && wasOriginallyPending && !isAck && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 inline-flex items-center gap-1 rounded-md bg-warning/10 px-1.5 py-0.5 font-ui text-[10.5px] font-bold tabular-nums text-warning"
                      style={{ letterSpacing: "-0.005em" }}
                    >
                      <Sparkles size={10} strokeWidth={2.5} />
                      {d.impact}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                {wasOriginallyPending && !isAck ? (
                  <button
                    type="button"
                    onClick={() =>
                      setAcknowledged((prev) => {
                        const next = new Set(prev);
                        next.add(d.id);
                        return next;
                      })
                    }
                    className="rounded-md px-3 py-1.5 font-ui text-[11px] font-bold text-white transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
                      boxShadow: "0 2px 6px rgba(2,7,136,0.30)",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    Aprovar
                  </button>
                ) : (
                  <span
                    className="font-ui text-[11px] tabular-nums text-neutral-400"
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
