"use client";

import { motion } from "framer-motion";
import {
  UsersRound,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PortalGestorProps {
  step: number;
}

const TEAM_KPIS = [
  { label: "Equipe", value: "48" },
  { label: "Presença hoje", value: "94%", tone: "success" as const },
  { label: "Hora extra", value: "12h", tone: "warning" as const },
  { label: "Solicitações", value: "7" },
];

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const SHIFT_DATA = [
  { who: "Ana C.", days: [1, 1, 1, 1, 1, 0] },
  { who: "Carlos M.", days: [1, 1, 0, 1, 1, 1] },
  { who: "Beatriz S.", days: [1, 1, 1, 0, 1, 1] },
  { who: "Diego L.", days: [0, 1, 1, 1, 1, 0] },
];

const PUNCH_LIST = [
  { who: "Ana Costa", clock: "07:58 / 16:02", ot: "+0h", status: "ok" as const },
  { who: "Carlos Mello", clock: "08:12 / 17:30", ot: "+1h30", status: "warn" as const },
  { who: "Diego Lima", clock: "—", ot: "ausente", status: "danger" as const },
];

const REQUESTS = [
  { type: "Férias", who: "Mariana C.", when: "10–24 Jun" },
  { type: "Folga", who: "Lucas P.", when: "27/05" },
  { type: "Troca de turno", who: "Sofia A.", when: "23/05" },
];

export function PortalGestorMockup({ step }: PortalGestorProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <UsersRound size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Portal Gestor
            </p>
            <p className="text-[8px] text-neutral-500">
              Filial Centro · Maio 2026
            </p>
          </div>
        </div>
        <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[8px] font-semibold text-brand">
          Gestor: João C.
        </span>
      </header>

      <main className="flex-1 p-3">
        {step === 0 && <DashboardView />}
        {step === 1 && <ScheduleView />}
        {step === 2 && <PunchView />}
        {step === 3 && <RequestsView />}
        {step >= 4 && <ReportExportedView />}
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col gap-2"
    >
      <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
        Dashboard de equipe
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {TEAM_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-md bg-white p-2 shadow-card"
          >
            <p className="text-[7px] uppercase text-neutral-500">{kpi.label}</p>
            <p
              className={cn(
                "mt-0.5 font-display text-[14px] font-bold tabular-nums",
                kpi.tone === "success" && "text-success",
                kpi.tone === "warning" && "text-warning",
                !kpi.tone && "text-neutral-900",
              )}
            >
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 rounded-md bg-white p-2 shadow-card">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
          Presença · últimos 7 dias
        </p>
        <div className="mt-2 flex h-16 items-end gap-1.5">
          {[88, 92, 90, 95, 91, 94, 94].map((v, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.35, ease: "easeOut" }}
              style={{ height: `${v}%`, transformOrigin: "bottom" }}
              className={cn(
                "flex-1 rounded-t",
                i === 6 ? "bg-brand" : "bg-brand/30",
              )}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ScheduleView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
        Escala · semana 21
      </p>
      <div className="mt-2 rounded-md bg-white p-2 shadow-card">
        <div className="grid grid-cols-[80px_repeat(6,1fr)] items-center gap-1 border-b border-neutral-100 pb-1 text-[7px] font-semibold uppercase text-neutral-500">
          <span>Funcionário</span>
          {WEEK_DAYS.map((d) => (
            <span key={d} className="text-center">
              {d}
            </span>
          ))}
        </div>
        {SHIFT_DATA.map((row, i) => (
          <motion.div
            key={row.who}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="grid grid-cols-[80px_repeat(6,1fr)] items-center gap-1 border-b border-neutral-100 py-1 last:border-0"
          >
            <span className="text-[8px] font-semibold text-neutral-800">
              {row.who}
            </span>
            {row.days.map((d, j) => (
              <span
                key={j}
                className={cn(
                  "h-4 rounded text-center text-[7px] font-bold leading-4",
                  d
                    ? "bg-brand text-white"
                    : "bg-surface-raised text-neutral-400",
                )}
              >
                {d ? "T" : "—"}
              </span>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function PunchView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
        Espelho de ponto · hoje
      </p>
      <div className="mt-2 flex-1 rounded-md bg-white p-2 shadow-card">
        {PUNCH_LIST.map((p, i) => (
          <motion.div
            key={p.who}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center justify-between border-b border-neutral-100 py-1.5 last:border-0"
          >
            <div>
              <p className="text-[9px] font-semibold text-neutral-900">
                {p.who}
              </p>
              <p className="text-[8px] text-neutral-500">{p.clock}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[9px] font-bold text-neutral-700 tabular-nums">
                {p.ot}
              </span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  p.status === "ok" && "bg-success",
                  p.status === "warn" && "bg-warning",
                  p.status === "danger" && "bg-danger",
                )}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RequestsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col"
    >
      <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
        Solicitações pendentes
      </p>
      <div className="mt-2 space-y-1.5">
        {REQUESTS.map((r, i) => (
          <motion.div
            key={r.type}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center gap-2 rounded-md bg-white p-2 shadow-card"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-subtle text-brand">
              {r.type === "Férias" && <Calendar size={14} strokeWidth={2} />}
              {r.type === "Folga" && <Clock size={14} strokeWidth={2} />}
              {r.type === "Troca de turno" && (
                <AlertCircle size={14} strokeWidth={2} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-neutral-900">
                {r.type} · {r.who}
              </p>
              <p className="text-[8px] text-neutral-500">{r.when}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="rounded bg-brand px-2 py-1 text-[8px] font-bold text-white shadow-brand"
              >
                Aprovar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ReportExportedView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full flex-col items-center justify-center gap-3"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-white shadow-brand">
        <Download size={28} strokeWidth={2} />
      </div>
      <p className="font-display text-[12px] font-bold text-neutral-900">
        Relatório exportado
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Equipe · Maio 2026 · PDF · 14 páginas
      </p>
      <div className="flex items-center gap-1 rounded bg-success/10 px-3 py-1 text-[8px] font-semibold text-success">
        <CheckCircle2 size={10} strokeWidth={2.5} />
        Compartilhado com RH corporativo
      </div>
      <button
        type="button"
        className="flex items-center gap-1 rounded bg-brand px-3 py-1.5 text-[9px] font-bold text-white shadow-brand"
      >
        <Send size={11} strokeWidth={2} />
        Compartilhar novamente
      </button>
    </motion.div>
  );
}
