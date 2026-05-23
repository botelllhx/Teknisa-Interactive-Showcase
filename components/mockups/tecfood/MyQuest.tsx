"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Salad,
  Clock,
  CheckCircle2,
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
import { Badge } from "@/components/ui/shadcn";
import { RadialGauge } from "@/components/ui/charts";

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
  const [selection, setSelection] = useState<Partial<Record<Course, string>>>({
    principal: "frango",
    guarnicao: "arroz",
    salada: "mix",
  });
  const [slotId, setSlotId] = useState<string>("1230");

  // Stage derived from tour step: each step of the tour maps to a stage
  // of the kiosk flow. Click-driven advance (stopPropagation removed) keeps
  // both the React state and the tour in sync.
  const stage: "identify" | "pick" | "schedule" | "confirmed" =
    step <= 0
      ? "identify"
      : step === 1
        ? "pick"
        : step <= 3
          ? "schedule"
          : "confirmed";

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
          {stage === "identify" && <IdentifyView key="id" />}
          {stage === "pick" && (
            <PickView
              key="pick"
              selection={selection}
              setSelection={(c, id) =>
                setSelection((p) => ({ ...p, [c]: id }))
              }
            />
          )}
          {stage === "schedule" && (
            <ScheduleView
              key="sched"
              slotId={slotId}
              onPick={setSlotId}
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
      <Badge variant="success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Aberto
      </Badge>
    </div>
  );
}

// ============================================================================
// Identify stage (CPF or matrícula)
// ============================================================================

function IdentifyView() {
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
}: {
  selection: Partial<Record<Course, string>>;
  setSelection: (c: Course, id: string) => void;
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

      <div className="border-t border-brand/8 bg-white px-3 py-2.5 text-center text-[10px] text-neutral-500">
        Toque nas opções acima e toque em Continuar no tooltip
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
}: {
  slotId: string;
  onPick: (id: string) => void;
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
  // Position in queue + estimated wait — visualized as a RadialGauge
  const positionInQueue = 47;
  const queueCapacity = 120;
  const positionPct = ((queueCapacity - positionInQueue) / queueCapacity) * 100;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      {/* Hero confirmação compacta */}
      <motion.div
        initial={{ y: 6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-success/8 via-white to-success/4 p-3.5"
        style={{ border: "1px solid rgba(22,163,74,0.20)" }}
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 14 }}
          className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full bg-success text-white shadow-[0_4px_14px_rgba(22,163,74,0.30)]"
        >
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full ring-2 ring-success/40"
          />
          <CheckCircle2 size={22} strokeWidth={2.25} />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p
            className="font-ui text-[10px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.16em" }}
          >
            Reserva confirmada
          </p>
          <p
            className="mt-0.5 font-ui text-[15px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.01em" }}
          >
            Apresente o QR no acesso
          </p>
        </div>
      </motion.div>

      {/* Senha + QR card */}
      <div
        data-tour="mq-result"
        className="rounded-2xl bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/50 p-4 shadow-elevated"
        style={{ border: "1px solid rgba(2,7,136,0.10)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="font-ui text-[9px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.20em" }}
            >
              Sua senha
            </p>
            <p
              className="mt-0.5 font-ui text-[34px] font-bold leading-none text-brand tabular-nums"
              style={{ letterSpacing: "-0.04em" }}
            >
              B247
            </p>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-neutral-600">
              <Clock size={10} strokeWidth={2.5} className="text-brand" />
              Horário
              <span className="font-bold text-neutral-900 tabular-nums">
                {slotLabel ?? "12:30"}
              </span>
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-brand/15 shadow-subtle">
            <QrCode size={56} strokeWidth={0.5} className="text-neutral-900" />
          </div>
        </div>
      </div>

      {/* Posição na fila — radial gauge + timeline horizontal */}
      <div
        className="rounded-2xl bg-white p-3.5 shadow-subtle"
        style={{ border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex items-start gap-3">
          <RadialGauge
            value={positionPct}
            size={88}
            label={`#${positionInQueue}`}
            sublabel="Na fila"
            colors={{ from: "#3b42c4", to: "#020788" }}
          />
          <div className="min-w-0 flex-1 pt-1">
            <p
              className="font-ui text-[10px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.16em" }}
            >
              Sua vez em
            </p>
            <p
              className="mt-0.5 font-ui text-[20px] font-bold leading-none text-neutral-900 tabular-nums"
              style={{ letterSpacing: "-0.02em" }}
            >
              ~8 min
            </p>
            <p className="mt-1 font-ui text-[10px] leading-snug text-neutral-500">
              Refeitório Principal · Capacidade hoje 120
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-bold text-success">
                <span className="h-1 w-1 rounded-full bg-success" />
                Livre
              </span>
              <span className="font-ui text-[9px] text-neutral-400">
                73 saíram nos últimos 10min
              </span>
            </div>
          </div>
        </div>

        {/* Mini timeline horizontal: turnos do dia */}
        <div
          aria-hidden
          className="mt-3 grid grid-cols-6 gap-0.5"
        >
          {[
            { l: "11:30", pct: 100 },
            { l: "12:00", pct: 100 },
            { l: "12:30", pct: 70 },
            { l: "13:00", pct: 30 },
            { l: "13:30", pct: 10 },
            { l: "14:00", pct: 0 },
          ].map((s, i) => (
            <div key={s.l} className="flex flex-col items-center">
              <div className="h-7 w-full overflow-hidden rounded-md bg-neutral-100">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${s.pct}%` }}
                  transition={{ delay: 0.3 + 0.05 * i, duration: 0.5 }}
                  className={cn(
                    "w-full origin-bottom",
                    s.pct >= 90
                      ? "bg-danger/60"
                      : s.pct >= 50
                        ? "bg-warning/60"
                        : "bg-success/60",
                  )}
                  style={{ marginTop: `${100 - s.pct}%` }}
                />
              </div>
              <span className="mt-0.5 font-ui text-[8px] font-medium tabular-nums text-neutral-400">
                {s.l}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[10px] text-neutral-500">
        <Utensils size={11} strokeWidth={2.25} className="text-neutral-400" />
        Bom apetite, Mariana!
      </p>
    </motion.div>
  );
}
