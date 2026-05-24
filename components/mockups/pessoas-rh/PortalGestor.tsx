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
import { people, type Photo } from "@/lib/photos";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StackedAvatars } from "@/components/ui/StackedAvatars";
import { Sparkline, AreaChart } from "@/components/ui/charts";

interface PortalGestorProps {
  step: number;
}

const TEAM_KPIS: Array<{
  label: string;
  value: string;
  tone?: "success" | "warning";
  trend: number[];
  trendColor: string;
}> = [
  {
    label: "Equipe",
    value: "48",
    trend: [42, 44, 45, 46, 47, 48, 48, 48],
    trendColor: "#020788",
  },
  {
    label: "Presença hoje",
    value: "94%",
    tone: "success",
    trend: [88, 92, 90, 95, 91, 94, 94, 94],
    trendColor: "#16a34a",
  },
  {
    label: "Hora extra",
    value: "12h",
    tone: "warning",
    trend: [4, 6, 8, 9, 11, 10, 12, 12],
    trendColor: "#d97706",
  },
  {
    label: "Solicitações",
    value: "7",
    trend: [2, 3, 4, 5, 6, 6, 7, 7],
    trendColor: "#020788",
  },
];

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const SHIFT_DATA = [
  { who: "Ana Costa", days: [1, 1, 1, 1, 1, 0] },
  { who: "Carlos M.", days: [1, 1, 0, 1, 1, 1] },
  { who: "Beatriz S.", days: [1, 1, 1, 0, 1, 1] },
  { who: "Diego Lima", days: [0, 1, 1, 1, 1, 0] },
];

const PUNCH_LIST: Array<{
  who: string;
  photo: Photo;
  clock: string;
  ot: string;
  status: "ok" | "warn" | "danger";
}> = [
  {
    who: "Ana Costa",
    photo: people.ana,
    clock: "07:58 / 16:02",
    ot: "+0h",
    status: "ok",
  },
  {
    who: "Carlos Mello",
    photo: people.carlos,
    clock: "08:12 / 17:30",
    ot: "+1h30",
    status: "warn",
  },
  {
    who: "Diego Lima",
    photo: people.diego,
    clock: "Ausente",
    ot: "—",
    status: "danger",
  },
];

const REQUESTS: Array<{
  type: string;
  who: string;
  photo: Photo;
  when: string;
}> = [
  { type: "Férias", who: "Mariana Costa", photo: people.mariana, when: "10 a 24 Jun" },
  { type: "Folga", who: "Sofia Almeida", photo: people.sofia, when: "27/05" },
  { type: "Troca de turno", who: "Beatriz Silva", photo: people.beatriz, when: "23/05" },
];

const TEAM_AVATARS = [
  { name: "Ana Costa", photo: people.ana },
  { name: "Carlos Mello", photo: people.carlos },
  { name: "Mariana Costa", photo: people.mariana },
  { name: "Sofia Almeida", photo: people.sofia },
  { name: "Beatriz Silva", photo: people.beatriz },
  { name: "Diego Lima", photo: people.diego },
];

const PRESENCE_WEEK = [88, 92, 90, 95, 91, 94, 94];

