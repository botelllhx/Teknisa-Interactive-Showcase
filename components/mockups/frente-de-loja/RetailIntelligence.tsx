"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Rocket,
  BrainCircuit,
  Activity,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Target,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  Eye,
  Image as ImageIcon,
  PlusCircle,
  Megaphone,
  Calendar,
  BarChart3,
  Layers,
  Check,
  Crown,
  Utensils,
  Package,
  DollarSign,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface RetailIntelligenceProps {
  step: number;
}

// ============================================================================
// Screen narrative
//
// step 0 → dashboard with CMV alert
// step 1 → diagnóstico (3 priority cards)
// step 2 → menu engineering matrix with one product highlighted
// step 3 → product detail + 5 recommendations
// step 4 → impact simulation (current vs recommended)
// step 5 → action plan checklist
// step 6 → monitoring
// ============================================================================

type Screen =
  | "dashboard"
  | "diagnostico"
  | "matriz"
  | "produto"
  | "simulacao"
  | "plano"
  | "monitor";

const SCREEN_BY_STEP: Record<number, Screen> = {
  0: "dashboard",
  1: "diagnostico",
  2: "matriz",
  3: "produto",
  4: "simulacao",
  5: "plano",
  6: "monitor",
};

const SCREEN_LABEL: Record<Screen, string> = {
  dashboard: "Dashboard",
  diagnostico: "Diagnóstico",
  matriz: "Engenharia",
  produto: "Produto",
  simulacao: "Simulação",
  plano: "Plano",
  monitor: "Monitorando",
};

const SCREEN_ORDER: Screen[] = [
  "dashboard",
  "diagnostico",
  "matriz",
  "produto",
  "simulacao",
  "plano",
  "monitor",
];

// ============================================================================
// Component
// ============================================================================

export function RetailIntelligenceMockup({ step }: RetailIntelligenceProps) {
  const screen = SCREEN_BY_STEP[Math.min(step, 6)] ?? "dashboard";

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      riScreen: screen,
      riScreenLabel: SCREEN_LABEL[screen],
    });
  }, [screen, patchLive]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#f4f6fb] font-ui text-neutral-800">
      <Header />
      <StepRail screen={screen} />

      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {screen === "dashboard" && <DashboardScreen key="dash" />}
          {screen === "diagnostico" && <DiagnosticoScreen key="diag" />}
          {screen === "matriz" && <MatrizScreen key="mat" />}
          {screen === "produto" && <ProdutoScreen key="prod" />}
          {screen === "simulacao" && <SimulacaoScreen key="sim" />}
          {screen === "plano" && <PlanoScreen key="plan" />}
          {screen === "monitor" && <MonitorScreen key="mon" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// Header + step rail
// ============================================================================

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-brand/10 bg-white px-6">
      <div className="flex items-center gap-4">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={96} height={18} />
        <span className="h-6 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(2,7,136,0)",
                "0 0 0 6px rgba(2,7,136,0.08)",
                "0 0 0 0 rgba(2,7,136,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white"
          >
            <BrainCircuit size={17} strokeWidth={2} />
          </motion.span>
          <div className="leading-tight">
            <p className="font-ui text-[16px] font-bold text-neutral-900">
              Retail Intelligence
            </p>
            <p className="font-ui text-[11px] text-neutral-500">
              Loja Berrini · Análise inteligente em tempo real
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          <Sparkles size={11} strokeWidth={2.5} />
          IA
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand-subtle px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
          <Rocket size={11} strokeWidth={2.5} />
          Tendência 2026
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-neutral-600">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
        >
          <Search size={14} strokeWidth={2.25} />
        </button>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
        >
          <Bell size={14} strokeWidth={2.25} />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-2.5 py-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand font-ui text-[10px] font-bold text-white">
            MS
          </span>
          <span className="leading-tight">
            <span className="block font-ui text-[12px] font-bold text-brand">
              Mateus Souza
            </span>
            <span className="block text-[9px] text-neutral-500">
              Gestor · Berrini
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}

