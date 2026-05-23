"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Flame,
  Leaf,
  Wheat,
  Apple,
  Beef,
  Star,
  CheckCircle2,
  QrCode,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Send,
  Lock,
  ChevronLeft as Back,
  ChevronRight as Fwd,
  Share,
  BookOpen as Library,
  Copy,
  Type as Aa,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";
import { GradientIcon } from "@/components/ui/GradientIcon";

interface MyMenuProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

interface MenuDay {
  date: string;
  weekday: string;
  highlight: string;
  dishes: {
    course: "principal" | "guarnicao" | "salada" | "sobremesa";
    name: string;
    kcal: number;
    desc: string;
    tag?: "vegetariano" | "leve" | "popular";
    Icon: typeof Beef;
  }[];
}

const MENU_BY_DATE: Record<string, MenuDay> = {
  "26/05": {
    date: "26/05",
    weekday: "Segunda",
    highlight: "Frango grelhado com ervas",
    dishes: [
      { course: "principal", name: "Frango grelhado com ervas", kcal: 380, desc: "Filé suculento, ervas finas, ao forno", tag: "popular", Icon: Beef },
      { course: "guarnicao", name: "Arroz branco e feijão carioca", kcal: 320, desc: "Tradicional, soltinho", Icon: Wheat },
      { course: "salada", name: "Mix de folhas com tomate", kcal: 60, desc: "Alface, rúcula, tomate cereja", tag: "leve", Icon: Leaf },
      { course: "sobremesa", name: "Fruta da estação", kcal: 80, desc: "Melão, mamão ou manga", tag: "leve", Icon: Apple },
    ],
  },
  "27/05": {
    date: "27/05",
    weekday: "Terça",
    highlight: "Carne de panela",
    dishes: [
      { course: "principal", name: "Carne de panela", kcal: 460, desc: "Cozida lentamente com cenoura e batata", Icon: Beef },
      { course: "guarnicao", name: "Arroz integral e feijão", kcal: 305, desc: "Versão integral, com mais fibras", Icon: Wheat },
      { course: "salada", name: "Salada de grão de bico", kcal: 150, desc: "Grão de bico, cebola roxa, cheiro verde", tag: "vegetariano", Icon: Leaf },
      { course: "sobremesa", name: "Pudim de leite", kcal: 240, desc: "Calda de caramelo", Icon: Apple },
    ],
  },
  "28/05": {
    date: "28/05",
    weekday: "Quarta",
    highlight: "Estrogonofe de frango",
    dishes: [
      { course: "principal", name: "Estrogonofe de frango", kcal: 520, desc: "Com batata palha à parte", tag: "popular", Icon: Beef },
      { course: "guarnicao", name: "Arroz branco", kcal: 180, desc: "Soltinho", Icon: Wheat },
      { course: "salada", name: "Mix de folhas", kcal: 60, desc: "Alface, rúcula", tag: "leve", Icon: Leaf },
    ],
  },
  "29/05": {
    date: "29/05",
    weekday: "Quinta",
    highlight: "Lasanha integral de espinafre",
    dishes: [
      { course: "principal", name: "Lasanha integral de espinafre", kcal: 410, desc: "Massa integral, ricota, espinafre", tag: "vegetariano", Icon: Beef },
      { course: "salada", name: "Salada de grão de bico", kcal: 150, desc: "Grão de bico, tomate, cebola roxa", tag: "vegetariano", Icon: Leaf },
    ],
  },
  "30/05": {
    date: "30/05",
    weekday: "Sexta",
    highlight: "Filé de tilápia ao limão",
    dishes: [
      { course: "principal", name: "Filé de tilápia ao limão", kcal: 320, desc: "Grelhado, com farofa de limão", tag: "leve", Icon: Beef },
      { course: "guarnicao", name: "Legumes no vapor", kcal: 90, desc: "Cenoura, abobrinha, brócolis", tag: "leve", Icon: Leaf },
      { course: "salada", name: "Mix de folhas com tomate", kcal: 60, desc: "Alface, rúcula, tomate", tag: "leve", Icon: Leaf },
      { course: "sobremesa", name: "Fruta da estação", kcal: 80, desc: "Variada", tag: "leve", Icon: Apple },
    ],
  },
};

const DATE_LIST = Object.keys(MENU_BY_DATE);

