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
  // Principais
  { id: "frango-grelhado", name: "Frango Grelhado com Ervas", course: "principal", calories: 380, protein: 42, carbs: 6, fiber: 1, cost: 6.8, tag: "popular", Icon: Beef },
  { id: "carne-panela", name: "Carne de Panela", course: "principal", calories: 460, protein: 38, carbs: 14, fiber: 2, cost: 8.2, Icon: Beef },
  { id: "estrogonofe", name: "Estrogonofe de Frango", course: "principal", calories: 520, protein: 32, carbs: 28, fiber: 2, cost: 7.4, Icon: Beef },
  { id: "tilapia", name: "Filé de Tilápia ao Limão", course: "principal", calories: 320, protein: 38, carbs: 4, fiber: 1, cost: 9.8, tag: "sugerido-ia", Icon: Beef },
  { id: "lasanha-integral", name: "Lasanha Integral de Espinafre", course: "principal", calories: 410, protein: 22, carbs: 48, fiber: 6, cost: 6.4, tag: "novo", Icon: Beef },
  // Guarnições
  { id: "arroz-branco", name: "Arroz Branco", course: "guarnicao", calories: 180, protein: 4, carbs: 38, fiber: 1, cost: 1.2, Icon: Wheat },
  { id: "arroz-integral", name: "Arroz Integral", course: "guarnicao", calories: 165, protein: 4, carbs: 34, fiber: 4, cost: 1.8, tag: "sugerido-ia", Icon: Wheat },
  { id: "feijao-carioca", name: "Feijão Carioca", course: "guarnicao", calories: 140, protein: 9, carbs: 24, fiber: 8, cost: 1.4, Icon: Wheat },
  { id: "pure-mandioquinha", name: "Purê de Mandioquinha", course: "guarnicao", calories: 220, protein: 4, carbs: 32, fiber: 3, cost: 2.1, Icon: Wheat },
  { id: "legumes-vapor", name: "Legumes no Vapor", course: "guarnicao", calories: 90, protein: 3, carbs: 18, fiber: 6, cost: 2.4, tag: "sugerido-ia", Icon: Leaf },
  // Saladas
  { id: "salada-alface", name: "Mix de Folhas com Tomate", course: "salada", calories: 60, protein: 2, carbs: 10, fiber: 4, cost: 1.6, Icon: Leaf },
  { id: "salada-grao", name: "Salada de Grão de Bico", course: "salada", calories: 150, protein: 8, carbs: 22, fiber: 6, cost: 2.4, tag: "sugerido-ia", Icon: Leaf },
  // Sobremesas
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

// Segunda começa com guarnição vazia de propósito: é o slot onde o tour
// destaca o botão "Sugerir com IA" (data-tour="ci-add-dish") para
// demonstrar a sugestão inteligente.
const INITIAL_MENU: Record<DayKey, Partial<Record<Course, string>>> = {
  seg: { principal: "frango-grelhado", salada: "salada-alface", sobremesa: "fruta-dia" },
  ter: { principal: "carne-panela", guarnicao: "feijao-carioca", salada: "salada-alface" },
  qua: { principal: "estrogonofe", guarnicao: "arroz-branco" },
  qui: { principal: "lasanha-integral", salada: "salada-grao" },
  sex: { principal: "tilapia", guarnicao: "legumes-vapor", salada: "salada-alface", sobremesa: "fruta-dia" },
};

const TARGETS = { calories: 750, protein: 35, carbs: 90, fiber: 8 };

// ============================================================================
// Component
// ============================================================================

