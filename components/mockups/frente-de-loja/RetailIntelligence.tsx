"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  BrainCircuit,
  Sparkles,
  Rocket,
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  PieChart,
  Layers,
  Bot,
  Zap,
  Flame,
  ShieldAlert,
  Crown,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Send,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface RetailIntelligenceProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

interface KPI {
  id: string;
  label: string;
  value: string;
  num: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "flat";
  trendValue: string;
  status: "danger" | "warning" | "ok";
  Icon: typeof Activity;
}

const KPIS: KPI[] = [
  { id: "cmv", label: "CMV real", value: "31,74%", num: 31.74, target: 28, unit: "%", trend: "up", trendValue: "+3,74pp vs. ideal", status: "danger", Icon: Activity },
  { id: "margem", label: "Margem média", value: "42,0%", num: 42, target: 45, unit: "%", trend: "down", trendValue: "−3pp vs. meta", status: "warning", Icon: TrendingDown },
  { id: "giro", label: "Giro estoque", value: "4,2×", num: 4.2, target: 5, unit: "×", trend: "down", trendValue: "−0,8 vs. meta", status: "warning", Icon: Package },
  { id: "ticket", label: "Ticket médio", value: "R$ 47,20", num: 47.2, target: 45, unit: "R$", trend: "up", trendValue: "+3,2% vs. mês passado", status: "ok", Icon: ArrowUpRight },
  { id: "vendas", label: "Vendas hoje", value: "R$ 24.580", num: 24580, target: 22000, unit: "R$", trend: "up", trendValue: "+12% vs. ontem", status: "ok", Icon: DollarSign },
  { id: "contas", label: "Contas vencidas", value: "R$ 8.240", num: 8240, target: 0, unit: "R$", trend: "up", trendValue: "3 fornecedores", status: "danger", Icon: ShieldAlert },
];

type Priority = "urgente" | "oportunidade" | "atencao" | "estrategico";

interface Recommendation {
  id: string;
  priority: Priority;
  title: string;
  indicator: string;
  problem: string;
  impact: string;
  cause: string;
  action: string;
  Icon: typeof Activity;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    priority: "urgente",
    title: "CMV 3,74pp acima do ideal",
    indicator: "CMV",
    problem: "Margem comprimida em produtos de alto volume",
    impact: "−R$ 4.200/mês na unidade",
    cause: "Ficha técnica do X-Burguer + preço de venda apertado",
    action: "Revisar ficha técnica e estudar reajuste de 4%",
    Icon: Activity,
  },
  {
    id: "r2",
    priority: "urgente",
    title: "Estoque parado de Bacon Especial",
    indicator: "Estoque",
    problem: "280 kg parados há 18 dias, giro abaixo da média",
    impact: "R$ 3.100 em risco de perda",
    cause: "Compra acima do consumo + queda de demanda",
    action: "Combo de venda rápida ou reduzir compras nos próximos ciclos",
    Icon: Package,
  },
  {
    id: "r3",
    priority: "oportunidade",
    title: "Pratos executivos no horário de pico",
    indicator: "Mix",
    problem: "Itens de maior margem não estão entre os mais vendidos",
    impact: "+R$ 2.800/mês potencial",
    cause: "Posição no cardápio digital + falta de destaque",
    action: "Destacar pratos de maior margem entre 11h30 e 13h20",
    Icon: TrendingUp,
  },
  {
    id: "r4",
    priority: "oportunidade",
    title: "Item Y suporta reajuste de 4%",
    indicator: "Precificação",
    problem: "Margem abaixo da mediana com boa elasticidade",
    impact: "+R$ 1.640/mês sem perda de volume",
    cause: "Concorrência local cobra +8% pelo mesmo prato",
    action: "Aplicar reajuste e monitorar volume nas 2 primeiras semanas",
    Icon: ArrowUpRight,
  },
  {
    id: "r5",
    priority: "atencao",
    title: "5 itens estrela exigem proteção",
    indicator: "Engenharia",
    problem: "Alta popularidade + alta margem, sensíveis a desconto",
    impact: "Risco de erosão de margem",
    cause: "Pressão por promoção sazonal",
    action: "Manter destaque, não aplicar desconto agressivo",
    Icon: Crown,
  },
  {
    id: "r6",
    priority: "estrategico",
    title: "Savassi performando melhor em CMV",
    indicator: "Rede",
    problem: "Unidade com 28,3% vs. 31,74% desta loja",
    impact: "Benchmark interno disponível",
    cause: "Política de compras + ficha técnica revisada",
    action: "Replicar prática da unidade Savassi nesta loja",
    Icon: Target,
  },
];

const PRIORITY_META: Record<
  Priority,
  { label: string; bg: string; bgSolid: string; color: string; ring: string; Icon: typeof Activity }
