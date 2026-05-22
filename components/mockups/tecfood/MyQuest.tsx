"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Salad,
  Clock,
  CheckCircle2,
  ChevronRight,
  Wifi,
  UserRound,
  Apple,
  Leaf,
  Wheat,
  Beef,
  Utensils,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useTourLive } from "@/lib/tourState";

interface MyQuestProps {
  step: number;
}

// ============================================================================
// Data
// ============================================================================

interface MealOption {
  id: string;
  course: "principal" | "guarnicao" | "salada" | "sobremesa";
  label: string;
  Icon: typeof Beef;
}

const TODAY_OPTIONS: Record<string, MealOption[]> = {
  principal: [
    { id: "frango", course: "principal", label: "Frango grelhado com ervas", Icon: Beef },
    { id: "tilapia", course: "principal", label: "Filé de tilápia ao limão", Icon: Beef },
    { id: "lasanha", course: "principal", label: "Lasanha integral de espinafre", Icon: Beef },
  ],
  guarnicao: [
    { id: "arroz", course: "guarnicao", label: "Arroz integral", Icon: Wheat },
    { id: "legumes", course: "guarnicao", label: "Legumes no vapor", Icon: Leaf },
    { id: "feijao", course: "guarnicao", label: "Feijão carioca", Icon: Wheat },
  ],
  salada: [
    { id: "mix", course: "salada", label: "Mix de folhas com tomate", Icon: Leaf },
    { id: "grao", course: "salada", label: "Salada de grão de bico", Icon: Leaf },
  ],
  sobremesa: [
    { id: "fruta", course: "sobremesa", label: "Fruta da estação", Icon: Apple },
    { id: "pudim", course: "sobremesa", label: "Pudim de leite", Icon: Apple },
  ],
};

interface Slot {
  id: string;
  label: string;
  capacity: number;
  taken: number;
  suggested?: boolean;
}

const SLOTS: Slot[] = [
  { id: "1130", label: "11:30", capacity: 80, taken: 64 },
  { id: "1200", label: "12:00", capacity: 80, taken: 72 },
  { id: "1230", label: "12:30", capacity: 80, taken: 38, suggested: true },
  { id: "1300", label: "13:00", capacity: 80, taken: 12 },
];

type Course = "principal" | "guarnicao" | "salada" | "sobremesa";

// ============================================================================
// Component
// ============================================================================

export function MyQuestMockup({ step }: MyQuestProps) {
  void step;
  const [selection, setSelection] = useState<Partial<Record<Course, string>>>({
    principal: "frango",
    guarnicao: "arroz",
    salada: "mix",
  });
  const [slotId, setSlotId] = useState<string>("1230");
  const [stage, setStage] = useState<"identify" | "pick" | "schedule" | "confirmed">(
    "identify",
  );

  const slot = SLOTS.find((s) => s.id === slotId);
  const completion = Object.values(selection).filter(Boolean).length;

  const patchLive = useTourLive((s) => s.patch);
  useEffect(() => {
    const items = (["principal", "guarnicao", "salada", "sobremesa"] as Course[])
      .map((c) => {
        const id = selection[c];
        const opt = id ? TODAY_OPTIONS[c].find((o) => o.id === id) : null;
        return opt ? { course: c, name: opt.label } : null;
      })
      .filter(Boolean);
    patchLive({
      mqStage: stage,
      mqSelectedSlot: slot?.label,
      mqSelectedItems: items,
      mqItemCount: completion,
      mqPassword: "B247",
    });
  }, [stage, selection, slot?.label, completion, patchLive]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <StatusBar />
      <Header />

      <main className="relative flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === "identify" && (
            <IdentifyView key="id" onAdvance={() => setStage("pick")} />
          )}
          {stage === "pick" && (
            <PickView
              key="pick"
              selection={selection}
              setSelection={(c, id) =>
                setSelection((p) => ({ ...p, [c]: id }))
              }
              onAdvance={() => setStage("schedule")}
            />
          )}
          {stage === "schedule" && (
            <ScheduleView
              key="sched"
              slotId={slotId}
              onPick={setSlotId}
              onConfirm={() => setStage("confirmed")}
            />
          )}
          {stage === "confirmed" && <ConfirmedView key="ok" slotLabel={slot?.label} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ============================================================================
// Header / status bar (kiosk feel)
// ============================================================================

function StatusBar() {
  return (
    <div className="flex items-center justify-between bg-brand px-3 py-1.5 text-white">
      <div className="flex items-center gap-2">
        <Image
          src="/logo-teknisa-white.svg"
          alt="Teknisa"
          width={56}
          height={10}
          className="select-none opacity-90"
        />
        <span className="text-[9px] font-medium uppercase tracking-wider opacity-75">
          Restaurante Berrini
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] tabular-nums opacity-80">12:14</span>
        <Wifi size={10} strokeWidth={2.5} className="opacity-80" />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b border-brand/8 bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-white"
          style={{ background: "#020788" }}
        >
          <Salad size={15} strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <p className="font-ui text-[12px] font-bold text-neutral-900">
            MyQuest
          </p>
          <p className="font-ui text-[9px] text-neutral-500">
            Reserve sua refeição no totem
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Aberto
      </span>
    </div>
  );
}

