"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Scale,
  FileText,
  History,
  Trash2,
  Utensils,
  ChefHat,
  AlertTriangle,
  Filter,
  Calendar,
  Save,
  CheckCircle2,
  TrendingDown,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { Badge, Button, Card } from "@/components/ui/shadcn";
import { DonutChart, DonutLegend } from "@/components/ui/charts";
import { GradientIcon } from "@/components/ui/GradientIcon";

interface WasteControlProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

type WasteKind = "sobra-limpa" | "resto-ingesto" | "producao" | "excesso";

const KIND_META: Record<
  WasteKind,
  { label: string; subtitle: string; Icon: typeof Trash2; goal: number }
> = {
  "sobra-limpa": {
    label: "Sobra limpa",
    subtitle: "Comida que sobrou na cuba, por prato/receita",
    Icon: Trash2,
    goal: 6,
  },
  "resto-ingesto": {
    label: "Resto ingesto",
    subtitle: "Comida que foi servida e não foi consumida",
    Icon: Utensils,
    goal: 8,
  },
  producao: {
    label: "Produção",
    subtitle: "Quantidade total produzida no serviço",
    Icon: ChefHat,
    goal: 0,
  },
  excesso: {
    label: "Excesso",
    subtitle: "Comida produzida além da meta",
    Icon: AlertTriangle,
    goal: 4,
  },
};

const SERVICOS = [
  "Almoço · refeitório principal",
  "Almoço · refeitório fábrica",
  "Jantar · refeitório principal",
  "Lanche da tarde",
];

const PRATOS_COMUNS = [
  "Arroz integral",
  "Feijão carioca",
  "Frango grelhado",
  "Legumes no vapor",
  "Salada de folhas",
];

const UNIDADES = ["Quilogramas (kg)", "Gramas (g)", "Litros (L)"];

interface Registro {
  id: string;
  data: string;
  hora: string;
  kind: WasteKind;
  servico: string;
  prato: string;
  quantidade: number;
  unidade: string;
}

const HISTORICO_INICIAL: Registro[] = [
  {
    id: "r1",
    data: "21/05",
    hora: "13:18",
    kind: "sobra-limpa",
    servico: SERVICOS[0],
    prato: "Arroz branco",
    quantidade: 3.2,
    unidade: "Quilogramas (kg)",
  },
  {
    id: "r2",
    data: "21/05",
    hora: "13:24",
    kind: "resto-ingesto",
    servico: SERVICOS[0],
    prato: "Feijão carioca",
    quantidade: 2.4,
    unidade: "Quilogramas (kg)",
  },
  {
    id: "r3",
    data: "20/05",
    hora: "14:02",
    kind: "sobra-limpa",
    servico: SERVICOS[0],
    prato: "Estrogonofe de frango",
    quantidade: 5.8,
    unidade: "Quilogramas (kg)",
  },
];

// ============================================================================
// Component
// ============================================================================

export function WasteControlMockup({ step }: WasteControlProps) {
  void step;
  const [tab, setTab] = useState<"registros" | "historico">("registros");
  const [kind, setKind] = useState<WasteKind>("sobra-limpa");
  const [servico, setServico] = useState<string>(SERVICOS[0]);
  // Pre-fill so the submit button is enabled. User can change freely.
  const [prato, setPrato] = useState<string>("Arroz integral");
  const [quantidade, setQuantidade] = useState<number>(3.0);
  const [unidade, setUnidade] = useState<string>(UNIDADES[0]);
  const [historico, setHistorico] = useState<Registro[]>(HISTORICO_INICIAL);
  const [feedback, setFeedback] = useState<string | null>(null);

  const meta = KIND_META[kind];
  const aboveGoal = meta.goal > 0 && quantidade > meta.goal;

  const totalKg = useMemo(
    () =>
      historico
        .filter((r) => r.unidade === "Quilogramas (kg)")
        .reduce((s, r) => s + r.quantidade, 0),
    [historico],
  );

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      wcTab: tab,
      wcKind: kind,
      wcKindLabel: meta.label,
      wcPrato: prato,
      wcQuantidade: quantidade,
      wcUnidade: unidade,
      wcServico: servico,
      wcAboveGoal: aboveGoal,
      wcHistoricoCount: historico.length,
      wcTotalKg: totalKg,
    });
  }, [
    tab,
    kind,
    meta.label,
    prato,
    quantidade,
    unidade,
    servico,
    aboveGoal,
    historico.length,
    totalKg,
    patchLive,
  ]);

  const registrar = () => {
    if (!prato || quantidade <= 0) return;
    const next: Registro = {
      id: `r${Date.now()}`,
      data: "22/05",
      hora: "12:34",
      kind,
      servico,
      prato,
      quantidade,
      unidade,
    };
    setHistorico((p) => [next, ...p]);
    setFeedback(`${meta.label} registrada (${quantidade} ${unidade.split(" ")[0]})`);
    setPrato("");
    setQuantidade(0);
    setTimeout(() => setFeedback(null), 2400);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <Header />

      <main className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-3">
        <TopTabs tab={tab} onPick={setTab} />

        {tab === "registros" && (
          <RegistrosView
            kind={kind}
            onKindChange={setKind}
            servico={servico}
            onServicoChange={setServico}
            prato={prato}
            onPratoChange={setPrato}
            quantidade={quantidade}
            onQuantidadeChange={setQuantidade}
            unidade={unidade}
            onUnidadeChange={setUnidade}
            aboveGoal={aboveGoal}
            meta={meta}
            onRegistrar={registrar}
            feedback={feedback}
          />
        )}

        {tab === "historico" && (
          <HistoricoView historico={historico} totalKg={totalKg} />
        )}
      </main>
    </div>
  );
}

