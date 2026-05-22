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
  RefreshCw,
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
  Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

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

            <aside className="flex flex-col gap-4 overflow-y-auto border-l border-brand/8 bg-white p-4">
              <NutritionPanel totals={dayTotals} balanced={balanced} />
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
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-white"
            style={{ background: "#020788" }}
          >
            <ChefHat size={15} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-ui text-[15px] font-bold text-neutral-900">
              Cardápio Inteligente
            </p>
            <p className="font-ui text-[11px] text-neutral-500">
              Semana 26/05 a 30/05 · 4 unidades sincronizadas
            </p>
          </div>
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
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          data-tour="ci-approve"
          onClick={onApprove}
          disabled={approved}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2.5 font-ui text-[12px] font-bold transition-colors",
            approved
              ? "bg-success/15 text-success"
              : "border border-brand bg-white text-brand hover:bg-brand-ghost",
          )}
        >
          <Check size={13} strokeWidth={2.5} />
          {approved ? "Aprovado" : "Aprovar"}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          data-tour="ci-publish"
          onClick={onPublish}
          disabled={!approved || published}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2.5 font-ui text-[12px] font-bold text-white shadow-brand transition-colors",
            published
              ? "bg-success"
              : approved
                ? "bg-brand hover:bg-brand-light"
                : "bg-neutral-300",
          )}
        >
          {published ? (
            <CheckCircle2 size={13} strokeWidth={2.5} />
          ) : (
            <Share2 size={13} strokeWidth={2.5} />
          )}
          {published ? "Publicado" : "Publicar"}
        </motion.button>
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
          "radial-gradient(circle at 50% 35%, #161a3e 0%, #0a0c20 60%, #050610 100%)",
        color: "white",
      }}
    >
      <StarField />

      {/* Top stepper */}
      <PhaseStepper phaseIdx={phaseIdx} progress={progress} />

      {/* Center loader */}
      <div
        data-tour="ci-ai-brain"
        className="relative flex flex-1 items-center justify-center"
      >
        <AnimatedAIBrain phaseIdx={phaseIdx} />
      </div>

      {/* Live insight ticker */}
      <div className="z-10 mb-8 px-10 text-center">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[4px] text-white/40">
          Sistema neural Teknisa
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={insightIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-2 font-ui text-[16px] font-medium text-white"
          >
            {INSIGHTS[insightIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ----- Star field background ------------------------------------------------

function StarField() {
  // Deterministic stars (avoid hydration mismatch).
  const stars = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rng1 = (seed / 233280) * 100;
        const rng2 = ((seed * 1664525 + 1013904223) % 233280 / 233280) * 100;
        const rng3 = ((seed * 22695477 + 1) % 233280 / 233280);
        return {
          left: rng1,
          top: rng2,
          size: 1 + rng3 * 1.6,
          delay: rng3 * 4,
          duration: 2 + rng3 * 3,
        };
      }),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
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
          animate={{ opacity: [0.15, 0.6, 0.15] }}
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
                  className="relative flex h-12 w-12 items-center justify-center rounded-full border-2"
                  animate={{
                    scale: active ? [1, 1.08, 1] : 1,
                    borderColor: done
                      ? "#16a34a"
                      : active
                        ? "#a4b1ff"
                        : "rgba(255,255,255,0.18)",
                  }}
                  transition={{
                    scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  style={{
                    background: done
                      ? "rgba(22,163,74,0.18)"
                      : active
                        ? "rgba(164,177,255,0.16)"
                        : "rgba(255,255,255,0.04)",
                  }}
                >
                  {done ? (
                    <Check size={20} strokeWidth={2.5} className="text-success" />
                  ) : (
                    <p.Icon
                      size={18}
                      strokeWidth={2}
                      className={active ? "text-white" : "text-white/40"}
                    />
                  )}
                  {active && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(164,177,255,0.5)",
                          "0 0 0 14px rgba(164,177,255,0)",
                          "0 0 0 0 rgba(164,177,255,0.5)",
                        ],
                      }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.span>
                <span
                  className={cn(
                    "font-ui text-[12px] font-bold",
                    active
                      ? "text-white"
                      : done
                        ? "text-success"
                        : "text-white/40",
                  )}
                >
                  {p.label}
                </span>
              </div>
              {i < PHASES.length - 1 && (
                <div className="mx-3 mb-6 flex-1">
                  <div className="relative h-0.5 rounded-full bg-white/10">
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
                            ? "linear-gradient(90deg, #a4b1ff, #16a34a)"
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
// Center piece: circuit network + concentric rings + orbiting particles +
// pulsing brain.

function AnimatedAIBrain({ phaseIdx }: { phaseIdx: number }) {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radiusOuter = 160;
  const radiusInner = 110;
  // 8 nodes around the circle for the circuit pattern
  const nodes = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(a) * radiusOuter,
          y: cy + Math.sin(a) * radiusOuter,
          delay: i * 0.18,
          angle: a,
        };
      }),
    [cx, cy],
  );
  // Inner circuit hex
  const innerNodes = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return {
          x: cx + Math.cos(a) * radiusInner,
          y: cy + Math.sin(a) * radiusInner,
          angle: a,
        };
      }),
    [cx, cy],
  );

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer halo */}
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(164,177,255,0.35) 0%, transparent 65%)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
      >
        <defs>
          <radialGradient id="ai-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a4b1ff" />
            <stop offset="60%" stopColor="#3b42c4" />
            <stop offset="100%" stopColor="#020788" />
          </radialGradient>
          <linearGradient id="ai-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a4b1ff" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#a4b1ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a4b1ff" stopOpacity="0.05" />
          </linearGradient>
          <filter id="ai-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer dashed ring (rotating slowly) */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radiusOuter + 18}
          fill="none"
          stroke="rgba(164,177,255,0.25)"
          strokeWidth={1}
          strokeDasharray="2 8"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Mid ring (counter-rotating) */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radiusOuter}
          fill="none"
          stroke="rgba(164,177,255,0.4)"
          strokeWidth={1.4}
          strokeDasharray="14 6"
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Inner ring */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radiusInner}
          fill="none"
          stroke="rgba(164,177,255,0.55)"
          strokeWidth={1}
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Circuit lines — outer nodes to inner hex (cross pattern) */}
        {nodes.map((n, i) => {
          const target = innerNodes[i % innerNodes.length];
          return (
            <motion.line
              key={`line-${i}`}
              x1={n.x}
              y1={n.y}
              x2={target.x}
              y2={target.y}
              stroke="url(#ai-line)"
              strokeWidth={1.2}
              animate={{ opacity: [0.2, 0.85, 0.2] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Circuit lines — hex perimeter */}
        {innerNodes.map((n, i) => {
          const next = innerNodes[(i + 1) % innerNodes.length];
          return (
            <motion.line
              key={`hex-${i}`}
              x1={n.x}
              y1={n.y}
              x2={next.x}
              y2={next.y}
              stroke="rgba(164,177,255,0.45)"
              strokeWidth={1}
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Outer node dots */}
        {nodes.map((n, i) => (
          <motion.g key={`node-${i}`}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={4}
              fill="#a4b1ff"
              filter="url(#ai-glow)"
              animate={{
                r: [3, 5.5, 3],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: n.delay,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        ))}

        {/* Sweeping beam */}
        <motion.line
          x1={cx}
          y1={cy}
          x2={cx + radiusOuter + 30}
          y2={cy}
          stroke="rgba(164,177,255,0.7)"
          strokeWidth={2}
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            filter: "drop-shadow(0 0 8px rgba(164,177,255,0.6))",
          }}
        />

        {/* Beam fade trail */}
        <motion.path
          d={`M ${cx} ${cy} L ${cx + radiusOuter + 30} ${cy}`}
          fill="none"
          stroke="url(#ai-line)"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.4}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </svg>

      {/* Core: brain icon with breathing pulse */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.span
          className="relative flex h-24 w-24 items-center justify-center rounded-full text-white"
          style={{
            background:
              "radial-gradient(circle, #a4b1ff 0%, #3b42c4 55%, #020788 100%)",
            boxShadow:
              "0 0 40px rgba(164,177,255,0.55), 0 0 80px rgba(164,177,255,0.25)",
          }}
          animate={{
            boxShadow: [
              "0 0 40px rgba(164,177,255,0.55), 0 0 80px rgba(164,177,255,0.25)",
              "0 0 60px rgba(164,177,255,0.75), 0 0 120px rgba(164,177,255,0.35)",
              "0 0 40px rgba(164,177,255,0.55), 0 0 80px rgba(164,177,255,0.25)",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phaseIdx}
              initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
            >
              {(() => {
                const Ic = PHASES[phaseIdx]?.Icon ?? Brain;
                return <Ic size={36} strokeWidth={1.75} />;
              })()}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.div>

      {/* Orbiting particles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute left-1/2 top-1/2 h-2 w-2"
          style={{ marginLeft: -4, marginTop: -4 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 4 + i * 1.4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <span
            className="block h-2 w-2 rounded-full"
            style={{
              background: "#a4b1ff",
              boxShadow: "0 0 10px rgba(164,177,255,0.7)",
              transform: `translate(${130 + i * 20}px, 0)`,
            }}
          />
        </motion.div>
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
                  "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
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
    <div
      data-tour="ci-nutrition"
      className="rounded-2xl border border-brand/8 bg-white p-3.5 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
            <TrendingUp size={12} strokeWidth={2.25} />
          </span>
          <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-brand">
            Análise nutricional
          </p>
        </div>
        <AnimatePresence mode="wait">
          {balanced ? (
            <motion.span
              key="ok"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success"
            >
              <Check size={10} strokeWidth={2.5} />
              Balanceado
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-warning"
            >
              Ajustar
            </motion.span>
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
    </div>
  );
}

function CostPanel({ totals }: { totals: { cost: number } }) {
  const meals = 1840;
  const totalDay = totals.cost * meals;
  return (
    <div className="rounded-2xl border border-brand/8 bg-white p-3.5 shadow-card">
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
          <Users size={12} strokeWidth={2.25} />
        </span>
        <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-brand">
          Custo do dia
        </p>
      </div>
      <p className="mt-2 font-ui text-[11px] text-neutral-500">
        {meals.toLocaleString("pt-BR")} refeições previstas
      </p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-[11px] text-neutral-500">Por refeição</p>
          <p
            className="font-ui text-[20px] font-bold tabular-nums"
            style={{ color: "#020788" }}
          >
            R$ {totals.cost.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-neutral-500">Total dia</p>
          <p className="font-ui text-[15px] font-bold text-neutral-700 tabular-nums">
            R${" "}
            {totalDay.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
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
    <div className="rounded-2xl border border-brand/8 bg-white p-3.5 shadow-card">
      <div className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-white">
          <Check size={12} strokeWidth={2.25} />
        </span>
        <p className="font-ui text-[12px] font-bold uppercase tracking-wider text-brand">
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
    </div>
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

// Reference exports for unused icons to keep tree-shaking honest
export { Zap, RefreshCw };