function StepRail({ screen }: { screen: Screen }) {
  const idx = SCREEN_ORDER.indexOf(screen);
  return (
    <div className="flex items-center justify-between border-b border-brand/8 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        {SCREEN_ORDER.map((s, i) => {
          const active = i === idx;
          const done = i < idx;
          return (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1"
                style={{
                  background: active
                    ? "#020788"
                    : done
                      ? "rgba(22,163,74,0.10)"
                      : "white",
                  borderColor: active
                    ? "#020788"
                    : done
                      ? "rgba(22,163,74,0.3)"
                      : "rgba(2,7,136,0.12)",
                  color: active
                    ? "white"
                    : done
                      ? "#16a34a"
                      : "#6b7280",
                }}
              >
                <span className="font-ui text-[10px] font-bold tabular-nums">
                  {done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="font-ui text-[11px] font-bold uppercase tracking-wider">
                  {SCREEN_LABEL[s]}
                </span>
              </motion.div>
              {i < SCREEN_ORDER.length - 1 && (
                <span className="h-px w-5 bg-neutral-200" />
              )}
            </div>
          );
        })}
      </div>
      <p className="font-ui text-[11px] text-neutral-500">
        Caminho: detectar &rsaquo; explicar &rsaquo; recomendar &rsaquo; simular
        &rsaquo; agir
      </p>
    </div>
  );
}

// ============================================================================
// Screen 0 — Dashboard with CMV alert
// ============================================================================

function DashboardScreen() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="grid h-full grid-rows-[auto_auto_1fr] gap-4 px-6 py-5"
    >
      {/* Insight banner */}
      <div data-tour="ri-insight-banner">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-brand/15 bg-white px-5 py-4 shadow-card"
        >
          <ShimmerEdge />
          <div className="relative flex items-center gap-4">
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand text-white shadow-brand"
            >
              <Sparkles size={20} strokeWidth={2} />
            </motion.span>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[3px] text-brand">
                Insight detectado
              </p>
              <p className="mt-0.5 font-ui text-[18px] font-bold text-neutral-900">
                Seu CMV está acima do ideal e existem oportunidades no mix para
                recuperar margem.
              </p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              data-tour="ri-analisar-oportunidade"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-3 font-ui text-[14px] font-bold text-white shadow-brand transition-colors hover:bg-brand-light"
            >
              <BrainCircuit size={15} strokeWidth={2.25} />
              Analisar oportunidade
              <ArrowRight size={14} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-4 gap-3">
        <DashKPI
          label="Vendas hoje"
          value="R$ 24.580"
          trend="+12% vs. ontem"
          tone="ok"
          Icon={DollarSign}
          delay={0}
        />
        <DashKPI
          label="CMV real"
          value="31,74%"
          trend="+3,74pp vs. ideal"
          tone="danger"
          Icon={Activity}
          highlight
          delay={0.06}
        />
        <DashKPI
          label="Margem média"
          value="42,0%"
          trend="−3pp vs. meta"
          tone="warning"
          Icon={TrendingDown}
          delay={0.12}
        />
        <DashKPI
          label="Estoque"
          value="R$ 184k"
          trend="Sem criticidade"
          tone="ok"
          Icon={Package}
          delay={0.18}
        />
      </div>

      {/* Charts placeholder + alerts */}
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-brand">
              CMV últimos 14 dias
            </p>
            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger">
              Desvio crescente
            </span>
          </div>
          <CMVChart />
        </div>
        <div className="space-y-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-card">
            <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-brand">
              Top desvios
            </p>
            <ul className="mt-2 space-y-1.5 text-[12px]">
              {[
                { label: "X-Burguer", value: "+1,4pp" },
                { label: "Coca-Cola 2L", value: "+0,8pp" },
                { label: "Combo Madero", value: "+0,6pp" },
              ].map((d) => (
                <li
                  key={d.label}
                  className="flex items-center justify-between border-b border-neutral-100 pb-1.5 last:border-0"
                >
                  <span className="text-neutral-700">{d.label}</span>
                  <span className="font-ui font-bold text-danger tabular-nums">
                    {d.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-ghost p-3.5">
            <p className="flex items-center gap-1.5 font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
              <Sparkles size={11} strokeWidth={2.5} />
              IA observando
            </p>
            <p className="mt-1 text-[11px] leading-snug text-neutral-600">
              CMV, margem, mix e giro de 24 indicadores em tempo real.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function DashKPI({
  label,
  value,
  trend,
  tone,
  Icon,
  highlight,
  delay,
}: {
  label: string;
  value: string;
  trend: string;
  tone: "ok" | "warning" | "danger";
  Icon: typeof Activity;
  highlight?: boolean;
  delay: number;
}) {
  const c =
    tone === "danger"
      ? "#dc2626"
      : tone === "warning"
        ? "#d97706"
        : "#16a34a";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-4 shadow-card",
      )}
      style={{
        borderColor: highlight ? "rgba(220,38,38,0.4)" : "rgba(2,7,136,0.08)",
        boxShadow: highlight
          ? "0 0 0 4px rgba(220,38,38,0.08), 0 2px 12px rgba(0,0,0,0.06)"
          : undefined,
      }}
    >
      {highlight && (
        <motion.span
          aria-hidden
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-3 top-3 rounded-full bg-danger px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
        >
          Foco da IA
        </motion.span>
      )}
      <div className="flex items-center gap-2">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-md text-white"
          style={{ background: c }}
        >
          <Icon size={15} strokeWidth={2} />
        </span>
        <p className="font-ui text-[12px] font-medium text-neutral-500">
          {label}
        </p>
      </div>
      <p className="mt-3 font-ui text-[28px] font-bold text-neutral-900 tabular-nums">
        {value}
      </p>
      <p
        className="font-ui text-[12px] font-medium tabular-nums"
        style={{ color: c }}
      >
        {trend}
      </p>
    </motion.div>
  );
}

function CMVChart() {
  // 14 days, simulating CMV rising from 28 to 31.74
  const points = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < 14; i++) {
      const base = 28 + (i / 13) * 3.74;
      const wiggle = Math.sin(i * 1.7) * 0.4;
      arr.push(base + wiggle);
    }
    return arr;
  }, []);
  const max = 34;
  const min = 26;
  const W = 100;
  const H = 100;
  const x = (i: number) => (i / (points.length - 1)) * W;
  const y = (v: number) => H - ((v - min) / (max - min)) * H;

  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`)
    .join(" ");
  const area = `${path} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="relative" style={{ aspectRatio: "16/6" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="cmv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#020788" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#020788" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Ideal line at 28% */}
        <line
          x1="0"
          x2={W}
          y1={y(28)}
          y2={y(28)}
          stroke="#16a34a"
          strokeWidth="0.4"
          strokeDasharray="2 1.5"
        />
        <motion.path
          d={area}
          fill="url(#cmv-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#020788"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx={x(points.length - 1)}
          cy={y(points[points.length - 1])}
          r="1.6"
          fill="#dc2626"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1] }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />
      </svg>
      <p className="absolute right-2 top-1 text-[10px] font-bold text-success">
        Ideal 28%
      </p>
      <p className="absolute right-2 bottom-1 text-[10px] font-bold text-danger">
        Hoje 31,74%
      </p>
    </div>
  );
}