const TIME_SLOTS = [
  { id: "1130", label: "11:30", crowd: "Tranquilo" },
  { id: "1200", label: "12:00", crowd: "Cheio" },
  { id: "1230", label: "12:30", crowd: "Pico" },
  { id: "1300", label: "13:00", crowd: "Livre", suggested: true },
];

// ============================================================================
// Component
// ============================================================================

type Tab = "cardapio" | "reserva" | "feedback";

export function MyMenuMockup({ step }: MyMenuProps) {
  const [tab, setTab] = useState<Tab>("cardapio");
  const [activeDate, setActiveDate] = useState(DATE_LIST[3]); // start on 29/05 (Quinta)
  const [reservedSlot, setReservedSlot] = useState<string | null>(null);
  // Pre-fill rating + type so the "Enviar opinião" button is already
  // enabled when the tour reaches the feedback step. User can still
  // change everything; this just keeps the demo unblocked.
  const [feedback, setFeedback] = useState<{
    rating: number;
    type: "elogio" | "reclamacao" | "sugestao" | null;
    comment: string;
    sent: boolean;
  }>({ rating: 5, type: "elogio", comment: "", sent: false });

  // Tour drives the tab when crossing pillars. User taps still override
  // freely within the same step.
  useEffect(() => {
    if (step === 2) setTab("reserva");
    else if (step >= 3) setTab("feedback");
    else setTab("cardapio");
  }, [step]);

  const menu = MENU_BY_DATE[activeDate];

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    patchLive({
      mmTab: tab,
      mmDate: activeDate,
      mmWeekday: menu?.weekday,
      mmHighlight: menu?.highlight,
      mmReservedSlot: reservedSlot,
      mmRating: feedback.rating,
      mmFeedbackSent: feedback.sent,
    });
  }, [tab, activeDate, menu, reservedSlot, feedback, patchLive]);

  return (
    <div className="flex h-full w-full flex-col bg-white font-ui text-neutral-800">
      <StatusBar />
      <Header />
      <Tabs tab={tab} onPick={setTab} />

      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "cardapio" && (
            <MenuView
              key="menu"
              activeDate={activeDate}
              onPickDate={setActiveDate}
            />
          )}
          {tab === "reserva" && (
            <ReservaView
              key="res"
              activeDate={activeDate}
              reservedSlot={reservedSlot}
              onReserve={setReservedSlot}
            />
          )}
          {tab === "feedback" && (
            <FeedbackView
              key="fb"
              feedback={feedback}
              setFeedback={setFeedback}
            />
          )}
        </AnimatePresence>
      </main>

      <SafariBottomBar />
    </div>
  );
}

// ============================================================================
// Status bar + header + tabs
// ============================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-1 pb-0.5">
      <span className="font-ui text-[12px] font-bold text-neutral-900 tabular-nums">
        12:34
      </span>
      <div className="flex items-center gap-1 text-neutral-700">
        <span className="text-[10px] font-bold tracking-wide">5G</span>
        <span className="text-[10px] tabular-nums">94%</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b border-brand/8 px-4 py-2">
      <Image
        src="/logo-teknisa.svg"
        alt="Teknisa"
        width={42}
        height={8}
        className="select-none"
      />
      <div className="leading-tight text-center">
        <p className="font-ui text-[11px] font-bold text-brand">MyMenu</p>
        <p className="font-ui text-[8px] text-neutral-500">
          Restaurante Berrini
        </p>
      </div>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-ghost text-brand">
        <span className="font-ui text-[10px] font-bold">MC</span>
      </span>
    </div>
  );
}

