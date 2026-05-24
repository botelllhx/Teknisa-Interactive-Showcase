"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChefHat,
  Calendar,
  Plus,
  Check,
  X,
  Flame,
  Leaf,
  Wheat,
  Beef,
  Apple,
  Users,
  TrendingUp,
  Share2,
  CheckCircle2,
  Brain,
  Database,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { AreaChart } from "@/components/ui/charts";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { useTourLive } from "@/lib/tourState";
import { Badge, Button, Card } from "@/components/ui/shadcn";

interface CardapioInteligenteProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

type DayKey = "seg" | "ter" | "qua" | "qui" | "sex";

const WEEKDAYS: { key: DayKey; label: string; long: string; date: string }[] = [
  { key: "seg", label: "Seg", long: "Segunda-feira", date: "26/05" },
  { key: "ter", label: "Ter", long: "Terça-feira", date: "27/05" },
  { key: "qua", label: "Qua", long: "Quarta-feira", date: "28/05" },
  { key: "qui", label: "Qui", long: "Quinta-feira", date: "29/05" },
  { key: "sex", label: "Sex", long: "Sexta-feira", date: "30/05" },
];

type Course = "principal" | "guarnicao" | "salada" | "sobremesa";

interface Dish {
  id: string;
  name: string;
  course: Course;
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
  cost: number;
  tag?: "novo" | "popular" | "sugerido-ia";
  Icon: typeof Beef;
}

const DISH_BANK: Dish[] = [
  { id: "frango-grelhado", name: "Frango Grelhado com Ervas", course: "principal", calories: 380, protein: 42, carbs: 6, fiber: 1, cost: 6.8, tag: "popular", Icon: Beef },
  { id: "carne-panela", name: "Carne de Panela", course: "principal", calories: 460, protein: 38, carbs: 14, fiber: 2, cost: 8.2, Icon: Beef },
  { id: "estrogonofe", name: "Estrogonofe de Frango", course: "principal", calories: 520, protein: 32, carbs: 28, fiber: 2, cost: 7.4, Icon: Beef },
  { id: "tilapia", name: "Filé de Tilápia ao Limão", course: "principal", calories: 320, protein: 38, carbs: 4, fiber: 1, cost: 9.8, tag: "sugerido-ia", Icon: Beef },
  { id: "lasanha-integral", name: "Lasanha Integral de Espinafre", course: "principal", calories: 410, protein: 22, carbs: 48, fiber: 6, cost: 6.4, tag: "novo", Icon: Beef },
  { id: "arroz-branco", name: "Arroz Branco", course: "guarnicao", calories: 180, protein: 4, carbs: 38, fiber: 1, cost: 1.2, Icon: Wheat },
  { id: "arroz-integral", name: "Arroz Integral", course: "guarnicao", calories: 165, protein: 4, carbs: 34, fiber: 4, cost: 1.8, tag: "sugerido-ia", Icon: Wheat },
  { id: "feijao-carioca", name: "Feijão Carioca", course: "guarnicao", calories: 140, protein: 9, carbs: 24, fiber: 8, cost: 1.4, Icon: Wheat },
  { id: "pure-mandioquinha", name: "Purê de Mandioquinha", course: "guarnicao", calories: 220, protein: 4, carbs: 32, fiber: 3, cost: 2.1, Icon: Wheat },
  { id: "legumes-vapor", name: "Legumes no Vapor", course: "guarnicao", calories: 90, protein: 3, carbs: 18, fiber: 6, cost: 2.4, tag: "sugerido-ia", Icon: Leaf },
  { id: "salada-alface", name: "Mix de Folhas com Tomate", course: "salada", calories: 60, protein: 2, carbs: 10, fiber: 4, cost: 1.6, Icon: Leaf },
  { id: "salada-grao", name: "Salada de Grão de Bico", course: "salada", calories: 150, protein: 8, carbs: 22, fiber: 6, cost: 2.4, tag: "sugerido-ia", Icon: Leaf },
  { id: "fruta-dia", name: "Fruta da Estação", course: "sobremesa", calories: 80, protein: 1, carbs: 20, fiber: 3, cost: 1.2, tag: "sugerido-ia", Icon: Apple },
  { id: "pudim", name: "Pudim de Leite", course: "sobremesa", calories: 240, protein: 5, carbs: 36, fiber: 0, cost: 2.0, Icon: Apple },
];

const DISH_BY_ID: Record<string, Dish> = Object.fromEntries(
  DISH_BANK.map((d) => [d.id, d]),
);

const COURSE_LABELS: Record<Course, string> = {
  principal: "Prato principal",
  guarnicao: "Guarnição",
  salada: "Salada",
  sobremesa: "Sobremesa",
};

const INITIAL_MENU: Record<DayKey, Partial<Record<Course, string>>> = {
  seg: { principal: "frango-grelhado", salada: "salada-alface", sobremesa: "fruta-dia" },
  ter: { principal: "carne-panela", guarnicao: "feijao-carioca", salada: "salada-alface" },
  qua: { principal: "estrogonofe", guarnicao: "arroz-branco" },
  qui: { principal: "lasanha-integral", salada: "salada-grao" },
  sex: { principal: "tilapia", guarnicao: "legumes-vapor", salada: "salada-alface", sobremesa: "fruta-dia" },
};