> = {
  urgente: {
    label: "Urgente",
    bg: "rgba(220,38,38,0.12)",
    bgSolid: "#dc2626",
    color: "#dc2626",
    ring: "rgba(220,38,38,0.4)",
    Icon: AlertTriangle,
  },
  oportunidade: {
    label: "Oportunidade",
    bg: "rgba(22,163,74,0.12)",
    bgSolid: "#16a34a",
    color: "#16a34a",
    ring: "rgba(22,163,74,0.4)",
    Icon: Sparkles,
  },
  atencao: {
    label: "Atenção",
    bg: "rgba(217,119,6,0.14)",
    bgSolid: "#d97706",
    color: "#d97706",
    ring: "rgba(217,119,6,0.4)",
    Icon: ShieldAlert,
  },
  estrategico: {
    label: "Estratégico",
    bg: "rgba(59,66,196,0.15)",
    bgSolid: "#3b42c4",
    color: "#3b42c4",
    ring: "rgba(59,66,196,0.4)",
    Icon: Target,
  },
};

interface MenuDish {
  id: string;
  name: string;
  popularity: number; // 0..100
  margin: number; // 0..100
  Icon: typeof Crown;
}

const MENU_DISHES: MenuDish[] = [
  { id: "xburguer", name: "X-Burguer Artesanal", popularity: 88, margin: 36, Icon: Crown },
  { id: "frango", name: "Frango Grelhado", popularity: 72, margin: 64, Icon: Crown },
  { id: "lasanha", name: "Lasanha Integral", popularity: 35, margin: 70, Icon: Crown },
  { id: "filetilapia", name: "Filé de Tilápia", popularity: 28, margin: 58, Icon: Crown },
  { id: "pizza-pepperoni", name: "Pizza Pepperoni", popularity: 82, margin: 28, Icon: Crown },
  { id: "salada-grao", name: "Salada de Grão de Bico", popularity: 22, margin: 30, Icon: Crown },
  { id: "petit", name: "Petit Gateau", popularity: 60, margin: 72, Icon: Crown },
  { id: "pudim", name: "Pudim de Leite", popularity: 18, margin: 24, Icon: Crown },
];

interface ChatExchange {
  question: string;
  answer: {
    headline: string;
    insights: { label: string; value: string; tone?: "good" | "bad" | "neutral" }[];
    action: string;
  };
}

const CHAT_LIBRARY: ChatExchange[] = [
  {
    question: "Por que meu CMV subiu?",
    answer: {
      headline:
        "CMV passou de 28% (ideal) para 31,74% (real). Pressão concentrada em 3 produtos.",
      insights: [
        { label: "X-Burguer", value: "+1,4pp", tone: "bad" },
        { label: "Coca-Cola 2L", value: "+0,8pp", tone: "bad" },
        { label: "Combo Madero", value: "+0,6pp", tone: "bad" },
        { label: "Custo médio insumos", value: "+5,2%", tone: "bad" },
      ],
      action:
        "Revisar ficha técnica do X-Burguer e renegociar contrato de bebidas antes de promoções.",
    },
  },
  {
    question: "Quais produtos devo destacar?",
    answer: {
      headline:
        "Foco nos 5 itens estrela: alta popularidade + alta margem. Eles sustentam a margem da unidade.",
      insights: [
        { label: "Frango Grelhado", value: "64% margem", tone: "good" },
        { label: "Petit Gateau", value: "72% margem", tone: "good" },
        { label: "Combo Família", value: "58% margem", tone: "good" },
        { label: "Salmão Grelhado", value: "61% margem", tone: "good" },
      ],
      action:
        "Destacar esses itens no cardápio digital entre 11h30 e 13h20 (horário de pico).",
    },
  },
  {
    question: "Onde estão minhas perdas?",
    answer: {
      headline:
        "Duas perdas relevantes na semana, ambas em estoque com baixo giro.",
      insights: [
        { label: "Bacon Especial parado", value: "R$ 3.100", tone: "bad" },
        { label: "Queijos importados", value: "R$ 1.460", tone: "bad" },
        { label: "Vencimento próximo (7d)", value: "12 itens", tone: "bad" },
      ],
      action:
        "Criar campanha rápida de combos com bacon e queijo + reduzir compras nos próximos 2 ciclos.",
    },
  },
  {
    question: "Como estou vs. a rede?",
    answer: {
      headline:
        "Mediana da rede em 30,2% de CMV. Unidade Savassi opera em 28,3%, sua unidade em 31,74%.",
      insights: [
        { label: "CMV unidade", value: "31,74%", tone: "bad" },
        { label: "Mediana rede", value: "30,20%", tone: "neutral" },
        { label: "Melhor (Savassi)", value: "28,30%", tone: "good" },
        { label: "Diferença", value: "+1,54pp", tone: "bad" },
      ],
      action:
        "Replicar política de compras da Savassi e revisar ficha técnica dos 3 produtos críticos.",
    },
  },
];

