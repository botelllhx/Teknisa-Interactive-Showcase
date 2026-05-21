"use client";

import { motion } from "framer-motion";
import {
  Fingerprint,
  Calendar,
  Plane,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface PortalFuncionarioProps {
  step: number;
}

export function PortalFuncionarioMockup({ step }: PortalFuncionarioProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-800">
      <header className="px-3 pt-2 pb-1">
        <p className="font-display text-[9px] font-bold uppercase tracking-widest text-brand">
          Portal Funcionário
        </p>
        <p className="text-[8px] text-neutral-500">Teknisa · Mobile</p>
      </header>

      {step === 0 && <LoginView />}
      {step === 1 && <PunchSheetView />}
      {step === 2 && <RequestVacationView />}
      {step === 3 && <StatusView />}
      {step >= 4 && <PayslipView />}
    </div>
  );
}

function LoginView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-subtle text-brand">
        <Fingerprint size={32} strokeWidth={2} />
      </div>
      <div className="text-center">
        <p className="font-display text-[12px] font-bold text-neutral-900">
          Bem-vinda, Mariana
        </p>
        <p className="mt-0.5 text-[8px] text-neutral-500">
          Acesse com sua biometria
        </p>
      </div>
      <button
        type="button"
        className="w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Entrar
      </button>
    </div>
  );
}

function PunchSheetView() {
  const days = [
    { day: "21", clock: "07:58 → 16:02", ot: 0, ok: true },
    { day: "20", clock: "07:55 → 17:32", ot: 1.5, ok: true },
    { day: "19", clock: "08:02 → 16:00", ot: 0, ok: true },
    { day: "18", clock: "—", ot: 0, ok: false, label: "Folga" },
    { day: "17", clock: "07:50 → 16:05", ot: 0, ok: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="flex items-center justify-between rounded-md bg-surface-raised p-2">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
            Saldo do mês
          </p>
          <p className="font-display text-[12px] font-bold text-success tabular-nums">
            + 6h 30min
          </p>
        </div>
        <Clock size={20} strokeWidth={1.75} className="text-brand" />
      </div>

      <p className="mt-3 text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
        Últimas marcações
      </p>
      <div className="mt-1 flex-1 space-y-1">
        {days.map((d, i) => (
          <motion.div
            key={d.day}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.04 * i }}
            className="flex items-center gap-2 rounded-md border border-brand/10 bg-white p-1.5"
          >
            <span className="flex h-7 w-7 flex-none flex-col items-center justify-center rounded-md bg-brand-subtle">
              <span className="text-[10px] font-bold leading-none text-brand">
                {d.day}
              </span>
              <span className="text-[6px] uppercase text-brand">Mai</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold text-neutral-900">
                {d.clock}
              </p>
              {d.label && (
                <p className="text-[8px] text-neutral-500">{d.label}</p>
              )}
            </div>
            {d.ot > 0 && (
              <span className="rounded bg-warning/10 px-1.5 py-0.5 text-[7px] font-bold text-warning">
                +{d.ot}h
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RequestVacationView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-1"
    >
      <div className="rounded-md bg-brand-subtle p-2">
        <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-brand">
          <Plane size={10} strokeWidth={2} />
          Solicitação de férias
        </p>
        <p className="mt-1 text-[8px] text-neutral-600">
          Você tem 30 dias disponíveis
        </p>
      </div>

      <div className="mt-2 space-y-1.5">
        <Field label="Início" value="10/06/2026" />
        <Field label="Fim" value="24/06/2026" />
        <Field label="Dias" value="14 dias úteis" />
        <Field label="Saldo após" value="16 dias" />
      </div>

      <button
        type="button"
        className="mt-auto w-full rounded-md bg-brand py-2 text-center font-display text-[10px] font-bold text-white shadow-brand"
      >
        Enviar solicitação
      </button>
    </motion.div>
  );
}

function StatusView() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-1 flex-col items-center justify-center gap-3 px-4"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning">
        <Clock size={28} strokeWidth={2} />
      </div>
      <p className="font-display text-[11px] font-bold text-neutral-900">
        Aguardando aprovação
      </p>
      <p className="text-center text-[9px] text-neutral-500">
        Sua solicitação está com o gestor João Costa
      </p>
      <div className="w-full rounded-md bg-surface-raised p-2">
        <Step Icon={CheckCircle2} label="Enviada" done time="há 2 min" />
        <Step Icon={Clock} label="Em análise pelo gestor" active />
        <Step Icon={CheckCircle2} label="Aprovação RH" />
      </div>
    </motion.div>
  );
}

function PayslipView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col px-3 py-2"
    >
      <div className="rounded-md bg-brand p-3 text-white shadow-brand">
        <p className="text-[8px] font-medium uppercase tracking-wider opacity-80">
          Holerite · Maio 2026
        </p>
        <p className="mt-1 font-display text-[18px] font-bold tabular-nums">
          R$ 4.840,12
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2 text-[8px] opacity-90">
          <span>Disponível</span>
          <span className="font-semibold">Há instantes</span>
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {[
          { label: "Salário base", value: "R$ 5.400,00", positive: true },
          { label: "Hora extra", value: "+ R$ 312,50", positive: true },
          { label: "INSS", value: "- R$ 542,16", positive: false },
          { label: "IRRF", value: "- R$ 330,22", positive: false },
        ].map((l) => (
          <div
            key={l.label}
            className="flex items-center justify-between text-[9px]"
          >
            <span className="text-neutral-600">{l.label}</span>
            <span
              className={cn(
                "tabular-nums",
                l.positive ? "font-semibold text-neutral-900" : "text-danger",
              )}
            >
              {l.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1 rounded-md border border-brand bg-white py-2 text-[10px] font-bold text-brand"
      >
        <Download size={12} strokeWidth={2.25} />
        Baixar PDF
      </button>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded border border-brand/10 bg-white px-2 py-1.5">
      <div className="flex items-center gap-1.5">
        <Calendar size={10} strokeWidth={2} className="text-brand" />
        <span className="text-[8px] text-neutral-500">{label}</span>
      </div>
      <span className="text-[9px] font-semibold text-neutral-900">{value}</span>
    </div>
  );
}

function Step({
  Icon,
  label,
  done,
  active,
  time,
}: {
  Icon: typeof CheckCircle2;
  label: string;
  done?: boolean;
  active?: boolean;
  time?: string;
}) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          done && "bg-success text-white",
          active && "bg-brand text-white shadow-brand",
          !done && !active && "bg-neutral-200 text-neutral-400",
        )}
      >
        <Icon size={10} strokeWidth={2.5} />
      </span>
      <span className="flex-1 text-[8px] font-semibold text-neutral-700">
        {label}
      </span>
      {time && <span className="text-[7px] text-neutral-400">{time}</span>}
    </div>
  );
}
