"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
import { Badge, Button, Card } from "@/components/ui/shadcn";

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
  { who: "Ana Costa", days: [1, 1, 1, 1, 1, 0] },
  { who: "Carlos M.", days: [1, 1, 0, 1, 1, 1] },
  { who: "Beatriz S.", days: [1, 1, 1, 0, 1, 1] },
  { who: "Diego Lima", days: [0, 1, 1, 1, 1, 0] },
];

const PUNCH_LIST = [
  { who: "Ana Costa", clock: "07:58 / 16:02", ot: "+0h", status: "ok" as const },
  {
    who: "Carlos Mello",
    clock: "08:12 / 17:30",
    ot: "+1h30",
    status: "warn" as const,
  },
  { who: "Diego Lima", clock: "Ausente", ot: "—", status: "danger" as const },
];

const REQUESTS = [
  { type: "Férias", who: "Mariana C.", when: "10–24 Jun" },
  { type: "Folga", who: "Lucas P.", when: "27/05" },
  { type: "Troca de turno", who: "Sofia A.", when: "23/05" },
];

const PRESENCE_WEEK = [88, 92, 90, 95, 91, 94, 94];

export function PortalGestorMockup({ step }: PortalGestorProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
        <div className="flex items-center gap-3">
          <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
          <span className="h-5 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-white"
              style={{ background: "#020788" }}
            >
              <UsersRound size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Portal Gestor
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                Filial Centro · Maio 2026
              </p>
            </div>
          </div>
        </div>
        <Badge variant="secondary">Gestor: João Costa</Badge>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden p-4">
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
  const max = Math.max(...PRESENCE_WEEK);
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-3 overflow-hidden"
    >
      <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
        Dashboard de equipe
      </p>
      <div data-tour="pg-dashboard" className="grid grid-cols-4 gap-2">
        {TEAM_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
          >
            <Card className="p-3.5">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                {kpi.label}
              </p>
              <p
                className={cn(
                  "mt-1 font-ui text-[28px] font-bold tabular-nums leading-none",
                  kpi.tone === "success" && "text-success",
                  kpi.tone === "warning" && "text-warning",
                  !kpi.tone && "text-neutral-900",
                )}
              >
                {kpi.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex-1">
        <Card className="flex h-full flex-col p-4">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
            Presença · últimos 7 dias
          </p>
          <div className="mt-3 flex flex-1 items-end gap-2">
            {PRESENCE_WEEK.map((v, i) => {
              const h = (v / max) * 100;
              const isToday = i === PRESENCE_WEEK.length - 1;
              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <span className="font-ui text-[10px] font-bold tabular-nums text-neutral-500">
                    {v}%
                  </span>
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.05 * i,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    style={{
                      height: `${h}%`,
                      transformOrigin: "bottom",
                    }}
                    className={cn(
                      "w-full rounded-t-md",
                      isToday
                        ? "bg-gradient-to-t from-brand to-brand-light"
                        : "bg-gradient-to-t from-brand/40 to-brand/20",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function ScheduleView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-2 overflow-hidden"
    >
      <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
        Escala · semana 21
      </p>
      <div data-tour="pg-schedule" className="flex-1 overflow-hidden">
        <Card className="h-full overflow-y-auto p-4">
          <div className="grid grid-cols-[120px_repeat(6,1fr)] items-center gap-2 border-b border-neutral-100 pb-2 font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
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
              transition={{ delay: 0.05 * i, duration: 0.22 }}
              className="grid grid-cols-[120px_repeat(6,1fr)] items-center gap-2 border-b border-neutral-100 py-2 last:border-0"
            >
              <span className="font-ui text-[12px] font-bold text-neutral-900">
                {row.who}
              </span>
              {row.days.map((d, j) => (
                <span
                  key={j}
                  className={cn(
                    "h-7 rounded-md text-center font-ui text-[10px] font-bold leading-7",
                    d
                      ? "bg-brand text-white"
                      : "bg-neutral-100 text-neutral-400",
                  )}
                >
                  {d ? "Turno" : "Off"}
                </span>
              ))}
            </motion.div>
          ))}
        </Card>
      </div>
    </motion.div>
  );
}

function PunchView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-2 overflow-hidden"
    >
      <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
        Espelho de ponto · hoje
      </p>
      <div data-tour="pg-punch" className="flex-1 overflow-hidden">
        <Card className="h-full overflow-y-auto p-3">
          {PUNCH_LIST.map((p, i) => (
            <motion.div
              key={p.who}
              initial={{ x: 6, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.22 }}
              className="flex items-center justify-between border-b border-neutral-100 py-3 last:border-0"
            >
              <div>
                <p className="font-ui text-[13px] font-bold text-neutral-900">
                  {p.who}
                </p>
                <p className="font-ui text-[11px] text-neutral-500">
                  {p.clock}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-ui text-[12px] font-bold tabular-nums text-neutral-700">
                  {p.ot}
                </span>
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    p.status === "ok" && "bg-success",
                    p.status === "warn" && "bg-warning",
                    p.status === "danger" && "bg-danger",
                  )}
                />
              </div>
            </motion.div>
          ))}
        </Card>
      </div>
    </motion.div>
  );
}

function RequestsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-2 overflow-hidden"
    >
      <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
        Solicitações pendentes
      </p>
      <div data-tour="pg-requests" className="flex-1 space-y-2 overflow-y-auto">
        {REQUESTS.map((r, i) => (
          <motion.div
            key={r.type}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
          >
            <Card className="flex items-center gap-3 p-3.5">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-brand-subtle text-brand">
                {r.type === "Férias" && <Calendar size={16} strokeWidth={2} />}
                {r.type === "Folga" && <Clock size={16} strokeWidth={2} />}
                {r.type === "Troca de turno" && (
                  <AlertCircle size={16} strokeWidth={2} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[12px] font-bold text-neutral-900">
                  {r.type} · {r.who}
                </p>
                <p className="font-ui text-[11px] text-neutral-500">
                  {r.when}
                </p>
              </div>
              <Button type="button" variant="success" size="default">
                Aprovar
              </Button>
            </Card>
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
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col items-center justify-center gap-4"
    >
      <motion.div
        data-tour="pg-export"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 14 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-white shadow-brand"
      >
        <Download size={36} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[16px] font-bold text-neutral-900">
        Relatório exportado
      </p>
      <p className="text-center font-ui text-[11px] text-neutral-500">
        Equipe · Maio 2026 · PDF · 14 páginas
      </p>
      <Badge variant="success">
        <CheckCircle2 size={11} strokeWidth={2.5} />
        Compartilhado com RH corporativo
      </Badge>
      <Button type="button" variant="default" size="lg">
        <Send size={14} strokeWidth={2} />
        Compartilhar novamente
      </Button>
    </motion.div>
  );
}