export function PortalGestorMockup({ step }: PortalGestorProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-surface-raised font-ui text-neutral-800">
      <header className="flex h-14 items-center justify-between border-b border-brand/8 bg-white px-5">
        <div className="flex items-center gap-3">
          <Image src="/logo-teknisa.svg" alt="Teknisa" width={86} height={16} />
          <span className="h-5 w-px bg-neutral-200" />
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{
                background:
                  "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
                boxShadow:
                  "0 3px 8px rgba(2,7,136,0.30), inset 0 1px 0 rgba(255,255,255,0.20)",
              }}
            >
              <UsersRound size={15} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <p
                className="font-display text-[14px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.018em" }}
              >
                Portal Gestor
              </p>
              <p
                className="font-ui text-[10.5px] text-neutral-500"
                style={{ letterSpacing: "-0.005em" }}
              >
                Filial Centro ·{" "}
                <span className="tabular-nums">Maio 2026</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StackedAvatars
            people={TEAM_AVATARS}
            size={28}
            max={4}
            extraLabel="+44"
          />
          <span className="h-7 w-px bg-neutral-200" />
          <div
            className="flex items-center gap-2 rounded-full bg-white px-2 py-1"
            style={{
              border: "1px solid rgba(0,0,0,0.05)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <PersonAvatar photo={people.joao} name="João Costa" size={26} />
            <div className="leading-tight">
              <span
                className="block font-ui text-[11.5px] font-bold text-brand"
                style={{ letterSpacing: "-0.005em" }}
              >
                João Costa
              </span>
              <span
                className="block font-ui text-[9px] text-neutral-500"
                style={{ letterSpacing: "0.005em" }}
              >
                Gestor · Filial Centro
              </span>
            </div>
          </div>
        </div>
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex h-full flex-col gap-3 overflow-hidden"
    >
      <p
        className="font-ui text-[11px] font-bold uppercase text-brand"
        style={{ letterSpacing: "0.18em" }}
      >
        Dashboard de equipe
      </p>
      <div data-tour="pg-dashboard" className="grid grid-cols-4 gap-2.5">
        {TEAM_KPIS.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
          >
            <Card className="p-3.5">
              <p
                className="font-ui text-[10px] font-bold uppercase text-neutral-500"
                style={{ letterSpacing: "0.16em" }}
              >
                {kpi.label}
              </p>
              <div className="mt-1 flex items-end justify-between gap-1.5">
                <p
                  className={cn(
                    "font-display text-[26px] font-bold tabular-nums leading-none",
                    kpi.tone === "success" && "text-success",
                    kpi.tone === "warning" && "text-warning",
                    !kpi.tone && "text-neutral-900",
                  )}
                  style={{ letterSpacing: "-0.030em" }}
                >
                  {kpi.value}
                </p>
                <Sparkline
                  data={kpi.trend}
                  color={kpi.trendColor}
                  width={56}
                  height={20}
                  fill
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        <Card className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between">
            <p
              className="font-ui text-[11px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.18em" }}
            >
              Presença · últimos 7 dias
            </p>
            <span
              className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 font-ui text-[9.5px] font-bold uppercase text-success"
              style={{ letterSpacing: "0.14em" }}
            >
              <span className="tabular-nums">94%</span> hoje
            </span>
          </div>
          <div className="mt-3 flex-1">
            <AreaChart
              data={PRESENCE_WEEK.map((v, i) => ({
                x: WEEK_DAYS[i] ?? "Hoje",
                y: v,
              }))}
              color="#020788"
              yMin={80}
              yMax={100}
              aspectRatio="16/4"
              formatY={(v) => `${v.toFixed(0)}%`}
              showYLabels
            />
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
              className="flex items-center gap-3 border-b border-neutral-100 py-3 last:border-0"
            >
              <PersonAvatar
                photo={p.photo}
                name={p.who}
                size={36}
                status={p.status === "ok" ? "online" : p.status === "warn" ? "busy" : "offline"}
              />
              <div className="min-w-0 flex-1">
                <p className="font-ui text-[13px] font-bold text-neutral-900">
                  {p.who}
                </p>
                <p className="font-ui text-[11px] text-neutral-500">
                  {p.clock}
                </p>
              </div>
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
              <PersonAvatar photo={r.photo} name={r.who} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      r.type === "Férias"
                        ? "secondary"
                        : r.type === "Folga"
                          ? "warning"
                          : "default"
                    }
                  >
                    {r.type === "Férias" && <Calendar size={10} strokeWidth={2.5} />}
                    {r.type === "Folga" && <Clock size={10} strokeWidth={2.5} />}
                    {r.type === "Troca de turno" && (
                      <AlertCircle size={10} strokeWidth={2.5} />
                    )}
                    {r.type}
                  </Badge>
                  <p className="font-ui text-[12px] font-bold text-neutral-900">
                    {r.who}
                  </p>
                </div>
                <p className="mt-0.5 font-ui text-[11px] text-neutral-500">
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