// ============================================================================
// Component
// ============================================================================

type Tab = "diagnostico" | "recomendacoes" | "engenharia" | "copiloto";

export function RetailIntelligenceMockup({ step }: RetailIntelligenceProps) {
  const [tab, setTab] = useState<Tab>("diagnostico");
  const [openRec, setOpenRec] = useState<Recommendation | null>(null);
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  // Close the recommendation modal when the tour advances past the
  // simulation step (3). Otherwise the tab bar gets covered and the
  // user can't click on the next tour target (Engenharia tab).
  useEffect(() => {
    if (step >= 4 && openRec) {
      setOpenRec(null);
    }
  }, [step, openRec]);

  const counts = useMemo(
    () => ({
      urgente: RECOMMENDATIONS.filter((r) => r.priority === "urgente" && !resolved.has(r.id)).length,
      oportunidade: RECOMMENDATIONS.filter((r) => r.priority === "oportunidade" && !resolved.has(r.id)).length,
      atencao: RECOMMENDATIONS.filter((r) => r.priority === "atencao" && !resolved.has(r.id)).length,
      estrategico: RECOMMENDATIONS.filter((r) => r.priority === "estrategico" && !resolved.has(r.id)).length,
    }),
    [resolved],
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      riTab: tab,
      riOpenRec: openRec?.title ?? null,
      riResolvedCount: resolved.size,
      riUrgenteCount: counts.urgente,
      riOportunidadeCount: counts.oportunidade,
    });
  }, [tab, openRec, resolved.size, counts.urgente, counts.oportunidade, patchLive]);

  const markResolved = (id: string) => {
    setResolved((p) => new Set(p).add(id));
    setOpenRec(null);
  };

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden font-ui"
      style={{
        background:
          "radial-gradient(circle at 80% 0%, #1a1d4a 0%, #0a0c20 55%, #050610 100%)",
        color: "white",
      }}
    >
      <StarField />
      <NeuralGrid />

      <Header />
      <TabBar tab={tab} onPick={setTab} counts={counts} />

      <main className="relative z-10 flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence mode="wait">
          {tab === "diagnostico" && (
            <DiagnosticoView key="d" onOpenRec={setOpenRec} resolved={resolved} />
          )}
          {tab === "recomendacoes" && (
            <RecomendacoesView
              key="r"
              onOpenRec={setOpenRec}
              resolved={resolved}
            />
          )}
          {tab === "engenharia" && <EngenhariaView key="e" />}
          {tab === "copiloto" && <CopilotoView key="c" />}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {openRec && (
          <RecommendationDetail
            rec={openRec}
            onClose={() => setOpenRec(null)}
            onResolve={() => markResolved(openRec.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Background layers
// ============================================================================

function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const a = (seed / 233280) * 100;
        const b = ((seed * 1664525 + 1013904223) % 233280 / 233280) * 100;
        const c = ((seed * 22695477 + 1) % 233280 / 233280);
        return {
          left: a,
          top: b,
          size: 0.8 + c * 1.4,
          delay: c * 4,
          duration: 2.5 + c * 3,
        };
      }),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function NeuralGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(164,177,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(164,177,255,0.5) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 70%)",
      }}
    />
  );
}

// ============================================================================
// Header + tabs
// ============================================================================

function Header() {
  return (
    <header className="relative z-10 flex h-16 items-center justify-between border-b border-white/10 bg-black/20 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <Image src="/logo-teknisa-white.svg" alt="Teknisa" width={94} height={17} />
        <span className="h-6 w-px bg-white/15" />
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #6b21a8 60%, #d946ef 100%)",
              boxShadow:
                "0 0 24px rgba(164,177,255,0.6), 0 0 48px rgba(217,70,239,0.25)",
            }}
          >
            <BrainCircuit size={17} strokeWidth={2} />
          </motion.span>
          <div className="leading-tight">
            <p className="font-ui text-[16px] font-bold text-white">
              Retail Intelligence
            </p>
            <p className="font-ui text-[11px] text-white/60">
              Análise inteligente em tempo real
            </p>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #3b42c4 60%, #a4b1ff 100%)",
          }}
        >
          <Sparkles size={11} strokeWidth={2.5} />
          IA
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{
            background:
              "linear-gradient(135deg, #6b21a8 0%, #d946ef 60%, #f0abfc 100%)",
          }}
        >
          <Rocket size={11} strokeWidth={2.5} />
          Tendência 2026
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-white/70">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">
          <motion.span
            className="block h-2 w-2 rounded-full bg-success"
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-ui text-[11px] font-medium text-white/85">
            Analisando 24 indicadores em tempo real
          </span>
        </span>
        <span className="flex h-9 items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 backdrop-blur">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
            MS
          </span>
          <span className="leading-tight">
            <span className="block font-ui text-[12px] font-bold text-white">
              Mateus Souza
            </span>
            <span className="block text-[9px] text-white/60">
              Gestor · Loja Berrini
            </span>
          </span>
        </span>
      </div>
    </header>
  );
}