// ============================================================================
// Identify stage (CPF or matrícula)
// ============================================================================

function IdentifyView({ onAdvance }: { onAdvance: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 px-5"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl text-white shadow-brand"
        style={{
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 60%, #3b42c4 100%)",
        }}
      >
        <UserRound size={36} strokeWidth={1.5} />
      </motion.div>
      <div className="text-center">
        <p className="font-ui text-[16px] font-bold text-neutral-900">
          Identifique-se
        </p>
        <p className="mt-1 text-[11px] text-neutral-500">
          Aproxime o crachá ou toque para usar matrícula
        </p>
      </div>

      <motion.button
        type="button"
        data-tour="mq-checkin"
        whileTap={{ scale: 0.96 }}
        onClick={onAdvance}
        className="w-full max-w-[240px] rounded-xl bg-brand py-3 font-ui text-[13px] font-bold text-white shadow-brand"
      >
        Tocar para iniciar
      </motion.button>

      <div className="flex items-center gap-3 text-[10px] text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Matrícula 28471
        </span>
        <span>·</span>
        <span>Mariana Costa</span>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Pick view — choose the dishes for today's meal
// ============================================================================

function PickView({
  selection,
  setSelection,
  onAdvance,
}: {
  selection: Partial<Record<Course, string>>;
  setSelection: (c: Course, id: string) => void;
  onAdvance: () => void;
}) {
  const COURSES: { id: Course; label: string }[] = [
    { id: "principal", label: "Prato principal" },
    { id: "guarnicao", label: "Guarnição" },
    { id: "salada", label: "Salada" },
    { id: "sobremesa", label: "Sobremesa" },
  ];
  const completion = Object.values(selection).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col"
    >
      <div className="border-b border-brand/8 bg-brand-ghost px-4 py-2">
        <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
          Cardápio de hoje
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          Quinta-feira · 29/05
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Monte seu prato
          </p>
          <p className="font-ui text-[10px] font-bold text-brand tabular-nums">
            {completion}/4
          </p>
        </div>
        <div data-tour="mq-pick" className="space-y-2">
          {COURSES.map((c) => {
            const selected = selection[c.id];
            return (
              <div
                key={c.id}
                className="rounded-xl border border-brand/8 bg-white p-2.5"
              >
                <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
                  {c.label}
                </p>
                <div className="mt-1.5 space-y-1">
                  {TODAY_OPTIONS[c.id].map((opt) => {
                    const active = selected === opt.id;
                    return (
                      <motion.button
                        key={opt.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelection(c.id, opt.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md border-2 px-2 py-1.5 text-left transition-colors",
                          active
                            ? "border-brand bg-brand-ghost"
                            : "border-neutral-200 bg-white hover:border-brand/30",
                        )}
                      >
                        <span
                          className="flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2"
                          style={{
                            borderColor: active ? "#020788" : "#cbd5e1",
                            background: active ? "#020788" : "white",
                          }}
                        >
                          {active && (
                            <span className="h-1 w-1 rounded-full bg-white" />
                          )}
                        </span>
                        <opt.Icon
                          size={12}
                          strokeWidth={1.75}
                          className={active ? "text-brand" : "text-neutral-400"}
                        />
                        <span
                          className={cn(
                            "font-ui text-[11px]",
                            active ? "font-bold text-brand" : "text-neutral-700",
                          )}
                        >
                          {opt.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-brand/8 bg-white px-3 py-2.5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAdvance}
          disabled={completion === 0}
          data-tour="mq-advance"
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-md py-2.5 font-ui text-[12px] font-bold text-white",
            completion === 0 ? "bg-neutral-300" : "bg-brand shadow-brand",
          )}
        >
          Escolher horário
          <ChevronRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Schedule — pick a time slot
// ============================================================================

function ScheduleView({
  slotId,
  onPick,
  onConfirm,
}: {
  slotId: string;
  onPick: (id: string) => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col"
    >
      <div className="border-b border-brand/8 bg-brand-ghost px-4 py-2">
        <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand">
          Horário da refeição
        </p>
        <p className="font-ui text-[12px] font-bold text-neutral-900">
          Escolha o melhor horário para você
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div data-tour="mq-schedule" className="space-y-2">
          {SLOTS.map((s) => {
            const active = slotId === s.id;
            const pct = (s.taken / s.capacity) * 100;
            const status =
              pct >= 90 ? "cheio" : pct >= 70 ? "moderado" : "livre";
            const statusTone = {
              cheio: { bg: "bg-danger/15", text: "text-danger", bar: "bg-danger" },
              moderado: {
                bg: "bg-warning/15",
                text: "text-warning",
                bar: "bg-warning",
              },
              livre: { bg: "bg-success/15", text: "text-success", bar: "bg-success" },
            }[status];

            return (
              <motion.button
                key={s.id}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onPick(s.id)}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all",
                  active
                    ? "border-brand bg-brand-ghost shadow-brand"
                    : "border-neutral-200 bg-white hover:border-brand/30",
                )}
              >
                <div
                  className="flex h-12 w-14 flex-none flex-col items-center justify-center rounded-lg"
                  style={{
                    background: active ? "#020788" : "rgba(2,7,136,0.08)",
                    color: active ? "white" : "#020788",
                  }}
                >
                  <Clock size={14} strokeWidth={2} className="opacity-80" />
                  <span className="font-ui text-[13px] font-bold tabular-nums">
                    {s.label}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        "font-ui text-[11px] font-bold",
                        active ? "text-brand" : "text-neutral-700",
                      )}
                    >
                      {s.taken}/{s.capacity} reservas
                    </p>
                    {s.suggested && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-ghost px-1.5 py-0.5 text-[8px] font-bold text-brand">
                        <Sparkles size={8} strokeWidth={2.5} />
                        Pico baixo
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-neutral-100">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4 }}
                      className={cn("block h-full rounded-full", statusTone.bar)}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                    statusTone.bg,
                    statusTone.text,
                  )}
                >
                  {status}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-brand/8 bg-white px-3 py-2.5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          data-tour="mq-confirm"
          className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand py-2.5 font-ui text-[12px] font-bold text-white shadow-brand"
        >
          Confirmar reserva
          <CheckCircle2 size={14} strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Confirmed — show senha + QR
// ============================================================================

function ConfirmedView({ slotLabel }: { slotLabel?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-5"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full text-white"
        style={{ background: "#16a34a" }}
      >
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2"
          style={{ borderColor: "#16a34a" }}
        />
        <CheckCircle2 size={42} strokeWidth={2} />
      </motion.div>

      <div className="text-center">
        <p className="font-ui text-[16px] font-bold text-neutral-900">
          Reserva confirmada
        </p>
        <p className="mt-1 text-[11px] text-neutral-500">
          Apresente o QR no acesso do refeitório
        </p>
      </div>

      <div
        data-tour="mq-result"
        className="w-full max-w-[240px] rounded-2xl border-2 border-dashed border-brand/30 bg-brand-ghost px-5 py-4 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
          Sua senha
        </p>
        <p className="mt-1 font-ui text-[34px] font-bold leading-none text-brand tabular-nums">
          B247
        </p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500">
          <Clock size={11} strokeWidth={2.25} />
          Horário
          <span className="font-bold text-neutral-700">{slotLabel ?? "12:30"}</span>
        </p>
        <div className="mx-auto mt-3 flex h-20 w-20 items-center justify-center rounded-lg bg-white p-2 ring-1 ring-brand/15">
          <QrCode size={64} strokeWidth={0.5} className="text-neutral-900" />
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-center text-[10px] text-neutral-500">
        <Utensils size={11} strokeWidth={2.25} className="text-neutral-400" />
        Bom apetite, Mariana!
      </p>
    </motion.div>
  );
}