function ShimmerEdge() {
  return (
    <motion.span
      aria-hidden
      initial={{ x: "-120%" }}
      animate={{ x: "120%" }}
      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-y-0 w-1/3"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(2,7,136,0.06), transparent)",
      }}
    />
  );
}

// ============================================================================
// Screen 1 — Diagnóstico
// ============================================================================

const PRIORITIES = [
  {
    id: "p1",
    severity: "Alto",
    tone: "danger" as const,
    title: "CMV acima do ideal",
    summary: "Margem comprimida em produtos de alto volume",
    impact: "Impacto: −R$ 4.200/mês",
    action: "Revisar produtos que pressionam margem",
  },
  {
    id: "p2",
    severity: "Oportunidade",
    tone: "primary" as const,
    title: "Produto com boa margem e baixo giro",
    summary:
      "Filé Parmegiana 150g tem margem alta e vende abaixo do potencial",
    impact: "Impacto: +R$ 2.800/mês potencial",
    action: "Destacar no cardápio digital",
  },
  {
    id: "p3",
    severity: "Baixo",
    tone: "ok" as const,
    title: "Estoque sem criticidade imediata",
    summary: "Giro dentro da faixa esperada para o período",
    impact: "Monitorar nas próximas semanas",
    action: "Apenas monitorar",
  },
] as const;