// What the AI will fill in when "Gerar cardápio" runs. Picks the
// nutritionally-balanced combo with at least one IA-suggested dish per day.
const AI_GENERATED: Record<DayKey, Record<Course, string>> = {
  seg: { principal: "frango-grelhado", guarnicao: "arroz-integral", salada: "salada-grao", sobremesa: "fruta-dia" },
  ter: { principal: "tilapia", guarnicao: "legumes-vapor", salada: "salada-grao", sobremesa: "fruta-dia" },
  qua: { principal: "estrogonofe", guarnicao: "arroz-integral", salada: "salada-alface", sobremesa: "fruta-dia" },
  qui: { principal: "lasanha-integral", guarnicao: "legumes-vapor", salada: "salada-grao", sobremesa: "fruta-dia" },
  sex: { principal: "tilapia", guarnicao: "arroz-integral", salada: "salada-grao", sobremesa: "fruta-dia" },
};

const TARGETS = { calories: 750, protein: 35, carbs: 90, fiber: 8 };

// ============================================================================
// Component
// ============================================================================

type Mode = "planner" | "generating" | "reveal";

export function CardapioInteligenteMockup({ step }: CardapioInteligenteProps) {
  void step;
  type MenuState = Record<DayKey, Partial<Record<Course, string>>>;
  const [menu, setMenu] = useState<MenuState>(INITIAL_MENU);
  const [activeDay, setActiveDay] = useState<DayKey>("seg");
  const [activeSlot, setActiveSlot] = useState<Course>("principal");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [published, setPublished] = useState(false);
  const [mode, setMode] = useState<Mode>("planner");

  // ----- Day totals -----
  const dayDishes = useMemo(() => {
    const slots = menu[activeDay];
    return (Object.values(slots).filter(Boolean) as string[])
      .map((id) => DISH_BY_ID[id])
      .filter(Boolean);
  }, [menu, activeDay]);
  const dayTotals = useMemo(
    () =>
      dayDishes.reduce(
        (acc, d) => ({
          calories: acc.calories + d.calories,
          protein: acc.protein + d.protein,
          carbs: acc.carbs + d.carbs,
          fiber: acc.fiber + d.fiber,
          cost: acc.cost + d.cost,
        }),
        { calories: 0, protein: 0, carbs: 0, fiber: 0, cost: 0 },
      ),
    [dayDishes],
  );
  const balanced =
    dayTotals.calories >= TARGETS.calories * 0.85 &&
    dayTotals.calories <= TARGETS.calories * 1.15 &&
    dayTotals.protein >= TARGETS.protein * 0.85 &&
    dayTotals.fiber >= TARGETS.fiber * 0.7;

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      ciMode: mode,
      activeDayLabel: WEEKDAYS.find((w) => w.key === activeDay)?.long,
      activeDayKey: activeDay,
      dayTotalsCalories: dayTotals.calories,
      dayTotalsCost: dayTotals.cost,
      dayBalanced: balanced,
      menuApproved: approved,
      menuPublished: published,
    });
  }, [mode, activeDay, dayTotals, balanced, approved, published, patchLive]);

  const startAI = () => setMode("generating");

  const onAIComplete = () => {
    // Apply AI menu (with reveal animation in planner)
    setMenu(AI_GENERATED);
    setMode("reveal");
    // After reveal animation settles, return to planner
    setTimeout(() => setMode("planner"), 2400);
  };

  const setSlot = (day: DayKey, course: Course, dishId: string | null) => {
    setMenu((prev) => {
      const next = { ...prev[day] };
      if (dishId === null) delete next[course];
      else next[course] = dishId;
      return { ...prev, [day]: next };
    });
  };

  const openPicker = (slot: Course) => {
    setActiveSlot(slot);
    setPickerOpen(true);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <Header
        approved={approved}
        published={published}
        mode={mode}
        onApprove={() => setApproved(true)}
        onPublish={() => setPublished(true)}
        onGenerate={startAI}
      />

      <AnimatePresence mode="wait">
        {mode === "planner" || mode === "reveal" ? (
          <motion.main
            key="planner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid flex-1 grid-cols-[1fr_300px] overflow-hidden"
          >
            <section className="flex flex-col overflow-hidden p-5">
              <WeekTabs activeDay={activeDay} onPick={setActiveDay} menu={menu} />
              <DayPlanner
                day={activeDay}
                menu={menu[activeDay]}
                revealing={mode === "reveal"}
                onPick={openPicker}
                onRemove={(course) => setSlot(activeDay, course, null)}
              />
            </section>

            {/* v13.16 — sidebar simplificada: era 4 painéis empilhados
                (AILiveAssistant + Nutrição + Custo + Workflow), virando
                "bagunça". Agora apenas 2 painéis essenciais:
                AILiveAssistant (que já consolida balanço + custo + estoque)
                + WorkflowPanel (status de aprovação). Nutrição e Custo
                detalhados ficam acessíveis ao expandir, não default. */}
            <aside className="flex flex-col gap-4 overflow-y-auto border-l border-brand/8 bg-gradient-to-b from-white via-white to-brand-ghost/30 p-5">
              <AILiveAssistant
                balanced={balanced}
                totals={dayTotals}
                approved={approved}
              />
              <CostPanel totals={dayTotals} />
              <WorkflowPanel approved={approved} published={published} />
            </aside>
          </motion.main>
        ) : (
          <GeneratingScreen key="gen" onComplete={onAIComplete} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pickerOpen && (
          <DishPickerModal
            slot={activeSlot}
            onClose={() => setPickerOpen(false)}
            onPick={(dish) => {
              setSlot(activeDay, dish.course, dish.id);
              setPickerOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Header
// ============================================================================

function Header({
  approved,
  published,
  mode,
  onApprove,
  onPublish,
  onGenerate,
}: {
  approved: boolean;
  published: boolean;
  mode: Mode;
  onApprove: () => void;
  onPublish: () => void;
  onGenerate: () => void;
}) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-brand/8 bg-white px-5">
      <div className="flex items-center gap-3">
        <Image src="/logo-teknisa.svg" alt="Teknisa" width={92} height={17} />
        <span className="h-5 w-px bg-neutral-200" />
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
              boxShadow:
                "0 4px 12px rgba(2,7,136,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            <ChefHat size={16} strokeWidth={2.25} />
          </span>
          <div className="leading-tight">
            <p
              className="font-display text-[15px] font-bold text-neutral-900"
              style={{ letterSpacing: "-0.018em" }}
            >
              Cardápio Inteligente
            </p>
            <p className="font-ui text-[11px] text-neutral-500">
              <span className="tabular-nums">Semana 26/05 a 30/05</span> · 4
              unidades sincronizadas
            </p>
          </div>
          <span
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.14em" }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-success"
            />
            ao vivo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          data-tour="ci-generate-ai"
          onClick={onGenerate}
          disabled={mode !== "planner"}
          className={cn(
            "relative inline-flex items-center gap-1.5 overflow-hidden rounded-md px-4 py-2.5 font-ui text-[13px] font-bold text-white shadow-brand",
            mode !== "planner" ? "opacity-50" : "",
          )}
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
          }}
        >
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles size={14} strokeWidth={2.25} />
            Gerar cardápio com IA
          </span>
          {/* Sweep highlight */}
          <motion.span
            aria-hidden
            initial={{ x: "-120%" }}
            animate={{ x: "120%" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            }}
          />
        </motion.button>
        <Button
          type="button"
          variant={approved ? "success" : "outline"}
          size="default"
          data-tour="ci-approve"
          onClick={onApprove}
          disabled={approved}
          className="h-11 px-4 text-[13px]"
        >
          <Check size={14} strokeWidth={2.5} />
          {approved ? "Aprovado" : "Aprovar"}
        </Button>
        <Button
          type="button"
          variant={published ? "success" : "default"}
          size="default"
          data-tour="ci-publish"
          onClick={onPublish}
          disabled={!approved || published}
          className="h-11 px-4 text-[13px]"
        >
          {published ? (
            <CheckCircle2 size={14} strokeWidth={2.5} />
          ) : (
            <Share2 size={14} strokeWidth={2.5} />
          )}
          {published ? "Publicado" : "Publicar"}
        </Button>
      </div>
    </header>
  );
}

// ============================================================================
// GENERATING SCREEN — the centerpiece
// ============================================================================

const PHASES = [
  { id: "data", label: "Reunir dados cadastrados", Icon: Database, ms: 1400 },
  { id: "params", label: "Confirmar parâmetros", Icon: SlidersHorizontal, ms: 1300 },
  { id: "gen", label: "Gerar cardápio", Icon: Brain, ms: 1800 },
] as const;

const INSIGHTS = [
  "Lendo histórico de 4 unidades · 12 meses",
  "Cruzando preferências da nutricionista",
  "Importando 240 fichas técnicas",
  "Avaliando custo médio por refeição",
  "Otimizando perfil nutricional do dia",
  "Balanceando fibras, proteína e calorias",
  "Selecionando pratos populares + novos",
  "Aplicando restrições contratuais",
  "Distribuindo variedade na semana",
  "Cardápio pronto para revisão",
];

function GeneratingScreen({ onComplete }: { onComplete: () => void }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [insightIdx, setInsightIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let acc = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASES.forEach((p, i) => {
      timers.push(
        setTimeout(() => {
          setPhaseIdx(i);
          setProgress((i + 1) / PHASES.length);
        }, acc),
      );
      acc += p.ms;
    });
    timers.push(setTimeout(onComplete, acc + 200));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Rotate live insights every 450ms
  useEffect(() => {
    const id = setInterval(() => {
      setInsightIdx((i) => (i + 1) % INSIGHTS.length);
    }, 450);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section
      key="generating"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      data-tour="ci-generating"
      className="relative flex flex-1 flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 50% 30%, #ffffff 0%, #f0f1fc 55%, #e8e9f8 100%)",
        color: "#1f2330",
      }}
    >
      <SoftDots />

      <PhaseStepper phaseIdx={phaseIdx} progress={progress} />

      <div
        data-tour="ci-ai-brain"
        className="relative flex flex-1 items-center justify-center"
      >
        <AnimatedAIBrain phaseIdx={phaseIdx} />
      </div>

      <div className="z-10 mb-10 px-10 text-center">
        <span
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5"
          style={{
            border: "1px solid rgba(2,7,136,0.10)",
            boxShadow: "0 2px 6px rgba(2,7,136,0.06)",
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-brand"
          />
          <span
            className="font-ui text-[10.5px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            IA processando
          </span>
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={insightIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-3 font-display text-[17px] font-bold text-neutral-900"
            style={{ letterSpacing: "-0.020em" }}
          >
            {INSIGHTS[insightIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ----- Soft floating dots background ----------------------------------------

function SoftDots() {
  // Deterministic soft brand-colored dots, very subtle.
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rng1 = (seed / 233280) * 100;
        const rng2 = ((seed * 1664525 + 1013904223) % 233280 / 233280) * 100;
        const rng3 = ((seed * 22695477 + 1) % 233280 / 233280);
        return {
          left: rng1,
          top: rng2,
          size: 4 + rng3 * 4,
          delay: rng3 * 4,
          duration: 4 + rng3 * 4,
        };
      }),
    [],
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {dots.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: "rgba(2,7,136,0.10)",
          }}
          animate={{ opacity: [0.15, 0.5, 0.15], y: [0, -8, 0] }}
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

// ----- 3-phase top stepper --------------------------------------------------

function PhaseStepper({
  phaseIdx,
  progress,
}: {
  phaseIdx: number;
  progress: number;
}) {
  return (
    <div className="z-10 px-10 pt-12">
      <div className="mx-auto flex max-w-[640px] items-center justify-between">
        {PHASES.map((p, i) => {
          const active = i === phaseIdx;
          const done = i < phaseIdx;
          return (
            <div key={p.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.span
                  className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white"
                  animate={{
                    scale: active ? [1, 1.08, 1] : 1,
                    borderColor: done
                      ? "#16a34a"
                      : active
                        ? "#020788"
                        : "rgba(2,7,136,0.15)",
                  }}
                  transition={{
                    scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  {done ? (
                    <Check size={22} strokeWidth={2.5} className="text-success" />
                  ) : (
                    <p.Icon
                      size={20}
                      strokeWidth={2}
                      className={active ? "text-brand" : "text-neutral-300"}
                    />
                  )}
                  {active && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(2,7,136,0.35)",
                          "0 0 0 14px rgba(2,7,136,0)",
                          "0 0 0 0 rgba(2,7,136,0.35)",
                        ],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </motion.span>
                <span
                  className={cn(
                    "font-ui text-[13px] font-bold",
                    active
                      ? "text-brand"
                      : done
                        ? "text-success"
                        : "text-neutral-400",
                  )}
                >
                  {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div className="mx-3 mb-7 flex-1">
                  <div className="relative h-0.5 rounded-full bg-brand/10">
                    <motion.span
                      className="block h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          progress >= (i + 1) / PHASES.length
                            ? "100%"
                            : phaseIdx === i
                              ? "60%"
                              : "0%",
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{
                        background:
                          phaseIdx >= i
                            ? "linear-gradient(90deg, #020788, #16a34a)"
                            : "transparent",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ----- AnimatedAIBrain ------------------------------------------------------
// v13.17 — substituído o "blue ball" anterior (bolinha boring) por um
// BENTO DE ANÁLISE temático: 6 cards mostrando dados reais que a IA está
// processando, cada um animado de forma própria. Muito mais bonito,
// temático com Cardápio Inteligente, e dá sensação real de "a IA tá
// trabalhando" — não só um spinner glorificado.

function AnimatedAIBrain({ phaseIdx }: { phaseIdx: number }) {
  return (
    <div
      className="grid w-full max-w-[560px] grid-cols-3 gap-3 px-6"
      style={{ gridAutoRows: "1fr" }}
    >
      <AnalysisTile
        title="Unidades"
        active={phaseIdx >= 0}
        delay={0.0}
        kind="units"
      />
      <AnalysisTile
        title="Fichas técnicas"
        active={phaseIdx >= 0}
        delay={0.15}
        kind="counter"
      />
      <AnalysisTile
        title="Histórico 12m"
        active={phaseIdx >= 0}
        delay={0.3}
        kind="bars"
      />
      <AnalysisTile
        title="Restrições"
        active={phaseIdx >= 1}
        delay={0.45}
        kind="checks"
      />
      <AnalysisTile
        title="Custo médio"
        active={phaseIdx >= 1}
        delay={0.6}
        kind="cost"
      />
      <AnalysisTile
        title="Combinações"
        active={phaseIdx >= 2}
        delay={0.75}
        kind="grid"
      />
    </div>
  );
}

function AnalysisTile({
  title,
  active,
  delay,
  kind,
}: {
  title: string;
  active: boolean;
  delay: number;
  kind: "units" | "counter" | "bars" | "checks" | "cost" | "grid";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: active ? 1 : 0.32, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-white p-3.5"
      style={{
        border: "1px solid rgba(2,7,136,0.06)",
        boxShadow: active
          ? "0 4px 16px rgba(2,7,136,0.08), inset 0 1px 0 rgba(255,255,255,0.6)"
          : "0 1px 2px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-ui text-[10.5px] font-bold uppercase text-brand"
          style={{ letterSpacing: "0.16em" }}
        >
          {title}
        </span>
        {active && (
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-success"
          />
        )}
      </div>

      <div className="flex flex-1 items-center">
        {kind === "units" && <UnitsViz active={active} />}
        {kind === "counter" && <CounterViz active={active} target={240} />}
        {kind === "bars" && <BarsViz active={active} />}
        {kind === "checks" && <ChecksViz active={active} />}
        {kind === "cost" && <CounterViz active={active} target={9.6} money />}
        {kind === "grid" && <GridViz active={active} />}
      </div>
    </motion.div>
  );
}

function UnitsViz({ active }: { active: boolean }) {
  return (
    <div className="flex w-full items-center justify-around">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          animate={
            active ? { scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] } : {}
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
          className="h-3 w-3 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
            boxShadow: "0 0 0 3px rgba(2,7,136,0.08)",
          }}
        />
      ))}
    </div>
  );
}

function CounterViz({
  active,
  target,
  money,
}: {
  active: boolean;
  target: number;
  money?: boolean;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  const display = money
    ? `R$ ${val.toFixed(2).replace(".", ",")}`
    : Math.round(val).toLocaleString("pt-BR");

  return (
    <p
      className="font-display text-[22px] font-bold tabular-nums leading-none text-neutral-900"
      style={{ letterSpacing: "-0.030em" }}
    >
      {display}
    </p>
  );
}

function BarsViz({ active }: { active: boolean }) {
  const heights = [40, 65, 55, 80, 70, 90];
  return (
    <div className="flex w-full items-end gap-0.5 h-8">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          initial={{ height: 0 }}
          animate={{ height: active ? `${h}%` : 0 }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex-1 rounded-t"
          style={{
            background:
              "linear-gradient(180deg, #3b42c4 0%, #020788 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
          }}
        />
      ))}
    </div>
  );
}

function ChecksViz({ active }: { active: boolean }) {
  return (
    <div className="flex w-full flex-col gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 + i * 0.15 }}
          className="flex items-center gap-1.5"
        >
          <span
            className="flex h-3 w-3 items-center justify-center rounded-full bg-success text-white"
            style={{ boxShadow: "0 0 0 2px rgba(22,163,74,0.15)" }}
          >
            <Check size={8} strokeWidth={3} />
          </span>
          <span
            className="h-1.5 flex-1 rounded-full bg-success/15"
          />
        </motion.div>
      ))}
    </div>
  );
}

function GridViz({ active }: { active: boolean }) {
  return (
    <div className="grid w-full grid-cols-5 gap-0.5">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25, delay: 0.02 * i }}
          className="aspect-square rounded-sm"
          style={{
            background:
              i % 3 === 0
                ? "linear-gradient(135deg, #020788 0%, #3b42c4 100%)"
                : i % 5 === 0
                  ? "#16a34a"
                  : "rgba(2,7,136,0.12)",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Week tabs
// ============================================================================

function WeekTabs({
  activeDay,
  onPick,
  menu,
}: {
  activeDay: DayKey;
  onPick: (d: DayKey) => void;
  menu: Record<DayKey, Partial<Record<Course, string>>>;
}) {
  return (
    <div
      data-tour="ci-week-grid"
      className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-card"
    >
      {WEEKDAYS.map((w) => {
        const isActive = w.key === activeDay;
        const filled = Object.values(menu[w.key]).filter(Boolean).length;
        return (
          <motion.button
            key={w.key}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(w.key)}
            className={cn(
              "relative flex flex-1 flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left transition-colors",
              isActive
                ? "bg-brand text-white shadow-brand"
                : "bg-brand-ghost/40 text-neutral-700 hover:bg-brand-ghost",
            )}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-ui text-[11px] font-bold uppercase tracking-wider opacity-80">
                {w.label}
              </span>
              <span className="font-ui text-[11px] tabular-nums opacity-70">
                {w.date}
              </span>
            </div>
            <span className="font-ui text-[12px] font-bold leading-none">
              {filled}/4 pratos
            </span>
            <span className="mt-1 flex w-full gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-1 flex-1 rounded-full"
                  style={{
                    background: isActive
                      ? i < filled
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.2)"
                      : i < filled
                        ? "#020788"
                        : "rgba(2,7,136,0.12)",
                  }}
                />
              ))}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Day planner
// ============================================================================

function DayPlanner({
  day,
  menu,
  revealing,
  onPick,
  onRemove,
}: {
  day: DayKey;
  menu: Partial<Record<Course, string>>;
  revealing: boolean;
  onPick: (slot: Course) => void;
  onRemove: (slot: Course) => void;
}) {
  const slots: Course[] = ["principal", "guarnicao", "salada", "sobremesa"];
  const dayInfo = WEEKDAYS.find((w) => w.key === day);

  return (
    <div className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-ui text-[16px] font-bold text-neutral-900">
          {dayInfo?.long}
        </h2>
        <span className="flex items-center gap-1 text-[11px] text-neutral-500">
          <Calendar size={12} strokeWidth={2.25} />
          {dayInfo?.date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot, i) => {
          const dishId = menu[slot];
          const dish = dishId ? DISH_BY_ID[dishId] : null;
          return (
            <SlotCard
              key={slot}
              slot={slot}
              dish={dish}
              revealDelay={revealing ? i * 0.12 : 0}
              revealing={revealing}
              onPick={() => onPick(slot)}
              onRemove={() => onRemove(slot)}
            />
          );
        })}
      </div>
    </div>
  );
}

function SlotCard({
  slot,
  dish,
  revealDelay,
  revealing,
  onPick,
  onRemove,
}: {
  slot: Course;
  dish: Dish | null;
  revealDelay: number;
  revealing: boolean;
  onPick: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      className="relative flex flex-col gap-2 rounded-2xl border border-brand/8 bg-white p-3 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
          {COURSE_LABELS[slot]}
        </span>
        {dish && !revealing && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover prato"
            className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100"
          >
            <X size={12} strokeWidth={2.25} />
          </button>
        )}
      </div>

      {dish ? (
        <motion.button
          type="button"
          onClick={onPick}
          initial={revealing ? { opacity: 0, y: 12, scale: 0.94 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            revealing
              ? {
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                  delay: revealDelay,
                }
              : { duration: 0 }
          }
          className="flex flex-1 items-center gap-2 text-left"
        >
          <div
            className="flex h-12 w-12 flex-none items-center justify-center rounded-xl"
            style={{ background: "rgba(2,7,136,0.08)", color: "#020788" }}
          >
            <dish.Icon size={20} strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <p className="font-ui text-[12px] font-bold leading-tight text-neutral-900 line-clamp-2">
              {dish.name}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[10px] text-neutral-500 tabular-nums">
              <span className="inline-flex items-center gap-0.5">
                <Flame size={9} strokeWidth={2.25} />
                {dish.calories}kcal
              </span>
              <span>·</span>
              <span>R$ {dish.cost.toFixed(2).replace(".", ",")}</span>
            </div>
            {dish.tag && (
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider",
                  dish.tag === "sugerido-ia"
                    ? "bg-brand-ghost text-brand"
                    : dish.tag === "popular"
                      ? "bg-success/15 text-success"
                      : "bg-warning/15 text-warning",
                )}
              >
                {dish.tag === "sugerido-ia" && (
                  <Sparkles size={9} strokeWidth={2.5} />
                )}
                {dish.tag === "sugerido-ia"
                  ? "IA"
                  : dish.tag === "popular"
                    ? "Popular"
                    : "Novo"}
              </span>
            )}
          </div>
        </motion.button>
      ) : (
        <div className="flex flex-1 flex-col items-stretch gap-1.5">
          <p className="font-ui text-[12px] italic text-neutral-400">
            Slot vazio
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={onPick}
            className="flex items-center justify-center gap-1 rounded-md border border-brand/30 px-2 py-2 font-ui text-[11px] font-bold text-brand hover:bg-brand-ghost"
          >
            <Plus size={11} strokeWidth={2.5} />
            Escolher prato
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Right panels
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NutritionPanel({
  totals,
  balanced,
}: {
  totals: { calories: number; protein: number; carbs: number; fiber: number; cost: number };
  balanced: boolean;
}) {
  const rows: { label: string; value: number; target: number; unit: string; Icon: typeof Flame }[] = [
    { label: "Calorias", value: totals.calories, target: TARGETS.calories, unit: "kcal", Icon: Flame },
    { label: "Proteína", value: totals.protein, target: TARGETS.protein, unit: "g", Icon: Beef },
    { label: "Carboidratos", value: totals.carbs, target: TARGETS.carbs, unit: "g", Icon: Wheat },
    { label: "Fibras", value: totals.fiber, target: TARGETS.fiber, unit: "g", Icon: Leaf },
  ];
  return (
    <Card
      data-tour="ci-nutrition"
      className="p-3.5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
            <TrendingUp size={12} strokeWidth={2.25} />
          </span>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
            Análise nutricional
          </p>
        </div>
        <AnimatePresence mode="wait">
          {balanced ? (
            <motion.div
              key="ok"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              <Badge variant="success">
                <Check size={10} strokeWidth={2.5} />
                Balanceado
              </Badge>
            </motion.div>
          ) : (
            <motion.div
              key="off"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
            >
              <Badge variant="warning">Ajustar</Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((r) => {
          const pct = Math.min(120, r.target > 0 ? (r.value / r.target) * 100 : 0);
          const ok = pct >= 85 && pct <= 115;
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-medium text-neutral-700">
                  <r.Icon size={11} strokeWidth={2.25} className="text-neutral-400" />
                  {r.label}
                </span>
                <span
                  className={cn(
                    "font-ui font-bold tabular-nums",
                    ok ? "text-success" : "text-warning",
                  )}
                >
                  {r.value}
                  <span className="font-normal text-neutral-400">
                    {" "}/{r.target}
                    {r.unit}
                  </span>
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <motion.span
                  initial={false}
                  animate={{ width: `${Math.min(100, pct)}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-full rounded-full"
                  style={{ background: ok ? "#16a34a" : "#d97706" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CostPanel({ totals }: { totals: { cost: number } }) {
  const meals = 1840;
  const totalDay = totals.cost * meals;
  // 7-day cost trend (target: keep within R$ 9-10 per meal)
  const costSeries = [
    { x: "Seg", y: 9.4 },
    { x: "Ter", y: 9.1 },
    { x: "Qua", y: 9.6 },
    { x: "Qui", y: 9.3 },
    { x: "Sex", y: 9.7 },
    { x: "Sáb", y: 9.2 },
    { x: "Dom", y: Math.max(8, totals.cost) },
  ];
  return (
    <Card
      className="overflow-hidden p-0 shadow-elevated"
      style={{ borderColor: "rgba(2,7,136,0.06)" }}
    >
      <div className="flex items-start gap-2.5 px-4 pb-2.5 pt-4">
        <GradientIcon icon={<Users />} tone="brand" size={32} />
        <div className="min-w-0 flex-1">
          <p
            className="font-ui text-[10px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.18em" }}
          >
            Custo do dia
          </p>
          <p
            className="mt-0.5 font-ui text-[10.5px] text-neutral-500"
            style={{ letterSpacing: "-0.005em" }}
          >
            <span className="tabular-nums">
              {meals.toLocaleString("pt-BR")}
            </span>{" "}
            refeições previstas
          </p>
        </div>
      </div>

      {/* Stacked rows em vez de grid 2-col para evitar overflow no
          "Total do dia" (5+ dígitos com decimal não cabia em 130px) */}
      <div className="flex flex-col gap-2 px-4 pb-3">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="font-ui text-[10.5px] font-bold uppercase text-neutral-400"
            style={{ letterSpacing: "0.16em" }}
          >
            Por refeição
          </span>
          <motion.span
            key={totals.cost}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-display font-bold leading-none text-neutral-900 tabular-nums"
            style={{ fontSize: 22, letterSpacing: "-0.030em" }}
          >
            R$ {totals.cost.toFixed(2).replace(".", ",")}
          </motion.span>
        </div>
        <div
          className="flex items-baseline justify-between gap-2 border-t border-dashed pt-2"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <span
            className="font-ui text-[10.5px] font-bold uppercase text-neutral-400"
            style={{ letterSpacing: "0.16em" }}
          >
            Total do dia
          </span>
          <span
            className="font-ui font-bold leading-none text-neutral-700 tabular-nums whitespace-nowrap"
            style={{ fontSize: 15, letterSpacing: "-0.015em" }}
          >
            R${" "}
            {totalDay.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* 7-day trend area chart */}
      <div className="px-2 pb-3 pt-1">
        <p
          className="mb-1 px-1.5 font-ui text-[10.5px] font-bold uppercase text-neutral-400"
          style={{ letterSpacing: "0.16em" }}
        >
          Últimos 7 dias
        </p>
        <AreaChart
          data={costSeries}
          color="#020788"
          referenceY={9.5}
          referenceLabel="Meta R$ 9,50"
          yMin={8}
          yMax={11}
          aspectRatio="16/6"
          formatY={(v) => `R$ ${v.toFixed(2).replace(".", ",")}`}
        />
      </div>
    </Card>
  );
}

function WorkflowPanel({
  approved,
  published,
}: {
  approved: boolean;
  published: boolean;
}) {
  const steps = [
    { label: "Rascunho", done: true, active: false },
    { label: "Nutricionista", done: approved, active: !approved },
    { label: "Publicado", done: published, active: approved && !published },
  ];
  return (
    <Card className="p-3.5">
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
          <Check size={12} strokeWidth={2.25} />
        </span>
        <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          Workflow
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className={cn(
                "relative flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                s.done
                  ? "bg-success text-white"
                  : s.active
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-400",
              )}
            >
              {s.done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
              {s.active && (
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full ring-2 ring-brand/40"
                />
              )}
            </span>
            <span
              className={cn(
                "font-ui text-[12px] font-medium",
                s.done ? "text-success" : s.active ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// Manual dish picker
// ============================================================================

function DishPickerModal({
  slot,
  onClose,
  onPick,
}: {
  slot: Course;
  onClose: () => void;
  onPick: (d: Dish) => void;
}) {
  const options = DISH_BANK.filter((d) => d.course === slot);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] overflow-hidden rounded-2xl bg-white shadow-frame"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
          <div>
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
              Banco de pratos
            </p>
            <h3 className="font-ui text-[15px] font-bold text-neutral-900">
              {COURSE_LABELS[slot]}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100"
          >
            <X size={14} strokeWidth={2.25} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-3 py-2">
          {options.map((d) => (
            <motion.button
              key={d.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(d)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-brand-ghost"
            >
              <div
                className="flex h-10 w-10 flex-none items-center justify-center rounded-md"
                style={{ background: "rgba(2,7,136,0.08)", color: "#020788" }}
              >
                <d.Icon size={17} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-ui text-[12px] font-bold text-neutral-900">
                  {d.name}
                </p>
                <p className="text-[11px] text-neutral-500 tabular-nums">
                  {d.calories}kcal · R$ {d.cost.toFixed(2).replace(".", ",")}
                </p>
              </div>
              {d.tag === "sugerido-ia" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-ghost px-1.5 py-0.5 text-[10px] font-bold text-brand">
                  <Sparkles size={9} strokeWidth={2.5} />
                  IA
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// AILiveAssistant — feed de decisões da IA + score consolidado.
// Comunica "a IA está agindo agora, não você gerenciando uma planilha".
// Top da sidebar, acima dos paineis tradicionais (Nutrição / Custo / Workflow).
// ============================================================================

function AILiveAssistant({
  balanced,
  totals,
  approved,
}: {
  balanced: boolean;
  totals: { calories: number; protein: number; fiber: number; cost: number };
  approved: boolean;
}) {
  // Score derivado: balanceamento (40%) + custo (30%) + estoque (30%)
  const balanceScore = balanced ? 95 : 72;
  const costScore =
    totals.cost <= 9.5 ? 92 : totals.cost <= 10.5 ? 78 : 60;
  const stockScore = 88; // mock — refletindo "estoque OK na maioria dos ingredientes"
  const score = Math.round(
    balanceScore * 0.4 + costScore * 0.3 + stockScore * 0.3,
  );

  // 3 decisões recentes da IA
  const decisions: { t: string; msg: string; tone: "ok" | "warn" }[] = [
    {
      t: "agora",
      msg: "Substituí carne de panela por filé de tilápia (estoque baixo)",
      tone: "ok",
    },
    {
      t: "2min",
      msg: "Ajustei guarnição de quinta para baixar custo médio",
      tone: "ok",
    },
    {
      t: "5min",
      msg: balanced
        ? "Balanço nutricional dentro da meta"
        : "Fibras 18% abaixo do alvo — sugerindo salada extra",
      tone: balanced ? "ok" : "warn",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, #020788 0%, #1a1fa8 50%, #7c3aed 100%)",
        boxShadow:
          "0 12px 28px rgba(2,7,136,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
      }}
    >
      {/* Decorative orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.40), transparent 70%)",
        }}
      />
      {/* Header */}
      <div className="relative flex items-center justify-between px-3.5 pb-2 pt-3">
        <div className="flex items-center gap-2">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(255,255,255,0.30)",
                "0 0 0 6px rgba(255,255,255,0)",
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 text-white backdrop-blur"
          >
            <Sparkles size={11} strokeWidth={2.5} />
          </motion.span>
          <p
            className="font-ui text-[10px] font-bold uppercase text-white/85"
            style={{ letterSpacing: "0.10em" }}
          >
            Assistente IA
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-ui text-[10px] font-bold uppercase",
            approved ? "bg-white/15 text-white" : "bg-white/15 text-white",
          )}
          style={{ letterSpacing: "0.06em" }}
        >
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="h-1 w-1 rounded-full bg-success"
          />
          {approved ? "Monitorando" : "Otimizando agora"}
        </span>
      </div>

      {/* Score + breakdown */}
      <div className="relative flex items-center gap-3 px-3.5">
        <div className="relative flex h-[68px] w-[68px] flex-none items-center justify-center">
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle
              cx="34"
              cy="34"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="5"
            />
            <motion.circle
              cx="34"
              cy="34"
              r="28"
              fill="none"
              stroke="url(#ci-score-grad)"
              strokeWidth="5"
              strokeLinecap="round"
              transform="rotate(-90 34 34)"
              strokeDasharray={2 * Math.PI * 28}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 28 * (1 - score / 100),
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
            <defs>
              <linearGradient id="ci-score-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={score}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="font-ui text-[20px] font-bold leading-none text-white tabular-nums"
              style={{ letterSpacing: "-0.025em" }}
            >
              {score}
            </motion.span>
            <span
              className="mt-0.5 font-ui text-[7.5px] font-bold uppercase text-white/65"
              style={{ letterSpacing: "0.10em" }}
            >
              Score
            </span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {[
            { l: "Balanço", v: balanceScore },
            { l: "Custo", v: costScore },
            { l: "Estoque", v: stockScore },
          ].map((m) => (
            <div key={m.l} className="flex items-center gap-2">
              <span
                className="w-12 font-ui text-[10.5px] font-medium text-white/70"
                style={{ letterSpacing: "0.04em" }}
              >
                {m.l}
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.v}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      m.v >= 85
                        ? "#4ade80"
                        : m.v >= 70
                          ? "#fbbf24"
                          : "#f87171",
                  }}
                />
              </div>
              <span className="w-8 text-right font-ui text-[10.5px] font-bold tabular-nums text-white">
                {m.v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decisions feed */}
      <div className="relative mt-2 space-y-1 px-2 pb-3">
        {decisions.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i + 0.2, duration: 0.25 }}
            className="flex items-start gap-1.5 rounded-lg bg-white/8 px-2 py-1.5 backdrop-blur"
          >
            <span
              className={cn(
                "mt-1 h-1.5 w-1.5 flex-none rounded-full",
                d.tone === "ok" ? "bg-success" : "bg-warning",
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className="font-ui text-[10px] leading-snug text-white"
                style={{ letterSpacing: "-0.005em" }}
              >
                {d.msg}
              </p>
              <span className="font-ui text-[10px] font-medium tabular-nums text-white/55">
                Há {d.t}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
