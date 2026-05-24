"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import {
  TrendingUp,
  Brain,
  Sparkles,
  Calendar,
  Users,
  Package,
  Cloud,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { Badge } from "@/components/ui/shadcn";
import {
  AreaChart,
  RadialGauge,
  HorizontalBars,
} from "@/components/ui/charts";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { InsightCard } from "@/components/ui/InsightCard";

interface APIAProps {
  step: number;
}

/**
 * Análise Preditiva for restaurants — ML-driven demand forecast, waste
 * prediction, stock rupture risk. Distinct from the HR Análise Preditiva
 * (which predicts turnover). This one lives in the IA group.
 *
 * Layout: header → 3-up KPIs → main forecast chart + ML model card +
 * side risk + horizontal feature importance.
 */
export function AnalisePreditivaIAMockup({ step }: APIAProps) {
  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({ apiaStep: step });
  }, [step, patchLive]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <Header />
      <main
        className="grid flex-1 grid-rows-[auto_1fr_auto] gap-3 overflow-hidden px-5 py-4"
        style={{
          background: "radial-gradient(ellipse at top, #f5f3ff 0%, #f4f6fb 60%)",
        }}
      >
        <KPIStrip />
        <MainArea />
        <BottomRow />
      </main>
    </div>
  );
}

// ============================================================================

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(124,58,237,0)",
                "0 0 0 6px rgba(124,58,237,0.10)",
                "0 0 0 0 rgba(124,58,237,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
            }}
          >
            <Brain size={15} strokeWidth={2.25} />
          </motion.span>
          <div className="leading-tight">
            <p
              className="font-ui text-[13px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.005em" }}
            >
              Análise Preditiva
            </p>
            <p className="font-ui text-[10px] text-neutral-500">
              Modelo XGBoost · 24m de histórico · 87% acurácia
            </p>
          </div>
        </div>
        <Badge variant="ai" className="gap-1">
          <Sparkles size={10} strokeWidth={2.5} />
          IA
        </Badge>
        <Badge variant="secondary">Tendência 2026</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 font-ui text-[10px] font-medium text-neutral-500">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-success"
          />
          Modelo treinando · próx. atualização em 4h
        </span>
      </div>
    </header>
  );
}

// ============================================================================
// 3-up KPI strip
// ============================================================================

function KPIStrip() {
  return (
    <div data-tour="apia-kpis" className="grid grid-cols-4 gap-2">
      <KPITile
        icon={<Users />}
        tone="brand"
        label="Demanda prevista hoje"
        value="1.847"
        delta="+8,2% vs ontem"
        deltaUp
      />
      <KPITile
        icon={<Package />}
        tone="warning"
        label="Risco de desperdício"
        value="14,2kg"
        delta="acima da meta"
      />
      <KPITile
        icon={<AlertTriangle />}
        tone="danger"
        label="Ruptura prevista 7d"
        value="3 itens"
        delta="óleo, queijo, farinha"
      />
      <KPITile
        icon={<TrendingUp />}
        tone="success"
        label="Acurácia 30d"
        value="87,4%"
        delta="+2,1pp"
        deltaUp
      />
    </div>
  );
}