function TabBar({
  tab,
  onPick,
  counts,
}: {
  tab: Tab;
  onPick: (t: Tab) => void;
  counts: { urgente: number; oportunidade: number; atencao: number; estrategico: number };
}) {
  const total = counts.urgente + counts.oportunidade + counts.atencao + counts.estrategico;
  const items: { id: Tab; label: string; Icon: typeof Activity; badge?: number }[] = [
    { id: "diagnostico", label: "Diagnóstico", Icon: Activity },
    { id: "recomendacoes", label: "Recomendações", Icon: Zap, badge: total },
    { id: "engenharia", label: "Engenharia de cardápio", Icon: PieChart },
    { id: "copiloto", label: "Copiloto", Icon: Bot },
  ];
  return (
    <div
      data-tour="ri-tabs"
      className="relative z-10 flex items-center gap-1 border-b border-white/10 bg-black/15 px-6 backdrop-blur"
    >
      {items.map((it) => {
        const active = it.id === tab;
        return (
          <motion.button
            key={it.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            data-tour={
              it.id === "recomendacoes"
                ? "ri-tab-recs"
                : it.id === "engenharia"
                  ? "ri-tab-eng"
                  : it.id === "copiloto"
                    ? "ri-tab-copilot"
                    : undefined
            }
            onClick={() => onPick(it.id)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-3 font-ui text-[12px] font-bold transition-colors",
              active ? "text-white" : "text-white/45 hover:text-white/70",
            )}
          >
            <it.Icon size={13} strokeWidth={2.25} />
            {it.label}
            {it.badge ? (
              <span
                className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold text-white"
                style={{ boxShadow: "0 0 12px rgba(220,38,38,0.5)" }}
              >
                {it.badge}
              </span>
            ) : null}
            {active && (
              <motion.span
                layoutId="ri-tab"
                className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #a4b1ff 0%, #d946ef 100%)",
                  boxShadow: "0 0 12px rgba(217,70,239,0.6)",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Diagnóstico view
// ============================================================================

function DiagnosticoView({
  onOpenRec,
  resolved,
}: {
  onOpenRec: (r: Recommendation) => void;
  resolved: Set<string>;
}) {
  const top4 = RECOMMENDATIONS.filter((r) => !resolved.has(r.id)).slice(0, 4);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <ExecutiveSummary />
      <KPIRow />
      <div data-tour="ri-priorities">
        <p className="mb-2 font-ui text-[11px] font-bold uppercase tracking-[3px] text-white/55">
          Prioridades de hoje
        </p>
        <div className="grid grid-cols-4 gap-3">
          {top4.map((r, i) => (
            <RecommendationCard
              key={r.id}
              rec={r}
              compact
              delay={i * 0.06}
              onOpen={() => onOpenRec(r)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ExecutiveSummary() {
  return (
    <motion.div
      data-tour="ri-executive"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 p-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(2,7,136,0.55) 0%, rgba(107,33,168,0.45) 60%, rgba(217,70,239,0.3) 100%)",
      }}
    >
      <ShimmerSweep />
      <div className="relative flex items-start gap-3">
        <motion.span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-md text-white"
          style={{
            background:
              "linear-gradient(135deg, #a4b1ff 0%, #d946ef 100%)",
            boxShadow:
              "0 0 24px rgba(217,70,239,0.5), 0 0 48px rgba(164,177,255,0.3)",
          }}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={18} strokeWidth={2.25} />
        </motion.span>
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[3px] text-white/60">
            Resumo executivo da unidade · Hoje
          </p>
          <p className="mt-1 font-ui text-[18px] font-bold leading-snug text-white">
            Sua unidade exige atenção em CMV, contas vencidas e produtos com
            margem abaixo do ideal.
          </p>
          <p className="mt-1.5 font-ui text-[13px] text-white/75">
            <CountChip color="#16a34a" Icon={Sparkles}>
              3 oportunidades de aumento de margem
            </CountChip>
            <CountChip color="#dc2626" Icon={AlertTriangle}>
              2 riscos operacionais relevantes
            </CountChip>
            <CountChip color="#d97706" Icon={ShieldAlert}>
              1 alerta crítico
            </CountChip>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CountChip({
  color,
  Icon,
  children,
}: {
  color: string;
  Icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <span
      className="mr-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold backdrop-blur"
      style={{ background: `${color}25`, color: "white" }}
    >
      <Icon size={11} strokeWidth={2.5} style={{ color }} />
      {children}
    </span>
  );
}

function ShimmerSweep() {
  return (
    <motion.span
      aria-hidden
      initial={{ x: "-120%" }}
      animate={{ x: "120%" }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-y-0 w-1/3"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
      }}
    />
  );
}

// ----- KPIs -----

function KPIRow() {
  return (
    <div data-tour="ri-kpis" className="grid grid-cols-6 gap-3">
      {KPIS.map((k, i) => (
        <KPICard key={k.id} kpi={k} delay={i * 0.06} />
      ))}
    </div>
  );
}

function KPICard({ kpi, delay }: { kpi: KPI; delay: number }) {
  const tone =
    kpi.status === "danger"
      ? { c: "#ef4444", bg: "rgba(220,38,38,0.18)" }
      : kpi.status === "warning"
        ? { c: "#fbbf24", bg: "rgba(217,119,6,0.18)" }
        : { c: "#22c55e", bg: "rgba(22,163,74,0.18)" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{ background: tone.bg, color: tone.c }}
        >
          <kpi.Icon size={13} strokeWidth={2} />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
          )}
          style={{ background: tone.bg, color: tone.c }}
        >
          {kpi.trend === "up" ? (
            <ArrowUpRight size={9} strokeWidth={2.5} />
          ) : kpi.trend === "down" ? (
            <ArrowDownRight size={9} strokeWidth={2.5} />
          ) : null}
        </span>
      </div>
      <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-white/60">
        {kpi.label}
      </p>
      <motion.p
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.15 }}
        className="font-ui text-[20px] font-bold text-white tabular-nums"
      >
        {kpi.value}
      </motion.p>
      <p className="text-[10px] tabular-nums" style={{ color: tone.c }}>
        {kpi.trendValue}
      </p>
    </motion.div>
  );
}

// ============================================================================
// Recomendações view
// ============================================================================

function RecomendacoesView({
  onOpenRec,
  resolved,
}: {
  onOpenRec: (r: Recommendation) => void;
  resolved: Set<string>;
}) {
  const groups: Priority[] = ["urgente", "oportunidade", "atencao", "estrategico"];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      data-tour="ri-recs-board"
      className="grid grid-cols-4 gap-3"
    >
      {groups.map((p) => {
        const items = RECOMMENDATIONS.filter(
          (r) => r.priority === p && !resolved.has(r.id),
        );
        const meta = PRIORITY_META[p];
        return (
          <div key={p} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: meta.bg, color: meta.color }}
              >
                <meta.Icon size={11} strokeWidth={2.5} />
                {meta.label}
              </span>
              <span className="text-[10px] font-bold text-white/40 tabular-nums">
                {items.length}
              </span>
            </div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/3 p-3 text-center">
                <Check size={14} strokeWidth={2.5} className="mx-auto text-success" />
                <p className="mt-1 text-[10px] text-white/45">Tudo em ordem.</p>
              </div>
            ) : (
              items.map((r, i) => (
                <RecommendationCard
                  key={r.id}
                  rec={r}
                  delay={i * 0.05}
                  onOpen={() => onOpenRec(r)}
                />
              ))
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

function RecommendationCard({
  rec,
  compact,
  delay,
  onOpen,
}: {
  rec: Recommendation;
  compact?: boolean;
  delay: number;
  onOpen: () => void;
}) {
  const meta = PRIORITY_META[rec.priority];
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.99 }}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      data-tour={rec.id === "r1" ? "ri-rec-first" : undefined}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur transition-colors hover:bg-white/8"
      style={{
        boxShadow: `inset 3px 0 0 ${meta.bgSolid}`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ background: meta.bg, color: meta.color }}
        >
          <meta.Icon size={9} strokeWidth={2.5} />
          {meta.label}
        </span>
        {rec.priority === "urgente" && (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block h-2 w-2 rounded-full"
            style={{
              background: meta.color,
              boxShadow: `0 0 10px ${meta.color}`,
            }}
          />
        )}
      </div>
      <p
        className={cn(
          "mt-2 font-ui font-bold leading-tight text-white",
          compact ? "text-[13px]" : "text-[14px]",
        )}
      >
        {rec.title}
      </p>
      <p className="mt-1 text-[10px] text-white/60 line-clamp-2">
        {rec.problem}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className="font-ui text-[11px] font-bold"
          style={{ color: meta.color }}
        >
          {rec.impact}
        </span>
        <ChevronRight
          size={12}
          strokeWidth={2.25}
          className="text-white/40 transition-colors group-hover:text-white"
        />
      </div>
    </motion.button>
  );
}

// ============================================================================
// Engenharia view (menu engineering matrix)
// ============================================================================

const QUADRANTS: {
  id: "estrela" | "burro" | "puzzle" | "cachorro";
  label: string;
  desc: string;
  color: string;
}[] = [
  { id: "estrela", label: "Estrela", desc: "Alta popularidade + alta margem", color: "#16a34a" },
  { id: "burro", label: "Burro de carga", desc: "Alta popularidade + baixa margem", color: "#d97706" },
  { id: "puzzle", label: "Quebra-cabeça", desc: "Baixa popularidade + alta margem", color: "#3b42c4" },
  { id: "cachorro", label: "Cachorro", desc: "Baixa popularidade + baixa margem", color: "#6b7280" },
];

function EngenhariaView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-[1fr_320px] gap-4"
      data-tour="ri-engineering"
    >
      <Matrix />
      <QuadrantPanel />
    </motion.div>
  );
}

function Matrix() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[3px] text-white/55">
            Engenharia de cardápio
          </p>
          <p className="mt-0.5 font-ui text-[14px] font-bold text-white">
            Popularidade × Margem
          </p>
        </div>
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-white/60">
          8 produtos analisados
        </span>
      </div>

      {/* Plot area */}
      <div
        className="relative mt-3"
        style={{ aspectRatio: "16/10" }}
      >
        {/* Quadrant lines */}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, transparent calc(50% - 1px), rgba(164,177,255,0.25), transparent calc(50% + 1px))",
          }}
        />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent calc(50% - 1px), rgba(164,177,255,0.25), transparent calc(50% + 1px))",
          }}
        />
        {/* Quadrant labels */}
        <span className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-success">
          Quebra-cabeça
        </span>
        <span className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-wider text-success">
          Estrela
        </span>
        <span className="absolute left-3 bottom-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
          Cachorro
        </span>
        <span className="absolute right-3 bottom-3 text-[10px] font-bold uppercase tracking-wider text-warning">
          Burro de carga
        </span>

        {/* Axes labels */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/50">
          Popularidade →
        </span>
        <span
          className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/50"
          style={{ transformOrigin: "center" }}
        >
          Margem →
        </span>

        {/* Dishes */}
        {MENU_DISHES.map((d, i) => {
          const tone = quadrantTone(d.popularity, d.margin);
          return (
            <motion.button
              key={d.id}
              type="button"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2 + i * 0.07,
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              whileTap={{ scale: 0.95 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${d.popularity}%`,
                top: `${100 - d.margin}%`,
                background: tone,
                boxShadow: `0 0 14px ${tone}, 0 0 30px ${tone}50`,
                width: 14,
                height: 14,
              }}
              aria-label={d.name}
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
                style={{ background: tone }}
              />
              <span className="absolute left-[18px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black/55 px-1.5 py-0.5 text-[9px] font-medium text-white/85 backdrop-blur">
                {d.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function quadrantTone(pop: number, margin: number): string {
  if (pop >= 50 && margin >= 50) return "#22c55e"; // estrela
  if (pop >= 50 && margin < 50) return "#fbbf24"; // burro de carga
  if (pop < 50 && margin >= 50) return "#a4b1ff"; // quebra-cabeça
  return "#9ca3af"; // cachorro
}

function QuadrantPanel() {
  const actions: Record<string, string[]> = {
    estrela: [
      "Manter destaque no cardápio digital",
      "Proteger qualidade e fornecimento",
      "Combos e cross-sell sem desconto agressivo",
    ],
    burro: [
      "Revisar preço de venda",
      "Reduzir custo via ficha técnica",
      "Negociar insumo com fornecedor",
      "Criar adicional pago",
    ],
    puzzle: [
      "Melhorar foto, nome e descrição",
      "Reposicionar no cardápio",
      "Campanha interna + treinamento da equipe",
    ],
    cachorro: [
      "Avaliar remoção",
      "Substituir por nova receita",
      "Manter apenas se for estratégico",
    ],
  };
  return (
    <div className="space-y-2">
      {QUADRANTS.map((q) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur"
        >
          <div className="flex items-center justify-between">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: `${q.color}25`, color: q.color }}
            >
              <span
                className="block h-2 w-2 rounded-full"
                style={{ background: q.color, boxShadow: `0 0 8px ${q.color}` }}
              />
              {q.label}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-white/55">{q.desc}</p>
          <ul className="mt-2 space-y-1">
            {actions[q.id].map((a) => (
              <li
                key={a}
                className="flex items-start gap-1.5 text-[11px] text-white/80"
              >
                <Check
                  size={10}
                  strokeWidth={2.5}
                  className="mt-1 flex-none"
                  style={{ color: q.color }}
                />
                {a}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================================
// Copiloto view
// ============================================================================

interface ChatTurn {
  id: string;
  role: "you" | "ai";
  content: ChatExchange["answer"] | string;
  thinking?: boolean;
}

function CopilotoView() {
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "intro",
      role: "ai",
      content:
        "Pergunte qualquer coisa sobre sua operação. Eu cruzo vendas, CMV, estoque e contas em segundos e respondo com insights e ação recomendada.",
    },
  ]);

  const ask = (q: ChatExchange) => {
    const id = `t${Date.now()}`;
    setTurns((p) => [
      ...p,
      { id: `${id}-q`, role: "you", content: q.question },
      { id: `${id}-a`, role: "ai", content: q.answer, thinking: true },
    ]);
    // After "thinking" reveal
    setTimeout(() => {
      setTurns((p) =>
        p.map((t) =>
          t.id === `${id}-a` ? { ...t, thinking: false } : t,
        ),
      );
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid h-full grid-rows-[1fr_auto] gap-3"
      data-tour="ri-copilot"
    >
      <div className="overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white"
            style={{
              background:
                "linear-gradient(135deg, #a4b1ff 0%, #d946ef 100%)",
              boxShadow: "0 0 20px rgba(217,70,239,0.4)",
            }}
          >
            <Bot size={17} strokeWidth={2} />
          </motion.span>
          <div>
            <p className="font-ui text-[13px] font-bold text-white">
              Copiloto Retail Intelligence
            </p>
            <p className="text-[10px] text-white/55">
              Analista operacional com IA sobre os seus dados reais
            </p>
          </div>
        </div>

        <AnimatePresence>
          {turns.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("mb-2 flex", t.role === "you" && "justify-end")}
            >
              {t.role === "you" ? (
                <div
                  className="rounded-2xl rounded-tr-sm bg-white/15 px-3 py-2 font-ui text-[12px] text-white backdrop-blur"
                  style={{ maxWidth: "70%" }}
                >
                  {typeof t.content === "string" ? t.content : ""}
                </div>
              ) : (
                <AIBubble content={t.content} thinking={t.thinking} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        data-tour="ri-quick-questions"
        className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur"
      >
        <p className="w-full font-ui text-[10px] font-bold uppercase tracking-wider text-white/55">
          Perguntas rápidas
        </p>
        {CHAT_LIBRARY.map((q) => (
          <motion.button
            key={q.question}
            type="button"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -1 }}
            onClick={() => ask(q)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-ui text-[12px] font-medium text-white/85 transition-colors hover:bg-white/12"
          >
            <Send size={10} strokeWidth={2.25} className="mr-1.5 inline" />
            {q.question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function AIBubble({
  content,
  thinking,
}: {
  content: ChatTurn["content"];
  thinking?: boolean;
}) {
  if (typeof content === "string") {
    return (
      <div
        className="rounded-2xl rounded-tl-sm bg-white/5 px-3 py-2 font-ui text-[12px] text-white/90 ring-1 ring-white/10 backdrop-blur"
        style={{ maxWidth: "75%" }}
      >
        {content}
      </div>
    );
  }
  return (
    <div
      className="space-y-2 rounded-2xl rounded-tl-sm border p-3 backdrop-blur"
      style={{
        maxWidth: "78%",
        background:
          "linear-gradient(135deg, rgba(2,7,136,0.35) 0%, rgba(217,70,239,0.18) 100%)",
        borderColor: "rgba(164,177,255,0.25)",
      }}
    >
      {thinking ? (
        <AIThinking />
      ) : (
        <>
          <p className="font-ui text-[13px] font-bold leading-snug text-white">
            {content.headline}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {content.insights.map((it) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center justify-between rounded-md bg-white/8 px-2 py-1.5"
              >
                <span className="text-[10px] text-white/65">{it.label}</span>
                <span
                  className="font-ui text-[11px] font-bold tabular-nums"
                  style={{
                    color:
                      it.tone === "good"
                        ? "#22c55e"
                        : it.tone === "bad"
                          ? "#fda4af"
                          : "white",
                  }}
                >
                  {it.value}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-2 rounded-md p-2"
            style={{ background: "rgba(217,70,239,0.18)" }}
          >
            <Zap size={12} strokeWidth={2.25} className="mt-0.5 text-fuchsia-200" />
            <p className="font-ui text-[11px] leading-snug text-white/90">
              <span className="font-bold text-fuchsia-200">
                Ação recomendada:{" "}
              </span>
              {content.action}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

function AIThinking() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full"
          style={{ background: "#a4b1ff" }}
          animate={{
            opacity: [0.25, 1, 0.25],
            scale: [1, 1.35, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
      <span className="font-ui text-[11px] text-white/65">
        cruzando dados...
      </span>
    </div>
  );
}

// ============================================================================
// Recommendation detail modal + simulação
// ============================================================================

function RecommendationDetail({
  rec,
  onClose,
  onResolve,
}: {
  rec: Recommendation;
  onClose: () => void;
  onResolve: () => void;
}) {
  const meta = PRIORITY_META[rec.priority];
  const [simOpen, setSimOpen] = useState(false);
  const [delta, setDelta] = useState(4); // % de reajuste
  const baseMargin = 36;
  const newMargin = baseMargin + delta * 0.6;
  const volumeImpact = Math.max(-15, -delta * 1.2);
  const revenueImpact = delta * 420;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 px-6 backdrop-blur"
      onClick={onClose}
      data-tour="ri-detail-modal"
    >
      <motion.div
        initial={{ scale: 0.92, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] overflow-hidden rounded-2xl border border-white/10"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, #221a4a 0%, #0d0e26 70%, #050610 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div className="flex items-start gap-3">
            <span
              className="flex h-11 w-11 flex-none items-center justify-center rounded-md text-white"
              style={{ background: meta.bgSolid }}
            >
              <rec.Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: meta.bg, color: meta.color }}
              >
                <meta.Icon size={10} strokeWidth={2.5} />
                {meta.label} · {rec.indicator}
              </span>
              <p className="mt-1 font-ui text-[18px] font-bold leading-tight text-white">
                {rec.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/70 hover:bg-white/15"
          >
            <X size={14} strokeWidth={2.25} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <DetailRow label="Problema detectado" text={rec.problem} />
          <DetailRow label="Causa provável" text={rec.cause} />
          <DetailRow label="Impacto estimado" text={rec.impact} tone={meta.color} />

          <div
            className="rounded-xl border border-white/10 bg-white/4 p-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">
              Ação recomendada pela IA
            </p>
            <p className="mt-1 font-ui text-[13px] leading-snug text-white">
              {rec.action}
            </p>
          </div>

          {/* Simulação inline */}
          <AnimatePresence>
            {simOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-1 rounded-xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-ui text-[12px] font-bold text-white">
                      Simular reajuste de preço
                    </p>
                    <span
                      className="font-ui text-[14px] font-bold tabular-nums"
                      style={{ color: "#f0abfc" }}
                    >
                      +{delta}%
                    </span>
                  </div>
                  <div data-tour="ri-sim-slider" className="mt-2 flex items-center gap-2">
                    {[0, 2, 4, 6, 8, 10].map((v) => {
                      const active = v === delta;
                      return (
                        <motion.button
                          key={v}
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setDelta(v)}
                          className={cn(
                            "flex-1 rounded-md py-2 font-ui text-[11px] font-bold transition-colors",
                          )}
                          style={{
                            background: active
                              ? "linear-gradient(135deg, #a4b1ff 0%, #d946ef 100%)"
                              : "rgba(255,255,255,0.08)",
                            color: active ? "white" : "rgba(255,255,255,0.7)",
                          }}
                        >
                          +{v}%
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <SimStat
                      label="Margem nova"
                      value={`${newMargin.toFixed(1)}%`}
                      delta={`+${(newMargin - baseMargin).toFixed(1)}pp`}
                      tone="#22c55e"
                    />
                    <SimStat
                      label="Volume previsto"
                      value={`${volumeImpact.toFixed(1)}%`}
                      tone={volumeImpact >= -5 ? "#22c55e" : "#fbbf24"}
                    />
                    <SimStat
                      label="Receita extra"
                      value={`R$ ${revenueImpact.toLocaleString("pt-BR")}/mês`}
                      tone="#a4b1ff"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 bg-black/30 p-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setSimOpen((s) => !s)}
            data-tour="ri-sim-button"
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2 font-ui text-[12px] font-bold text-white hover:bg-white/8"
          >
            <Layers size={13} strokeWidth={2.25} />
            {simOpen ? "Fechar simulação" : "Simular impacto"}
          </motion.button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/15 px-3 py-2 font-ui text-[12px] font-medium text-white/75 hover:bg-white/5"
            >
              Mais tarde
            </button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onResolve}
              data-tour="ri-resolve"
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 font-ui text-[12px] font-bold text-white shadow-brand"
              style={{
                background:
                  "linear-gradient(135deg, #a4b1ff 0%, #d946ef 100%)",
              }}
            >
              <Check size={13} strokeWidth={2.5} />
              Marcar como resolvido
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">
        {label}
      </p>
      <p
        className="mt-0.5 font-ui text-[13px] font-medium leading-snug"
        style={{ color: tone ?? "rgba(255,255,255,0.92)" }}
      >
        {text}
      </p>
    </div>
  );
}

function SimStat({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta?: string;
  tone: string;
}) {
  return (
    <div className="rounded-md bg-white/8 px-2 py-1.5">
      <p className="text-[9px] text-white/55">{label}</p>
      <p
        className="font-ui text-[14px] font-bold tabular-nums"
        style={{ color: tone }}
      >
        {value}
      </p>
      {delta && <p className="text-[9px] tabular-nums" style={{ color: tone }}>
        {delta}
      </p>}
    </div>
  );
}

// Re-export some icons we use selectively to keep tree shake honest
export { Star, Flame };