function Tabs({ tab, onPick }: { tab: Tab; onPick: (t: Tab) => void }) {
  const items: { id: Tab; label: string; Icon: typeof Calendar }[] = [
    { id: "cardapio", label: "Cardápio", Icon: Calendar },
    { id: "reserva", label: "Reservar", Icon: Clock },
    { id: "feedback", label: "Opinião", Icon: Star },
  ];
  return (
    <div
      data-tour="mm-tabs"
      className="flex border-b border-brand/8 bg-white"
    >
      {items.map((i) => {
        const active = i.id === tab;
        return (
          <motion.button
            key={i.id}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(i.id)}
            data-tour={i.id === "feedback" ? "mm-tab-feedback" : undefined}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors",
              active ? "text-brand" : "text-neutral-400",
            )}
          >
            <i.Icon size={15} strokeWidth={active ? 2.5 : 2} />
            <span className="font-ui text-[10px] font-bold">{i.label}</span>
            {active && (
              <motion.span
                layoutId="mm-tab"
                className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Menu view — date picker + dishes list
// ============================================================================

function MenuView({
  activeDate,
  onPickDate,
}: {
  activeDate: string;
  onPickDate: (d: string) => void;
}) {
  const idx = DATE_LIST.indexOf(activeDate);
  const menu = MENU_BY_DATE[activeDate];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex h-full flex-col overflow-hidden"
    >
      <div
        data-tour="mm-date-picker"
        className="flex items-center justify-between border-b border-brand/8 bg-brand-ghost px-2 py-1.5"
      >
        <button
          type="button"
          onClick={() => idx > 0 && onPickDate(DATE_LIST[idx - 1])}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-brand",
            idx === 0 && "opacity-30",
          )}
          disabled={idx === 0}
        >
          <ChevronLeft size={14} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="font-ui text-[9px] font-bold uppercase tracking-wider text-brand">
            {menu.weekday}
          </p>
          <p className="font-ui text-[12px] font-bold text-neutral-900 tabular-nums">
            {menu.date}/2026
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            idx < DATE_LIST.length - 1 && onPickDate(DATE_LIST[idx + 1])
          }
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full text-brand",
            idx === DATE_LIST.length - 1 && "opacity-30",
          )}
          disabled={idx === DATE_LIST.length - 1}
        >
          <ChevronRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Mini calendar strip */}
      <div className="flex gap-1.5 overflow-x-auto px-3 py-2">
        {DATE_LIST.map((d) => {
          const m = MENU_BY_DATE[d];
          const active = d === activeDate;
          return (
            <motion.button
              key={d}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onPickDate(d)}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 transition-colors",
                active ? "bg-brand text-white shadow-brand" : "bg-brand-ghost/50 text-neutral-600",
              )}
            >
              <span className="font-ui text-[8px] font-bold uppercase tracking-wider opacity-80">
                {m.weekday.slice(0, 3)}
              </span>
              <span className="font-ui text-[12px] font-bold tabular-nums">
                {m.date.split("/")[0]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Dishes */}
      <div data-tour="mm-dishes" className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="mb-2 flex items-center justify-between">
          <p
            className="font-ui text-[10px] font-bold uppercase text-neutral-500"
            style={{ letterSpacing: "0.16em" }}
          >
            Cardápio do dia
          </p>
          <span
            className="font-ui text-[9px] font-medium text-neutral-400 tabular-nums"
          >
            {menu.dishes.length} itens
          </span>
        </div>
        <div className="space-y-1.5">
          {menu.dishes.map((d, i) => {
            const courseTone: "amber" | "success" | "brand" | "teal" =
              d.course === "principal"
                ? "amber"
                : d.course === "salada"
                  ? "success"
                  : d.course === "sobremesa"
                    ? "brand"
                    : "teal";
            const courseLabel =
              d.course === "principal"
                ? "Principal"
                : d.course === "guarnicao"
                  ? "Guarnição"
                  : d.course === "salada"
                    ? "Salada"
                    : "Sobremesa";
            return (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                whileHover={{ y: -1 }}
                className="group flex items-start gap-2.5 rounded-xl bg-white p-2.5 transition-shadow hover:shadow-subtle"
                style={{ border: "1px solid rgba(2,7,136,0.06)" }}
              >
                <GradientIcon icon={<d.Icon />} tone={courseTone} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="font-ui text-[11.5px] font-bold leading-tight text-neutral-900"
                      style={{ letterSpacing: "-0.005em" }}
                    >
                      {d.name}
                    </p>
                    <span className="flex flex-none items-center gap-0.5 font-ui text-[9px] font-bold text-neutral-600 tabular-nums">
                      <Flame size={9} strokeWidth={2.25} className="text-warning" />
                      {d.kcal}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[9.5px] leading-snug text-neutral-500">
                    {d.desc}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <span
                      className="inline-flex items-center rounded-full px-1.5 py-0.5 font-ui text-[8px] font-bold uppercase"
                      style={{
                        letterSpacing: "0.12em",
                        background: "rgba(2,7,136,0.06)",
                        color: "#020788",
                      }}
                    >
                      {courseLabel}
                    </span>
                    {d.tag && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-ui text-[8px] font-bold uppercase",
                          d.tag === "vegetariano"
                            ? "bg-success/12 text-success"
                            : d.tag === "leve"
                              ? "bg-teal-50 text-teal-700"
                              : "bg-warning/12 text-warning",
                        )}
                        style={{ letterSpacing: "0.12em" }}
                      >
                        {d.tag}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Reservation view
// ============================================================================

function ReservaView({
  activeDate,
  reservedSlot,
  onReserve,
}: {
  activeDate: string;
  reservedSlot: string | null;
  onReserve: (slot: string) => void;
}) {
  const menu = MENU_BY_DATE[activeDate];
  const selected = TIME_SLOTS.find((s) => s.id === reservedSlot);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="border-b border-brand/8 bg-brand-ghost px-3 py-1.5">
        <p className="font-ui text-[9px] font-bold uppercase tracking-wider text-brand">
          Reservar para
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          {menu.weekday} · {menu.date}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2.5">
        <p className="mb-1.5 font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Horários disponíveis
        </p>
        <div data-tour="mm-reserve" className="space-y-1.5">
          {TIME_SLOTS.map((s) => {
            const active = s.id === reservedSlot;
            return (
              <motion.button
                key={s.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onReserve(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border-2 p-2.5 text-left transition-all",
                  active
                    ? "border-brand bg-brand-ghost shadow-brand"
                    : "border-neutral-200 bg-white hover:border-brand/30",
                )}
              >
                <div
                  className="flex h-11 w-12 flex-none flex-col items-center justify-center rounded-md"
                  style={{
                    background: active ? "#020788" : "rgba(2,7,136,0.08)",
                    color: active ? "white" : "#020788",
                  }}
                >
                  <Clock size={11} strokeWidth={2} className="opacity-80" />
                  <span className="font-ui text-[12px] font-bold tabular-nums">
                    {s.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-ui text-[11px] font-bold",
                      active ? "text-brand" : "text-neutral-700",
                    )}
                  >
                    {s.crowd}
                  </p>
                  {s.suggested && (
                    <p className="text-[9px] text-brand">
                      Recomendado para você
                    </p>
                  )}
                </div>
                {active && (
                  <CheckCircle2
                    size={16}
                    strokeWidth={2.5}
                    className="text-brand"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 rounded-2xl border-2 border-dashed border-success/30 bg-success/5 p-3"
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-success">
                Reserva confirmada
              </p>
              <p className="mt-0.5 font-ui text-[12px] font-bold text-neutral-900">
                {menu.weekday} · {menu.date} às {selected.label}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-16 w-16 flex-none items-center justify-center rounded-md bg-white p-1.5 ring-1 ring-success/30">
                  <QrCode size={52} strokeWidth={0.5} className="text-neutral-900" />
                </div>
                <div>
                  <p className="text-[9px] text-neutral-500">QR de acesso</p>
                  <p className="font-ui text-[12px] font-bold text-neutral-900 tabular-nums">
                    R-2026-1247
                  </p>
                  <p className="mt-0.5 text-[9px] text-neutral-500">
                    Apresente no totem do refeitório
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Feedback view — elogio / reclamação / sugestão
// ============================================================================

function FeedbackView({
  feedback,
  setFeedback,
}: {
  feedback: {
    rating: number;
    type: "elogio" | "reclamacao" | "sugestao" | null;
    comment: string;
    sent: boolean;
  };
  setFeedback: (
    f: {
      rating: number;
      type: "elogio" | "reclamacao" | "sugestao" | null;
      comment: string;
      sent: boolean;
    },
  ) => void;
}) {
  const TYPES = [
    { id: "elogio", label: "Elogio", Icon: ThumbsUp, color: "#16a34a" },
    { id: "reclamacao", label: "Reclamação", Icon: AlertTriangle, color: "#d97706" },
    { id: "sugestao", label: "Sugestão", Icon: Lightbulb, color: "#020788" },
  ] as const;

  const PRESET_COMMENTS: Record<string, string[]> = {
    elogio: [
      "Carne no ponto perfeito hoje!",
      "Variedade da salada ótima",
      "Atendimento muito atencioso",
    ],
    reclamacao: [
      "Arroz estava frio",
      "Fila demorada às 12:30",
      "Faltou opção sem glúten",
    ],
    sugestao: [
      "Mais pratos vegetarianos",
      "Suco natural diariamente",
      "Espaço para alergia/intolerância no perfil",
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="flex h-full flex-col overflow-y-auto"
    >
      <div className="border-b border-brand/8 bg-brand-ghost px-3 py-1.5">
        <p className="font-ui text-[9px] font-bold uppercase tracking-wider text-brand">
          Sua opinião conta
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          Avalie a refeição de hoje
        </p>
      </div>

      <div className="px-3 py-3">
        <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Sua nota
        </p>
        <div data-tour="mm-rating" className="mt-1.5 flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={() => setFeedback({ ...feedback, rating: n })}
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
              style={{
                background:
                  n <= feedback.rating ? "rgba(2,7,136,0.1)" : "transparent",
              }}
            >
              <Star
                size={22}
                strokeWidth={1.75}
                className={cn(
                  n <= feedback.rating ? "text-brand fill-brand" : "text-neutral-300",
                )}
              />
            </motion.button>
          ))}
        </div>

        <p className="mt-3 font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
          Tipo de feedback
        </p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {TYPES.map((t) => {
            const active = feedback.type === t.id;
            return (
              <motion.button
                key={t.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  setFeedback({
                    ...feedback,
                    type: t.id as "elogio" | "reclamacao" | "sugestao",
                    comment: "",
                  })
                }
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2 text-center transition-all",
                )}
                style={{
                  borderColor: active ? t.color : "#e5e7eb",
                  background: active ? `${t.color}15` : "white",
                }}
              >
                <t.Icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: active ? t.color : "#6b7280" }}
                />
                <span
                  className="font-ui text-[10px] font-bold"
                  style={{ color: active ? t.color : "#6b7280" }}
                >
                  {t.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {feedback.type && !feedback.sent && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Toque em uma opção
            </p>
            <div className="mt-1.5 space-y-1.5">
              {PRESET_COMMENTS[feedback.type].map((c) => {
                const active = feedback.comment === c;
                return (
                  <motion.button
                    key={c}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFeedback({ ...feedback, comment: c })}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md border-2 px-2.5 py-2 text-left transition-all",
                      active
                        ? "border-brand bg-brand-ghost"
                        : "border-neutral-200 bg-white",
                    )}
                  >
                    <span
                      className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: active ? "#020788" : "#cbd5e1",
                        background: active ? "#020788" : "white",
                      }}
                    >
                      {active && <span className="h-1 w-1 rounded-full bg-white" />}
                    </span>
                    <span
                      className={cn(
                        "font-ui text-[11px]",
                        active ? "font-bold text-brand" : "text-neutral-700",
                      )}
                    >
                      {c}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {!feedback.sent ? (
          <motion.button
            type="button"
            data-tour="mm-send-feedback"
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              feedback.type && feedback.rating > 0
                ? setFeedback({ ...feedback, sent: true })
                : null
            }
            disabled={!feedback.type || feedback.rating === 0}
            className={cn(
              "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-3 font-ui text-[13px] font-bold text-white transition-all active:scale-[0.98]",
              feedback.type && feedback.rating > 0
                ? "bg-brand shadow-brand hover:-translate-y-[1px]"
                : "bg-neutral-300",
            )}
          >
            <Send size={14} strokeWidth={2.5} />
            Enviar opinião
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="mt-4 rounded-2xl border-2 border-dashed border-success/30 bg-success/5 px-4 py-3 text-center"
          >
            <CheckCircle2
              size={28}
              strokeWidth={2}
              className="mx-auto text-success"
            />
            <p className="mt-1 font-ui text-[12px] font-bold text-success">
              Obrigado pelo feedback!
            </p>
            <p className="mt-0.5 text-[10px] text-neutral-500">
              Sua opinião vai direto para o Cardápio Inteligente
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SafariBottomBar() {
  return (
    <div className="border-t border-neutral-200 bg-[#f5f5f7]">
      <div className="mx-3 my-1.5 flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <span className="text-neutral-500">
          <Aa size={13} strokeWidth={2.25} />
        </span>
        <span className="text-neutral-400">
          <Lock size={10} strokeWidth={2.25} />
        </span>
        <span className="flex-1 text-center text-[11px] text-neutral-700">
          mymenu.teknisa.com
        </span>
        <span className="text-neutral-400">
          <Copy size={11} strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex items-center justify-around px-4 pb-2 text-[#007aff]">
        <button>
          <Back size={18} strokeWidth={2} />
        </button>
        <button className="opacity-40">
          <Fwd size={18} strokeWidth={2} />
        </button>
        <button>
          <Share size={16} strokeWidth={2} />
        </button>
        <button>
          <Library size={16} strokeWidth={2} />
        </button>
        <button>
          <span className="grid h-4 w-4 grid-cols-2 gap-px">
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
            <span className="rounded-sm border border-[#007aff]" />
          </span>
        </button>
      </div>
    </div>
  );
}