export function CardapioInteligenteMockup({ step }: CardapioInteligenteProps) {
  void step;
  type MenuState = Record<DayKey, Partial<Record<Course, string>>>;
  const [menu, setMenu] = useState<MenuState>(INITIAL_MENU);
  const [activeDay, setActiveDay] = useState<DayKey>("seg");
  const [activeSlot, setActiveSlot] = useState<Course>("principal");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Dish[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [approved, setApproved] = useState(false);
  const [published, setPublished] = useState(false);

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
      activeDayLabel: WEEKDAYS.find((w) => w.key === activeDay)?.long,
      activeDayKey: activeDay,
      dayTotalsCalories: dayTotals.calories,
      dayTotalsCost: dayTotals.cost,
      dayBalanced: balanced,
      menuApproved: approved,
      menuPublished: published,
      aiSuggestionsCount: aiSuggestions.length,
    });
  }, [activeDay, dayTotals, balanced, approved, published, aiSuggestions.length, patchLive]);

  const askAI = (slot: Course) => {
    setActiveSlot(slot);
    setAiOpen(true);
    setAiThinking(true);
    setAiSuggestions([]);
    setTimeout(() => {
      const pool = DISH_BANK.filter(
        (d) => d.course === slot && !Object.values(menu[activeDay]).includes(d.id),
      );
      const ranked = [...pool].sort((a, b) => {
        const aIA = a.tag === "sugerido-ia" ? 0 : 1;
        const bIA = b.tag === "sugerido-ia" ? 0 : 1;
        if (aIA !== bIA) return aIA - bIA;
        if (b.fiber !== a.fiber) return b.fiber - a.fiber;
        return a.cost - b.cost;
      });
      setAiSuggestions(ranked.slice(0, 3));
      setAiThinking(false);
    }, 1600);
  };

  const applySuggestion = (dish: Dish) => {
    setMenu((prev) => ({
      ...prev,
      [activeDay]: { ...prev[activeDay], [dish.course]: dish.id },
    }));
    setAiOpen(false);
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
        onApprove={() => setApproved(true)}
        onPublish={() => setPublished(true)}
      />

      <main className="grid flex-1 grid-cols-[1fr_300px] overflow-hidden">
        <section className="flex flex-col overflow-hidden p-5">
          <WeekTabs activeDay={activeDay} onPick={setActiveDay} menu={menu} />
          <DayPlanner
            day={activeDay}
            menu={menu[activeDay]}
            onAskAI={askAI}
            onPick={openPicker}
            onRemove={(course) => setSlot(activeDay, course, null)}
          />
        </section>

        <aside className="flex flex-col gap-4 overflow-y-auto border-l border-brand/8 bg-white p-4">
          <NutritionPanel totals={dayTotals} balanced={balanced} />
          <CostPanel totals={dayTotals} />
          <WorkflowPanel approved={approved} published={published} />
        </aside>
      </main>

      <AnimatePresence>
        {aiOpen && (
          <AISuggestionModal
            slot={activeSlot}
            thinking={aiThinking}
            suggestions={aiSuggestions}
            onClose={() => setAiOpen(false)}
            onApply={applySuggestion}
            onRefresh={() => askAI(activeSlot)}
          />
        )}
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
  onApprove,
  onPublish,
}: {
  approved: boolean;
  published: boolean;
  onApprove: () => void;
  onPublish: () => void;
}) {
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
            <ChefHat size={14} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-ui text-[13px] font-bold text-neutral-900">
              Cardápio Inteligente
            </p>
            <p className="font-ui text-[10px] text-neutral-500">
              Semana 26/05 a 30/05 · 4 unidades sincronizadas
            </p>
          </div>
        </div>
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-brand-ghost px-2 py-0.5 font-ui text-[10px] font-bold text-brand">
          <Sparkles size={10} strokeWidth={2.25} />
          Powered by IA
        </span>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          data-tour="ci-approve"
          onClick={onApprove}
          disabled={approved}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-ui text-[11px] font-bold transition-colors",
            approved
              ? "bg-success/15 text-success"
              : "border border-brand bg-white text-brand hover:bg-brand-ghost",
          )}
        >
          <Check size={13} strokeWidth={2.5} />
          {approved ? "Aprovado" : "Aprovar nutricionista"}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          data-tour="ci-publish"
          onClick={onPublish}
          disabled={!approved || published}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-ui text-[11px] font-bold text-white shadow-brand transition-colors",
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
          {published ? "Publicado" : "Publicar nas unidades"}
        </motion.button>
      </div>
    </header>
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
              <span className="font-ui text-[10px] font-bold uppercase tracking-wider opacity-80">
                {w.label}
              </span>
              <span className="font-ui text-[10px] tabular-nums opacity-70">
                {w.date}
              </span>
            </div>
            <span className="font-ui text-[11px] font-bold leading-none">
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
  onAskAI,
  onPick,
  onRemove,
}: {
  day: DayKey;
  menu: Partial<Record<Course, string>>;
  onAskAI: (slot: Course) => void;
  onPick: (slot: Course) => void;
  onRemove: (slot: Course) => void;
}) {
  const slots: Course[] = ["principal", "guarnicao", "salada", "sobremesa"];
  const dayInfo = WEEKDAYS.find((w) => w.key === day);

  return (
    <div className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-ui text-[15px] font-bold text-neutral-900">
          {dayInfo?.long}
        </h2>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <Calendar size={11} strokeWidth={2.25} />
          {dayInfo?.date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot, i) => {
          const dishId = menu[slot];
          const dish = dishId ? DISH_BY_ID[dishId] : null;
          const isAITarget = i === 1; // Guarnição: alvo do tour para sugerir IA
          return (
            <SlotCard
              key={slot}
              slot={slot}
              dish={dish}
              isAITarget={isAITarget}
              onAskAI={() => onAskAI(slot)}
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
  isAITarget,
  onAskAI,
  onPick,
  onRemove,
}: {
  slot: Course;
  dish: Dish | null;
  isAITarget: boolean;
  onAskAI: () => void;
  onPick: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      className="relative flex flex-col gap-2 rounded-2xl border border-brand/8 bg-white p-3 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
          {COURSE_LABELS[slot]}
        </span>
        {dish && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remover prato"
            className="flex h-5 w-5 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100"
          >
            <X size={11} strokeWidth={2.25} />
          </button>
        )}
      </div>

      {dish ? (
        <button
          type="button"
          onClick={onPick}
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
                  "mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                  dish.tag === "sugerido-ia"
                    ? "bg-brand-ghost text-brand"
                    : dish.tag === "popular"
                      ? "bg-success/15 text-success"
                      : "bg-warning/15 text-warning",
                )}
              >
                {dish.tag === "sugerido-ia" && (
                  <Sparkles size={8} strokeWidth={2.5} />
                )}
                {dish.tag === "sugerido-ia"
                  ? "Sugerido pela IA"
                  : dish.tag === "popular"
                    ? "Popular"
                    : "Novo"}
              </span>
            )}
          </div>
        </button>
      ) : (
        <div className="flex flex-1 flex-col items-stretch gap-1.5">
          <p className="font-ui text-[11px] italic text-neutral-400">
            Slot vazio
          </p>
          <div className="flex gap-1.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              data-tour={isAITarget ? "ci-add-dish" : undefined}
              onClick={onAskAI}
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-brand px-2 py-1.5 font-ui text-[10px] font-bold text-white shadow-brand"
            >
              <Sparkles size={11} strokeWidth={2.5} />
              Sugerir com IA
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onPick}
              className="flex items-center justify-center gap-1 rounded-md border border-brand/30 px-2 py-1.5 font-ui text-[10px] font-bold text-brand"
            >
              <Plus size={11} strokeWidth={2.5} />
              Escolher
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// Right panel
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
          <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
            Análise nutricional
          </p>
        </div>
        <AnimatePresence mode="wait">
          {balanced ? (
            <motion.span
              key="ok"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success"
            >
              <Check size={9} strokeWidth={2.5} />
              Balanceado
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warning"
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
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 font-medium text-neutral-700">
                  <r.Icon size={10} strokeWidth={2.25} className="text-neutral-400" />
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
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, pct)}%` }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
        <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
          Custo do dia
        </p>
      </div>
      <p className="mt-2 font-ui text-[10px] text-neutral-500">
        {meals.toLocaleString("pt-BR")} refeições previstas
      </p>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-neutral-500">Por refeição</p>
          <p
            className="font-ui text-[18px] font-bold tabular-nums"
            style={{ color: "#020788" }}
          >
            R$ {totals.cost.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-neutral-500">Total dia</p>
          <p className="font-ui text-[14px] font-bold text-neutral-700 tabular-nums">
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
        <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-brand">
          Workflow
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className={cn(
                "relative flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
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
                "font-ui text-[11px] font-medium",
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
// AI suggestion modal + PulseLoader (the "pulsando" loader the user asked for)
// ============================================================================

function AISuggestionModal({
  slot,
  thinking,
  suggestions,
  onClose,
  onApply,
  onRefresh,
}: {
  slot: Course;
  thinking: boolean;
  suggestions: Dish[];
  onClose: () => void;
  onApply: (d: Dish) => void;
  onRefresh: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/30 px-6 backdrop-blur-sm"
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
        <div
          className="relative overflow-hidden p-5 text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
          }}
        >
          <PulseField />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                <Sparkles size={11} strokeWidth={2.25} />
                IA Cardápio
              </p>
              <h3 className="mt-2 font-ui text-[16px] font-bold leading-tight">
                Sugestão de {COURSE_LABELS[slot].toLowerCase()}
              </h3>
              <p className="text-[11px] text-white/75">
                Combinando perfil nutricional, custo e popularidade
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white"
            >
              <X size={13} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4">
          <AnimatePresence mode="wait">
            {thinking ? (
              <PulseLoader key="pulse" />
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Top {suggestions.length} para essa posição
                  </p>
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-brand hover:bg-brand-ghost"
                  >
                    <RefreshCw size={10} strokeWidth={2.25} />
                    Rerodar
                  </button>
                </div>
                {suggestions.length === 0 ? (
                  <p className="py-6 text-center text-[11px] italic text-neutral-400">
                    Não restam pratos disponíveis nessa categoria.
                  </p>
                ) : (
                  suggestions.map((dish, i) => (
                    <motion.button
                      key={dish.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onApply(dish)}
                      className="flex w-full items-center gap-3 rounded-xl border border-brand/8 bg-white p-2.5 text-left transition-colors hover:bg-brand-ghost"
                    >
                      <div
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
                        style={{
                          background: "rgba(2,7,136,0.08)",
                          color: "#020788",
                        }}
                      >
                        <dish.Icon size={18} strokeWidth={1.75} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-ui text-[12px] font-bold text-neutral-900">
                          {dish.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-neutral-500 tabular-nums">
                          <span>{dish.calories}kcal</span>
                          <span>·</span>
                          <span>{dish.protein}g prot</span>
                          <span>·</span>
                          <span>R$ {dish.cost.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white"
                        style={{ background: "#020788" }}
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </span>
                    </motion.button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PulseLoader() {
  return (
    <motion.div
      key="pulse"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-8"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        {/* Outer breath rings */}
        {[0, 0.3, 0.6, 0.9].map((delay) => (
          <motion.span
            key={delay}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(2,7,136,0.22) 0%, transparent 70%)",
            }}
            animate={{ scale: [0.8, 1.6, 0.8], opacity: [0.45, 0, 0.45] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          />
        ))}
        {/* Core pulse */}
        <motion.span
          className="relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-brand"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
          }}
          animate={{
            scale: [1, 1.08, 1],
            boxShadow: [
              "0 0 0 0 rgba(2,7,136,0.4)",
              "0 0 0 14px rgba(2,7,136,0)",
              "0 0 0 0 rgba(2,7,136,0.4)",
            ],
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles size={22} strokeWidth={2} />
          </motion.span>
        </motion.span>
      </div>

      <div className="text-center">
        <p className="font-ui text-[13px] font-bold text-neutral-900">
          A IA está pensando...
        </p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-[11px] text-neutral-500"
        >
          Cruzando 240 pratos, custo e perfil nutricional do dia
        </motion.p>
      </div>
    </motion.div>
  );
}

function PulseField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute h-32 w-32 rounded-full"
          style={{
            top: `${20 + i * 10}%`,
            left: `${60 + i * 8}%`,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
          }}
          animate={{ scale: [0.7, 1.3, 0.7], opacity: [0.3, 0.1, 0.3] }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
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
      className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/30 px-6 backdrop-blur-sm"
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
            <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
              Banco de pratos
            </p>
            <h3 className="font-ui text-[14px] font-bold text-neutral-900">
              {COURSE_LABELS[slot]}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100"
          >
            <X size={13} strokeWidth={2.25} />
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
                <d.Icon size={16} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-ui text-[12px] font-bold text-neutral-900">
                  {d.name}
                </p>
                <p className="text-[10px] text-neutral-500 tabular-nums">
                  {d.calories}kcal · R$ {d.cost.toFixed(2).replace(".", ",")}
                </p>
              </div>
              {d.tag === "sugerido-ia" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-ghost px-1.5 py-0.5 text-[9px] font-bold text-brand">
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