function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-white"
            style={{ background: "#020788" }}
          >
            <Scale size={14} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-ui text-[13px] font-bold text-neutral-900">
              WasteControl
            </p>
            <p className="font-ui text-[10px] text-neutral-500">
              Sistema de controle de desperdício
            </p>
          </div>
        </div>
      </div>
      <Badge variant="success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Sincronizado
      </Badge>
    </header>
  );
}

function TopTabs({
  tab,
  onPick,
}: {
  tab: "registros" | "historico";
  onPick: (t: "registros" | "historico") => void;
}) {
  const items = [
    { id: "registros" as const, label: "Registros", Icon: FileText },
    { id: "historico" as const, label: "Histórico", Icon: History },
  ];
  return (
    <div
      data-tour="wc-top-tabs"
      className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-card"
    >
      {items.map((t) => {
        const active = t.id === tab;
        return (
          <motion.button
            key={t.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onPick(t.id)}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl py-2.5 font-ui text-[12px] font-bold transition-colors",
              active
                ? "bg-brand text-white shadow-brand"
                : "text-neutral-500 hover:bg-brand-ghost",
            )}
          >
            <t.Icon size={13} strokeWidth={2.25} />
            {t.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Registros view
// ============================================================================

function RegistrosView({
  kind,
  onKindChange,
  servico,
  onServicoChange,
  prato,
  onPratoChange,
  quantidade,
  onQuantidadeChange,
  unidade,
  onUnidadeChange,
  aboveGoal,
  meta,
  onRegistrar,
  feedback,
}: {
  kind: WasteKind;
  onKindChange: (k: WasteKind) => void;
  servico: string;
  onServicoChange: (s: string) => void;
  prato: string;
  onPratoChange: (p: string) => void;
  quantidade: number;
  onQuantidadeChange: (q: number) => void;
  unidade: string;
  onUnidadeChange: (u: string) => void;
  aboveGoal: boolean;
  meta: (typeof KIND_META)[WasteKind];
  onRegistrar: () => void;
  feedback: string | null;
}) {
  const kinds: WasteKind[] = [
    "sobra-limpa",
    "resto-ingesto",
    "producao",
    "excesso",
  ];
  const KIND_TONE: Record<WasteKind, "success" | "amber" | "teal" | "danger"> = {
    "sobra-limpa": "success",
    "resto-ingesto": "amber",
    producao: "teal",
    excesso: "danger",
  };
  return (
    <div className="mt-3 space-y-3">
      <div data-tour="wc-kind-tabs" className="grid grid-cols-4 gap-1.5">
        {kinds.map((k) => {
          const m = KIND_META[k];
          const active = k === kind;
          return (
            <motion.button
              key={k}
              type="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              onClick={() => onKindChange(k)}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl px-1.5 py-3 transition-all",
                active
                  ? "bg-white shadow-elevated"
                  : "bg-white/60 hover:bg-white",
              )}
              style={{
                border: active
                  ? "1px solid rgba(2,7,136,0.18)"
                  : "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <GradientIcon
                icon={<m.Icon />}
                tone={KIND_TONE[k]}
                size={32}
                variant={active ? "solid" : "soft"}
              />
              <span
                className={cn(
                  "font-ui text-[10px] font-bold leading-tight tracking-tight",
                  active ? "text-neutral-900" : "text-neutral-500",
                )}
              >
                {m.label}
              </span>
              {active && (
                <motion.span
                  layoutId="wc-kind-active"
                  className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-brand"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div layout>
      <Card className="p-4">
        <div className="flex items-start gap-2">
          <span
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md text-white"
            style={{ background: "#020788" }}
          >
            <meta.Icon size={16} strokeWidth={2} />
          </span>
          <div>
            <p className="font-ui text-[14px] font-bold text-neutral-900">
              {meta.label}
            </p>
            <p className="font-ui text-[11px] text-neutral-500">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field label="Data">
            <ReadonlyValue Icon={Calendar} value="22/05/2026" />
          </Field>
          <Field label="Hora">
            <ReadonlyValue value="12:34" />
          </Field>
        </div>

        <div className="mt-3">
          <Field label="Serviço">
            <SelectChip
              value={servico}
              options={SERVICOS}
              onPick={onServicoChange}
            />
          </Field>
        </div>

        <div className="mt-3" data-tour="wc-form-prato">
          <Field label="Prato / Receita">
            <ChipList
              value={prato}
              options={PRATOS_COMUNS}
              onPick={onPratoChange}
              placeholder="Toque para escolher o prato"
            />
          </Field>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_140px] gap-3">
          <Field label="Quantidade">
            <QtyStepper value={quantidade} onChange={onQuantidadeChange} />
          </Field>
          <Field label="Unidade">
            <SelectChip
              value={unidade}
              options={UNIDADES}
              onPick={onUnidadeChange}
              compact
            />
          </Field>
        </div>

        {meta.goal > 0 && (
          <div
            data-tour="wc-meta"
            className={cn(
              "mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px]",
              aboveGoal
                ? "bg-warning/10 text-warning"
                : "bg-success/10 text-success",
            )}
          >
            <TrendingDown size={13} strokeWidth={2.25} />
            <span>
              Meta diária: <strong>{meta.goal} kg</strong>. Atual:{" "}
              <strong>{quantidade.toFixed(1)} kg</strong>.
              {aboveGoal
                ? " Acima da meta, alerta automático será disparado."
                : " Dentro da meta."}
            </span>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="default"
            size="lg"
            data-tour="wc-submit"
            onClick={onRegistrar}
            disabled={!prato || quantidade <= 0}
          >
            <Save size={14} strokeWidth={2.5} />
            Registrar {meta.label.toLowerCase()}
          </Button>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-[11px] text-success"
            >
              <CheckCircle2 size={13} strokeWidth={2.5} />
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      </motion.div>
    </div>
  );
}

// ============================================================================
// Histórico view
// ============================================================================

function HistoricoView({
  historico,
  totalKg,
}: {
  historico: Registro[];
  totalKg: number;
}) {
  // Aggregate by kind for the donut breakdown
  const byKind: Record<WasteKind, number> = {
    "sobra-limpa": 0,
    "resto-ingesto": 0,
    producao: 0,
    excesso: 0,
  };
  for (const r of historico) {
    byKind[r.kind] += r.quantidade;
  }
  const donutSlices = [
    { label: "Sobra limpa", value: byKind["sobra-limpa"], color: "#16a34a" },
    { label: "Resto ingesto", value: byKind["resto-ingesto"], color: "#f59e0b" },
    { label: "Produção", value: byKind["producao"], color: "#0d9488" },
    { label: "Excesso", value: byKind["excesso"], color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const wasteTotal = byKind["sobra-limpa"] + byKind["resto-ingesto"] + byKind.excesso;

  return (
    <div className="mt-3 space-y-3">
      <div data-tour="wc-summary" className="grid grid-cols-3 gap-2">
        <StatCard label="Registros" value={String(historico.length)} hint="hoje + semana" />
        <StatCard label="Total" value={`${totalKg.toFixed(1)} kg`} hint="quantidade acumulada" />
        <StatCard
          label="Meta"
          value="-12%"
          hint="vs. semana anterior"
          good
          Icon={Leaf}
        />
      </div>

      {donutSlices.length > 0 && (
        <Card
          data-tour="wc-breakdown"
          className="flex items-center gap-4 p-4 shadow-elevated"
          style={{ borderColor: "rgba(2,7,136,0.06)" }}
        >
          <DonutChart
            slices={donutSlices}
            size={104}
            thickness={0.55}
            centerLabel={`${wasteTotal.toFixed(1)}kg`}
            centerSublabel="Desperdício"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand">
                Composição por tipo
              </p>
              <Badge variant="success" className="px-1.5 py-0 text-[9px]">
                7 dias
              </Badge>
            </div>
            <DonutLegend
              slices={donutSlices}
              formatValue={(v) => `${v.toFixed(1)} kg`}
              className="mt-1.5"
            />
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
              <History size={12} strokeWidth={2.25} />
            </span>
            <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
              Histórico de registros
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-brand/15 px-2 py-0.5 text-[10px] font-medium text-brand hover:bg-brand-ghost"
          >
            <Filter size={10} strokeWidth={2.25} />
            Filtros
          </button>
        </div>

        <div className="mt-2 overflow-hidden rounded-xl border border-neutral-200">
          <div className="grid grid-cols-[80px_110px_1fr_70px] items-center bg-neutral-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500">
            <span>Data/Hora</span>
            <span>Tipo</span>
            <span>Prato</span>
            <span className="text-right">Qtd</span>
          </div>
          <div
            data-tour="wc-history-list"
            className="divide-y divide-neutral-100"
          >
            {historico.length === 0 ? (
              <p className="py-6 text-center text-[11px] italic text-neutral-400">
                Nenhum registro ainda.
              </p>
            ) : (
              historico.map((r) => {
                const m = KIND_META[r.kind];
                return (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-[80px_110px_1fr_70px] items-center px-3 py-2 text-[11px]"
                  >
                    <span className="text-neutral-500 tabular-nums">
                      <span className="block font-bold text-neutral-700">
                        {r.data}
                      </span>
                      <span className="block text-[10px]">{r.hora}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand">
                      <m.Icon size={11} strokeWidth={2.25} />
                      <span className="line-clamp-1">{m.label}</span>
                    </span>
                    <span className="text-neutral-700 line-clamp-1">{r.prato}</span>
                    <span className="text-right font-ui font-bold text-neutral-900 tabular-nums">
                      {r.quantidade.toFixed(1)}{" "}
                      <span className="text-neutral-400">
                        {r.unidade.split(" ")[0] === "Quilogramas" ? "kg" : "g"}
                      </span>
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Form helpers
// ============================================================================

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ReadonlyValue({
  Icon,
  value,
}: {
  Icon?: typeof Calendar;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-[11px] text-neutral-700">
      {Icon && <Icon size={11} strokeWidth={2.25} className="text-neutral-400" />}
      <span className="font-ui font-bold tabular-nums">{value}</span>
    </div>
  );
}

function SelectChip({
  value,
  options,
  onPick,
  compact,
}: {
  value: string;
  options: string[];
  onPick: (v: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", compact && "gap-1")}>
      {options.map((o) => {
        const active = o === value;
        return (
          <motion.button
            key={o}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(o)}
            className={cn(
              "rounded-md border-2 px-2.5 py-1.5 font-ui text-[10px] font-medium transition-colors",
              active
                ? "border-brand bg-brand text-white shadow-brand"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-brand/30",
            )}
          >
            {o}
          </motion.button>
        );
      })}
    </div>
  );
}

function ChipList({
  value,
  options,
  onPick,
  placeholder,
}: {
  value: string;
  options: string[];
  onPick: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        className={cn(
          "rounded-md border-2 px-2.5 py-2 text-[11px]",
          value
            ? "border-brand bg-brand-ghost font-ui font-bold text-brand"
            : "border-dashed border-neutral-200 bg-neutral-50 italic text-neutral-400",
        )}
      >
        {value || placeholder}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = o === value;
          return (
            <motion.button
              key={o}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onPick(o)}
              className={cn(
                "rounded-full border px-2.5 py-1 font-ui text-[10px] font-medium transition-colors",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-brand/30",
              )}
            >
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function QtyStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const presets = [0.5, 1, 2, 5];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-2 py-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 0.5))}
          className="flex h-7 w-7 items-center justify-center rounded-md font-ui text-[14px] text-brand"
        >
          −
        </button>
        <motion.span
          key={value}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          className="font-ui text-[16px] font-bold text-neutral-900 tabular-nums"
        >
          {value.toFixed(1)}
        </motion.span>
        <button
          type="button"
          onClick={() => onChange(value + 0.5)}
          className="flex h-7 w-7 items-center justify-center rounded-md font-ui text-[14px] text-brand"
        >
          +
        </button>
      </div>
      <div className="flex gap-1">
        {presets.map((p) => (
          <motion.button
            key={p}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(value + p)}
            className="flex-1 rounded-full bg-brand-ghost px-1 py-0.5 font-ui text-[10px] font-bold text-brand"
          >
            +{p}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  good,
  Icon,
}: {
  label: string;
  value: string;
  hint: string;
  good?: boolean;
  Icon?: typeof Leaf;
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand">
          {label}
        </p>
        {Icon && <Icon size={12} strokeWidth={2.25} className="text-success" />}
      </div>
      <p
        className={cn(
          "mt-1 font-ui text-[22px] font-bold tabular-nums leading-tight",
          good ? "text-success" : "text-neutral-900",
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-neutral-500">{hint}</p>
    </Card>
  );
}