function DiagnosticoScreen() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid h-full grid-rows-[auto_1fr] gap-5 px-8 py-6"
    >
      <div className="flex items-start gap-4">
        <motion.span
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(2,7,136,0.4)",
              "0 0 0 18px rgba(2,7,136,0)",
              "0 0 0 0 rgba(2,7,136,0.4)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
        >
          <BrainCircuit size={26} strokeWidth={1.75} />
        </motion.span>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
            Diagnóstico da unidade
          </p>
          <p className="mt-1 font-ui text-[22px] font-bold leading-snug text-neutral-900">
            CMV 3,74 pontos acima do ideal. Há produtos de alta margem com giro
            abaixo do potencial.
          </p>
          <p className="mt-1.5 text-[13px] text-neutral-600">
            Prioridade: trabalhar mix antes de aumentar preços. A IA organizou
            por impacto.
          </p>
        </div>
      </div>

      <div data-tour="ri-priority-list" className="grid grid-cols-3 gap-4">
        {PRIORITIES.map((p, i) => (
          <PriorityCard
            key={p.id}
            priority={p}
            highlight={p.id === "p2"}
            delay={i * 0.1}
          />
        ))}
      </div>
    </motion.section>
  );
}

function PriorityCard({
  priority,
  highlight,
  delay,
}: {
  priority: (typeof PRIORITIES)[number];
  highlight: boolean;
  delay: number;
}) {
  const tone =
    priority.tone === "danger"
      ? { c: "#dc2626", bg: "rgba(220,38,38,0.10)", Icon: ShieldAlert }
      : priority.tone === "primary"
        ? { c: "#020788", bg: "rgba(2,7,136,0.08)", Icon: Sparkles }
        : { c: "#16a34a", bg: "rgba(22,163,74,0.10)", Icon: CheckCircle2 };
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      data-tour={priority.id === "p2" ? "ri-priority-opportunity" : undefined}
      className="relative flex flex-col gap-3 rounded-2xl bg-white p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"
      style={{
        border: highlight
          ? `2px solid ${tone.c}`
          : "1px solid rgba(2,7,136,0.08)",
        boxShadow: highlight
          ? `0 0 0 4px ${tone.bg}, 0 6px 24px rgba(2,7,136,0.10)`
          : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: tone.bg, color: tone.c }}
        >
          <tone.Icon size={11} strokeWidth={2.5} />
          {priority.severity}
        </span>
        {highlight && (
          <motion.span
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
          >
            <Sparkles size={9} strokeWidth={2.5} />
            Em foco
          </motion.span>
        )}
      </div>

      <p className="font-ui text-[17px] font-bold leading-tight text-neutral-900">
        {priority.title}
      </p>
      <p className="text-[12px] leading-snug text-neutral-600">
        {priority.summary}
      </p>

      <div className="mt-auto border-t border-neutral-100 pt-2">
        <p
          className="font-ui text-[12px] font-bold tabular-nums"
          style={{ color: tone.c }}
        >
          {priority.impact}
        </p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-neutral-700">
          <ChevronRight size={12} strokeWidth={2.5} className="text-neutral-400" />
          {priority.action}
        </p>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Screen 2 — Matriz de engenharia
// ============================================================================

type MatrixGroup = "estrela" | "burro" | "puzzle" | "cachorro";

interface MatrixDish {
  id: string;
  name: string;
  x: number;
  y: number;
  group: MatrixGroup;
  focus?: boolean;
}

const MATRIX_DISHES: MatrixDish[] = [
  { id: "frango", name: "Frango Grelhado", x: 72, y: 64, group: "estrela" },
  { id: "pepperoni", name: "Pizza Pepperoni", x: 82, y: 28, group: "burro" },
  { id: "xburguer", name: "X-Burguer", x: 88, y: 36, group: "burro" },
  { id: "lasanha", name: "Lasanha Integral", x: 35, y: 70, group: "puzzle" },
  { id: "parmegiana", name: "Filé Parmegiana 150g", x: 42, y: 66, group: "puzzle", focus: true },
  { id: "tilapia", name: "Filé de Tilápia", x: 28, y: 58, group: "puzzle" },
  { id: "salada", name: "Salada de Grão", x: 22, y: 30, group: "cachorro" },
  { id: "pudim", name: "Pudim de Leite", x: 18, y: 24, group: "cachorro" },
];

const QUADRANT_META = {
  estrela: { label: "Estrela", color: "#16a34a", tag: "Manter destaque" },
  burro: { label: "Burro de carga", color: "#d97706", tag: "Revisar preço" },
  puzzle: { label: "Quebra-cabeça", color: "#020788", tag: "Promover" },
  cachorro: { label: "Cachorro", color: "#6b7280", tag: "Reavaliar" },
} as const;

function MatrizScreen() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid h-full grid-cols-[1fr_300px] gap-5 px-8 py-6"
    >
      <div className="rounded-2xl border border-brand/8 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
              Engenharia de cardápio
            </p>
            <p className="mt-0.5 font-ui text-[20px] font-bold text-neutral-900">
              Popularidade × Margem
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-ghost px-3 py-1 text-[11px] font-bold text-brand">
            <Sparkles size={11} strokeWidth={2.5} />
            Oportunidade encontrada
          </span>
        </div>

        <div className="relative" style={{ aspectRatio: "16/9" }}>
          {/* Quadrant background */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl">
            <div className="border-b border-r border-brand/10 bg-brand-ghost/30" />
            <div className="border-b border-brand/10 bg-success/5" />
            <div className="border-r border-brand/10 bg-neutral-50/60" />
            <div className="bg-warning/5" />
          </div>

          {/* Cross lines */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-brand/15" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-brand/15" />

          {/* Quadrant labels */}
          <span className="absolute left-4 top-3 font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
            Quebra-cabeça
          </span>
          <span className="absolute right-4 top-3 font-ui text-[11px] font-bold uppercase tracking-wider text-success">
            Estrela
          </span>
          <span className="absolute left-4 bottom-3 font-ui text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Cachorro
          </span>
          <span className="absolute right-4 bottom-3 font-ui text-[11px] font-bold uppercase tracking-wider text-warning">
            Burro de carga
          </span>

          {/* Axes */}
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-neutral-500">
            Popularidade →
          </span>
          <span
            className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-bold text-neutral-500"
            style={{ transformOrigin: "center" }}
          >
            Margem →
          </span>

          {/* Dishes */}
          {MATRIX_DISHES.map((d, i) => {
            const focus = d.focus;
            const meta = QUADRANT_META[d.group];
            return (
              <motion.button
                key={d.id}
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15 + i * 0.07,
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                data-tour={focus ? "ri-matrix-focus" : undefined}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${d.x}%`,
                  top: `${100 - d.y}%`,
                  background: meta.color,
                  width: focus ? 22 : 14,
                  height: focus ? 22 : 14,
                  boxShadow: focus
                    ? `0 0 0 4px ${meta.color}25, 0 0 24px ${meta.color}55`
                    : `0 0 10px ${meta.color}40`,
                }}
                aria-label={d.name}
              >
                {focus && (
                  <>
                    <motion.span
                      animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <motion.span
                      animate={{ scale: [1, 2.6, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.4,
                      }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                  </>
                )}
                <span
                  className={cn(
                    "absolute whitespace-nowrap rounded-md px-2 py-0.5 font-ui text-[11px] font-medium",
                    focus
                      ? "font-bold text-brand"
                      : "text-neutral-600",
                  )}
                  style={{
                    left: focus ? 30 : 22,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: focus ? "white" : "rgba(255,255,255,0.85)",
                    boxShadow: focus
                      ? "0 4px 12px rgba(2,7,136,0.18)"
                      : undefined,
                    border: focus ? "2px solid #020788" : "1px solid #e5e7eb",
                  }}
                >
                  {d.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <aside className="flex flex-col gap-3">
        {Object.entries(QUADRANT_META).map(([id, meta]) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-brand/8 bg-white p-3 shadow-card"
          >
            <div className="flex items-center gap-2">
              <span
                className="block h-3 w-3 rounded-full"
                style={{
                  background: meta.color,
                  boxShadow: `0 0 10px ${meta.color}55`,
                }}
              />
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                {meta.label}
              </p>
            </div>
            <p
              className="mt-1.5 text-[12px] font-medium"
              style={{ color: meta.color }}
            >
              {meta.tag}
            </p>
          </motion.div>
        ))}
      </aside>
    </motion.section>
  );
}

// ============================================================================
// Screen 3 — Detalhe do produto
// ============================================================================

const RECOMMENDATIONS_5 = [
  { Icon: Eye, text: "Destacar no cardápio digital" },
  { Icon: ImageIcon, text: "Melhorar foto e descrição comercial" },
  { Icon: PlusCircle, text: "Incluir em combo com bebida ou acompanhamento" },
  { Icon: Megaphone, text: "Orientar equipe a sugerir o item no atendimento" },
  { Icon: BarChart3, text: "Acompanhar conversão nos próximos 7 dias" },
];

function ProdutoScreen() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid h-full grid-cols-[400px_1fr] gap-5 px-8 py-6"
    >
      {/* Product card */}
      <div className="overflow-hidden rounded-2xl border border-brand/8 bg-white shadow-card">
        <div
          className="relative flex h-48 items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #fed7aa 0%, #f59e0b 50%, #92400e 100%)",
          }}
        >
          <Utensils size={64} strokeWidth={1.25} className="text-white/40" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand backdrop-blur">
            <Sparkles size={11} strokeWidth={2.5} />
            Quebra-cabeça
          </span>
        </div>
        <div className="px-5 py-4">
          <p className="font-ui text-[22px] font-bold leading-tight text-neutral-900">
            Filé Parmegiana 150g
          </p>
          <p className="mt-1 text-[12px] text-neutral-500">
            Categoria: Pratos principais · SKU 8412
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <ProdStat label="Margem de contribuição" value="66%" tone="#16a34a" />
            <ProdStat label="Popularidade" value="Médio giro" tone="#020788" />
            <ProdStat
              label="Preço de venda"
              value="R$ 49,90"
              tone="#020788"
            />
            <ProdStat label="Receitas/mês" value="180 un." tone="#020788" />
          </div>

          <div className="mt-4 rounded-xl border border-brand/15 bg-brand-ghost p-3">
            <p className="flex items-center gap-1.5 font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
              <Sparkles size={11} strokeWidth={2.5} />
              Leitura da IA
            </p>
            <p className="mt-1 text-[12px] leading-snug text-neutral-700">
              Produto com boa rentabilidade, mas abaixo do potencial de venda.
              Pode ser trabalhado como prato de destaque para aumentar margem
              do mix.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-4 rounded-2xl border border-brand/8 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
              5 ações recomendadas
            </p>
            <p className="mt-0.5 font-ui text-[18px] font-bold text-neutral-900">
              Como destravar o potencial deste prato
            </p>
          </div>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
            data-tour="ri-simular-impacto"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 font-ui text-[13px] font-bold text-white shadow-brand hover:bg-brand-light"
          >
            <Layers size={14} strokeWidth={2.25} />
            Simular impacto
            <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </div>

        <div data-tour="ri-rec-list" className="space-y-2.5">
          {RECOMMENDATIONS_5.map((r, i) => (
            <motion.div
              key={r.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-brand/8 bg-brand-ghost/40 p-3"
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-brand text-white">
                <r.Icon size={15} strokeWidth={2} />
              </span>
              <p className="flex-1 font-ui text-[13px] font-medium text-neutral-800">
                {r.text}
              </p>
              <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[10px] font-bold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ProdStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-3">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p
        className="font-ui text-[16px] font-bold tabular-nums"
        style={{ color: tone }}
      >
        {value}
      </p>
    </div>
  );
}

// ============================================================================
// Screen 4 — Simulação
// ============================================================================

function SimulacaoScreen() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 350);
    return () => clearTimeout(t);
  }, []);

  const currentVendas = 100;
  const currentContrib = 100 * 49.9 * 0.66;
  const newVendas = 112;
  const newContrib = 112 * 49.9 * 0.66;
  const delta = newContrib - currentContrib;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid h-full grid-rows-[auto_1fr_auto] gap-5 px-8 py-6"
    >
      <div className="flex items-start gap-4">
        <motion.span
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(2,7,136,0.4)",
              "0 0 0 22px rgba(2,7,136,0)",
              "0 0 0 0 rgba(2,7,136,0.4)",
            ],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
        >
          <Layers size={26} strokeWidth={1.75} />
        </motion.span>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
            Simulação de impacto
          </p>
          <p className="mt-1 font-ui text-[22px] font-bold leading-snug text-neutral-900">
            Se o Filé Parmegiana crescer 12% em vendas mantendo a margem
            atual...
          </p>
          <p className="mt-1 text-[13px] text-neutral-600">
            A IA calcula o impacto na contribuição do mix antes de você aplicar
            a recomendação.
          </p>
        </div>
      </div>

      <div data-tour="ri-sim-compare" className="grid grid-cols-[1fr_auto_1fr] gap-5 items-center">
        <ScenarioCard
          title="Cenário atual"
          vendas={currentVendas}
          margem={66}
          contrib={currentContrib}
          tone="neutral"
        />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.4 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-brand"
        >
          <ArrowRight size={24} strokeWidth={2.25} />
        </motion.div>

        <ScenarioCard
          title="Cenário recomendado"
          vendas={stage >= 1 ? newVendas : currentVendas}
          margem={66}
          contrib={stage >= 1 ? newContrib : currentContrib}
          tone="success"
          highlight
        />
      </div>

      <div data-tour="ri-sim-apply" className="flex items-center justify-between rounded-2xl border border-success/20 bg-success/5 px-5 py-4">
        <div>
          <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-success">
            Impacto estimado
          </p>
          <p className="mt-0.5 font-ui text-[24px] font-bold text-success tabular-nums">
            +R${" "}
            {delta.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            em contribuição/mês
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          data-tour="ri-aplicar-recomendacao"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-3 font-ui text-[14px] font-bold text-white shadow-brand hover:bg-brand-light"
        >
          <CheckCircle2 size={15} strokeWidth={2.25} />
          Aplicar recomendação
          <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.section>
  );
}

function ScenarioCard({
  title,
  vendas,
  margem,
  contrib,
  tone,
  highlight,
}: {
  title: string;
  vendas: number;
  margem: number;
  contrib: number;
  tone: "neutral" | "success";
  highlight?: boolean;
}) {
  const c = tone === "success" ? "#16a34a" : "#020788";
  return (
    <motion.div
      initial={{ opacity: 0, x: highlight ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border bg-white p-5 shadow-card"
      style={{
        borderColor: highlight ? c : "rgba(2,7,136,0.08)",
        boxShadow: highlight
          ? `0 0 0 4px ${c}15, 0 8px 28px rgba(2,7,136,0.12)`
          : undefined,
      }}
    >
      <p
        className="font-ui text-[11px] font-bold uppercase tracking-[3px]"
        style={{ color: c }}
      >
        {title}
      </p>

      <div className="mt-3 space-y-2.5">
        <ScenarioRow label="Vendas" value={`${vendas} un.`} tone={c} animate={highlight} />
        <ScenarioRow label="Margem" value={`${margem}%`} tone={c} />
        <div className="border-t border-neutral-100 pt-2">
          <p className="text-[11px] text-neutral-500">Contribuição estimada</p>
          <motion.p
            key={contrib}
            initial={highlight ? { scale: 0.9, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-0.5 font-ui text-[28px] font-bold tabular-nums"
            style={{ color: c }}
          >
            R${" "}
            {contrib.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

function ScenarioRow({
  label,
  value,
  tone,
  animate,
}: {
  label: string;
  value: string;
  tone: string;
  animate?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-neutral-600">{label}</span>
      <motion.span
        key={value}
        initial={animate ? { scale: 0.9, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="font-ui text-[15px] font-bold tabular-nums"
        style={{ color: tone }}
      >
        {value}
      </motion.span>
    </div>
  );
}

// ============================================================================
// Screen 5 — Plano de ação
// ============================================================================

const PLANO = [
  "Destacar o Filé Parmegiana no cardápio digital por 7 dias",
  "Atualizar foto e descrição comercial do item",
  "Criar sugestão de combo com bebida",
  "Monitorar vendas, margem e giro diariamente",
  "Reavaliar classificação do produto após o período",
];

function PlanoScreen() {
  const [checks, setChecks] = useState<boolean[]>(PLANO.map(() => false));
  useEffect(() => {
    PLANO.forEach((_, i) => {
      setTimeout(() => {
        setChecks((p) => {
          const n = [...p];
          n[i] = true;
          return n;
        });
      }, 280 + i * 280);
    });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid h-full grid-rows-[auto_1fr] gap-5 px-8 py-6"
    >
      <div className="flex items-center gap-4">
        <motion.span
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
        >
          <Calendar size={26} strokeWidth={1.75} />
        </motion.span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
            Plano de ação · gerado pela IA
          </p>
          <p className="mt-1 font-ui text-[22px] font-bold text-neutral-900">
            Sequência de execução nos próximos 7 dias
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-brand/8 bg-white p-6 shadow-card">
        <div data-tour="ri-plano-list" className="space-y-3">
          {PLANO.map((p, i) => {
            const ok = checks[i];
            return (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border bg-white p-3.5"
                style={{
                  borderColor: ok ? "#16a34a40" : "#e5e7eb",
                  background: ok ? "rgba(22,163,74,0.05)" : "white",
                }}
              >
                <motion.span
                  key={ok ? "ok" : "num"}
                  initial={ok ? { scale: 0.6, rotate: -20 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14 }}
                  className={cn(
                    "flex h-10 w-10 flex-none items-center justify-center rounded-full text-white",
                  )}
                  style={{ background: ok ? "#16a34a" : "#cbd5e1" }}
                >
                  {ok ? (
                    <Check size={18} strokeWidth={2.5} />
                  ) : (
                    <span className="font-ui text-[14px] font-bold">
                      {i + 1}
                    </span>
                  )}
                </motion.span>
                <p
                  className={cn(
                    "flex-1 font-ui text-[15px] font-medium",
                    ok ? "text-neutral-900" : "text-neutral-600",
                  )}
                >
                  {p}
                </p>
                {ok && (
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success"
                  >
                    Confirmado
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
          <p className="text-[12px] text-neutral-500">
            Plano gerado automaticamente. Você pode editar antes de confirmar.
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -2 }}
            data-tour="ri-acompanhar"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand px-5 py-3 font-ui text-[14px] font-bold text-white shadow-brand hover:bg-brand-light"
          >
            Acompanhar resultado
            <ArrowRight size={14} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}

// ============================================================================
// Screen 6 — Monitoramento
// ============================================================================

const MONITOR_INDICATORS = [
  { label: "Vendas", value: "+12%", tone: "success" as const, Icon: TrendingUp },
  { label: "Margem", value: "66%", tone: "primary" as const, Icon: ArrowUpRight },
  { label: "Popularidade", value: "Subindo", tone: "success" as const, Icon: Crown },
  { label: "Contribuição no mix", value: "+R$ 395", tone: "primary" as const, Icon: Target },
];

function MonitorScreen() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col items-center justify-center gap-5 px-8 py-6"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-success text-white shadow-brand"
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-success"
        />
        <CheckCircle2 size={42} strokeWidth={2.25} />
      </motion.span>

      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[3px] text-brand">
          Decisão registrada
        </p>
        <p className="mt-1 font-ui text-[26px] font-bold text-neutral-900">
          Ação em monitoramento
        </p>
        <p className="mt-1.5 text-[13px] text-neutral-600">
          Próximos 7 dias · Filé Parmegiana 150g
        </p>
      </div>

      <div
        data-tour="ri-monitor-grid"
        className="grid w-full max-w-[640px] grid-cols-2 gap-3"
      >
        {MONITOR_INDICATORS.map((m, i) => {
          const c = m.tone === "success" ? "#16a34a" : "#020788";
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl border border-brand/8 bg-white p-4 shadow-card"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-md text-white"
                style={{ background: c }}
              >
                <m.Icon size={17} strokeWidth={2} />
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {m.label}
                </p>
                <p
                  className="font-ui text-[18px] font-bold tabular-nums"
                  style={{ color: c }}
                >
                  {m.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="max-w-[520px] text-center font-ui text-[14px] italic text-neutral-600">
        “Retail Intelligence ajuda o gestor a sair do dado bruto e chegar na
        melhor decisão operacional.”
      </p>
    </motion.section>
  );
}