function KPITile({
  icon,
  tone,
  label,
  value,
  delta,
  deltaUp,
}: {
  icon: React.ReactElement;
  tone: "brand" | "danger" | "warning" | "success";
  label: string;
  value: string;
  delta: string;
  deltaUp?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white p-3"
      style={{
        border: "1px solid rgba(0,0,0,0.04)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center justify-between">
        <GradientIcon icon={icon} tone={tone} size={28} />
      </div>
      <p
        className="mt-2 font-ui text-[10px] font-bold uppercase text-neutral-500"
        style={{ letterSpacing: "0.14em" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 font-ui text-[20px] font-bold tabular-nums leading-none text-neutral-900"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </p>
      <p
        className={cn(
          "mt-0.5 font-ui text-[10px] font-bold tabular-nums",
          deltaUp ? "text-success" : "text-neutral-500",
        )}
      >
        {delta}
      </p>
    </motion.div>
  );
}

// ============================================================================
// Main area: forecast chart + AI insights side
// ============================================================================

function MainArea() {
  // 14-day forecast: 7d real + 7d prediction
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
    <div className="grid min-h-0 grid-cols-[1fr_300px] gap-3">
      {/* Forecast chart */}
      <div
        data-tour="apia-forecast"
        className="flex min-h-0 flex-col rounded-2xl bg-white p-4"
        style={{
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div className="mb-2 flex items-start justify-between">
          <div>
            <p
              className="font-ui text-[13px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.01em" }}
            >
              Demanda prevista · 14 dias
            </p>
            <p className="mt-0.5 font-ui text-[10.5px] text-neutral-500">
              Modelo XGBoost considerando clima, calendário e histórico
            </p>
          </div>
          <Badge variant="ai" className="text-[9px]">
            <Sparkles size={9} strokeWidth={2.5} />
            ML
          </Badge>
        </div>
        <div className="min-h-0 flex-1">
          <AreaChart
            data={forecast}
            color="#7c3aed"
            yMin={1500}
            yMax={2300}
            aspectRatio="16/5"
            formatY={(v) => `${v.toFixed(0)} refeições`}
          />
        </div>

        {/* Feature importance */}
        <div className="mt-2 border-t border-neutral-100 pt-2">
          <p
            className="font-ui text-[9px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            O que o modelo está olhando agora
          </p>
          <div className="mt-1">
            <HorizontalBars
              bars={[
                { label: "Histórico mesma semana", value: 38, color: "#7c3aed", meta: "%" },
                { label: "Calendário (feriado próx)", value: 24, color: "#020788", meta: "%" },
                { label: "Clima previsto", value: 18, color: "#0d9488", meta: "%" },
                { label: "Eventos locais", value: 12, color: "#f59e0b", meta: "%" },
                { label: "Movimento das filiais vizinhas", value: 8, color: "#ec4899", meta: "%" },
              ]}
              thickness={5}
            />
          </div>
        </div>
      </div>

      {/* Right: model card + insights */}
      <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-0.5">
        <div
          data-tour="apia-model"
          className="overflow-hidden rounded-2xl p-3 text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <p
              className="font-ui text-[9px] font-bold uppercase text-white/80"
              style={{ letterSpacing: "0.18em" }}
            >
              Modelo ativo
            </p>
            <Cloud size={14} strokeWidth={2} className="text-white/65" />
          </div>
          <p
            className="mt-1 font-ui text-[15px] font-bold leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            XGBoost · v4.2.1
          </p>
          <div className="mt-2 flex items-end justify-between">
            <RadialGauge
              value={87.4}
              size={108}
              label="87,4%"
              sublabel="Acurácia"
              colors={{ from: "#a855f7", to: "#22c55e" }}
            />
            <div className="space-y-1 pb-2 text-right">
              <p className="font-ui text-[9px] text-white/65">F1 score</p>
              <p
                className="font-ui text-[13px] font-bold tabular-nums leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                0,84
              </p>
              <p className="font-ui text-[9px] text-white/65">MAE refeições</p>
              <p
                className="font-ui text-[13px] font-bold tabular-nums leading-none"
                style={{ letterSpacing: "-0.02em" }}
              >
                ±42
              </p>
            </div>
          </div>
        </div>

        <InsightCard
          icon={<Calendar />}
          tone="warning"
          title="Pico previsto sexta"
          description="Demanda 14% acima da média no almoço por causa de feriado prolongado. Recomendação: +1 funcionário no atendimento."
          confidence={91}
          status="Aguardando aprovação"
        />
        <InsightCard
          icon={<Zap />}
          tone="success"
          title="Compra antecipada de óleo"
          description="Tendência indica ruptura em 6 dias. Pedido automático gerado com fornecedor preferencial."
          confidence={94}
          status="IA aplicou"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Bottom row: forecast applied + agent feed
// ============================================================================

function BottomRow() {
  return (
    <div className="grid grid-cols-[1fr_360px] gap-3">
      <div
        data-tour="apia-agent"
        className="overflow-hidden rounded-2xl p-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(2,7,136,0.96) 0%, rgba(124,58,237,0.92) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur"
            >
              <Brain size={14} strokeWidth={2.25} />
            </motion.span>
            <div className="leading-tight">
              <p
                className="font-ui text-[9px] font-bold uppercase text-white/80"
                style={{ letterSpacing: "0.18em" }}
              >
                Agente preditivo · agindo agora
              </p>
              <p
                className="font-ui text-[15px] font-bold text-white"
                style={{ letterSpacing: "-0.01em" }}
              >
                7 decisões tomadas nas últimas 24h
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 font-ui text-[11px] font-bold text-brand"
          >
            Ver log completo
            <ArrowRight size={11} strokeWidth={2.5} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: "Pedidos automáticos", v: "3", sub: "compras antecipadas" },
            { l: "Alertas de pico", v: "2", sub: "sexta + sábado" },
            { l: "Ajustes de cardápio", v: "2", sub: "para reduzir desperdício" },
          ].map((b) => (
            <div
              key={b.l}
              className="rounded-xl bg-white/10 p-2.5 backdrop-blur"
              style={{ border: "1px solid rgba(255,255,255,0.10)" }}
            >
              <p
                className="font-ui text-[9px] font-bold uppercase text-white/75"
                style={{ letterSpacing: "0.14em" }}
              >
                {b.l}
              </p>
              <p
                className="mt-0.5 font-ui text-[18px] font-bold tabular-nums leading-none text-white"
                style={{ letterSpacing: "-0.02em" }}
              >
                {b.v}
              </p>
              <p className="mt-0.5 font-ui text-[9.5px] text-white/65">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col rounded-2xl bg-white p-3"
        style={{
          border: "1px solid rgba(0,0,0,0.04)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <p
          className="font-ui text-[9px] font-bold uppercase text-brand"
          style={{ letterSpacing: "0.18em" }}
        >
          Decisões recentes
        </p>
        <div className="mt-1.5 space-y-1.5">
          {[
            { t: "5 min", what: "Pedido de queijo aumentado em 4kg para sexta", ok: true },
            { t: "1h", what: "Cardápio quinta ajustado: -2 pratos de risco", ok: true },
            { t: "3h", what: "Alerta enviado ao gestor — feriado pico", ok: true },
          ].map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.25 }}
              className="flex items-start gap-2 rounded-lg bg-success/5 px-2 py-1.5"
            >
              <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-success text-white">
                <CheckCircle2 size={9} strokeWidth={3} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[10px] leading-snug text-neutral-700">
                  {d.what}
                </p>
                <p className="mt-0.5 font-ui text-[9px] text-neutral-400">
                  Há {d.t}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
