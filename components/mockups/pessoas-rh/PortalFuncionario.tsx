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
import { Badge } from "@/components/ui/shadcn";
import { people } from "@/lib/photos";
import { PersonAvatar } from "@/components/ui/PersonAvatar";

interface PortalFuncionarioProps {
  step: number;
}

export function PortalFuncionarioMockup({ step }: PortalFuncionarioProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white font-ui text-neutral-800">
      <header className="border-b border-brand/8 px-4 pb-2 pt-3">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
          Portal Funcionário
        </p>
        <p className="font-ui text-[10px] text-neutral-500">
          Teknisa · Mobile
        </p>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden">
        {step === 0 && <LoginView />}
        {step === 1 && <PunchSheetView />}
        {step === 2 && <RequestVacationView />}
        {step === 3 && <StatusView />}
        {step >= 4 && <PayslipView />}
      </main>
    </div>
  );
}

function LoginView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
      <div className="relative">
        <PersonAvatar
          photo={people.mariana}
          name="Mariana Costa"
          size={96}
          ring
          className="shadow-card"
        />
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full ring-2 ring-brand/45"
        />
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-brand ring-2 ring-white">
          <Fingerprint size={18} strokeWidth={2.25} />
        </span>
      </div>
      <div className="text-center">
        <p className="font-ui text-[16px] font-bold text-neutral-900">
          Bem-vinda, Mariana
        </p>
        <p className="mt-1 font-ui text-[11px] text-neutral-500">
          Acesse com sua biometria
        </p>
      </div>
      <button
        type="button"
        data-tour="pf-login"
        className="w-full max-w-[220px] rounded-xl bg-brand py-3 text-center font-ui text-[13px] font-bold text-white shadow-brand transition-all hover:-translate-y-[1px] active:scale-[0.98]"
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
    { day: "18", clock: "Folga", ot: 0, ok: false, label: "Sem expediente" },
    { day: "17", clock: "07:50 → 16:05", ot: 0, ok: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      {/* Greeting hero — avatar + name + quick status */}
      <div
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/40 p-3"
        style={{ border: "1px solid rgba(2,7,136,0.10)" }}
      >
        <PersonAvatar
          photo={people.mariana}
          name="Mariana Costa"
          size={48}
          ring
          status="online"
        />
        <div className="min-w-0 flex-1">
          <p
            className="font-ui text-[9px] font-bold uppercase text-brand"
            style={{ letterSpacing: "0.10em" }}
          >
            Bem-vinda
          </p>
          <p
            className="font-ui text-[15px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.01em" }}
          >
            Mariana Costa
          </p>
          <p className="font-ui text-[10px] text-neutral-500">
            Restaurante Central · Mat. 28471
          </p>
        </div>
        <button
          type="button"
          aria-label="Notificações"
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-brand shadow-subtle"
        >
          <span className="relative">
            <Clock size={14} strokeWidth={2.25} />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </span>
        </button>
      </div>

      {/* Quick stats — 4 mini KPIs */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { l: "Saldo BH", v: "+6h30", tone: "success" as const },
          { l: "Hoje", v: "07:58", tone: "neutral" as const },
          { l: "Férias", v: "12d", tone: "brand" as const },
          { l: "Holerite", v: "OK", tone: "success" as const },
        ].map((k, i) => (
          <motion.div
            key={k.l}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
            className="rounded-xl bg-white p-2"
            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <p
              className="font-ui text-[8px] font-bold uppercase text-neutral-400"
              style={{ letterSpacing: "0.08em" }}
            >
              {k.l}
            </p>
            <p
              className={cn(
                "mt-0.5 font-ui text-[13px] font-bold leading-none tabular-nums",
                k.tone === "success" && "text-success",
                k.tone === "brand" && "text-brand",
                k.tone === "neutral" && "text-neutral-900",
              )}
              style={{ letterSpacing: "-0.02em" }}
            >
              {k.v}
            </p>
          </motion.div>
        ))}
      </div>

      <p
        className="mt-1 font-ui text-[9px] font-bold uppercase text-neutral-500"
        style={{ letterSpacing: "0.10em" }}
      >
        Últimas marcações
      </p>
      <div data-tour="pf-punch-sheet" className="space-y-1.5">
        {days.map((d, i) => (
          <motion.div
            key={d.day}
            initial={{ x: 6, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.04 * i, duration: 0.22 }}
            className="flex items-center gap-2.5 rounded-xl bg-white p-2.5 shadow-subtle"
            style={{ border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <span className="flex h-10 w-10 flex-none flex-col items-center justify-center rounded-lg bg-brand-subtle">
              <span className="font-ui text-[13px] font-bold leading-none text-brand">
                {d.day}
              </span>
              <span className="font-ui text-[8px] font-bold uppercase tracking-[1px] text-brand">
                Mai
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p
                className="font-ui text-[12px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.005em" }}
              >
                {d.clock}
              </p>
              {d.label && (
                <p className="font-ui text-[10px] text-neutral-500">
                  {d.label}
                </p>
              )}
            </div>
            {d.ot > 0 && (
              <Badge variant="warning">+{d.ot}h</Badge>
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
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      <div className="rounded-xl bg-brand-ghost px-3 py-2.5">
        <p className="flex items-center gap-1.5 font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
          <Plane size={11} strokeWidth={2.25} />
          Solicitação de férias
        </p>
        <p className="mt-1 font-ui text-[11px] text-neutral-600">
          Você tem 30 dias disponíveis
        </p>
      </div>

      <div className="space-y-2">
        <Field label="Início" value="10/06/2026" />
        <Field label="Fim" value="24/06/2026" />
        <Field label="Dias" value="14 dias úteis" />
        <Field label="Saldo após" value="16 dias" />
      </div>

      <button
        type="button"
        data-tour="pf-vacation-button"
        className="mt-auto w-full rounded-xl bg-brand py-3 text-center font-ui text-[13px] font-bold text-white shadow-brand transition-all hover:-translate-y-[1px] active:scale-[0.98]"
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
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col items-center gap-3 overflow-y-auto px-5 py-5"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 text-warning"
      >
        <Clock size={32} strokeWidth={2} />
      </motion.div>
      <p className="font-ui text-[15px] font-bold text-neutral-900">
        Aguardando aprovação
      </p>
      <p className="text-center font-ui text-[11px] text-neutral-500">
        Sua solicitação está com o gestor João Costa
      </p>
      <div
        data-tour="pf-status"
        className="w-full rounded-xl bg-neutral-50 p-3"
      >
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
      transition={{ duration: 0.22 }}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3"
    >
      <div
        data-tour="pf-payslip"
        className="rounded-2xl bg-gradient-to-br from-brand via-brand-light to-[#3b42c4] p-4 text-white shadow-brand"
      >
        <p className="font-ui text-[10px] font-bold uppercase tracking-[2px] opacity-85">
          Holerite · Maio 2026
        </p>
        <p className="mt-1 font-ui text-[28px] font-bold tabular-nums leading-none">
          R$ 4.840,12
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 font-ui text-[10px] opacity-90">
          <span>Disponível</span>
          <span className="font-bold">Há instantes</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {[
          { label: "Salário base", value: "R$ 5.400,00", positive: true },
          { label: "Hora extra", value: "+ R$ 312,50", positive: true },
          { label: "INSS", value: "− R$ 542,16", positive: false },
          { label: "IRRF", value: "− R$ 330,22", positive: false },
        ].map((l) => (
          <div
            key={l.label}
            className="flex items-center justify-between font-ui text-[11px]"
          >
            <span className="text-neutral-600">{l.label}</span>
            <span
              className={cn(
                "tabular-nums",
                l.positive ? "font-bold text-neutral-900" : "text-danger",
              )}
            >
              {l.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-auto flex items-center justify-center gap-1.5 rounded-xl border border-brand bg-white py-3 font-ui text-[13px] font-bold text-brand transition-colors hover:bg-brand-ghost"
      >
        <Download size={14} strokeWidth={2.25} />
        Baixar PDF
      </button>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-brand/10 bg-white px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Calendar size={12} strokeWidth={2} className="text-brand" />
        <span className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
          {label}
        </span>
      </div>
      <span className="font-ui text-[12px] font-bold text-neutral-900">
        {value}
      </span>
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
    <div className="flex items-center gap-2.5 py-1.5">
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          done && "bg-success text-white",
          active && "bg-brand text-white shadow-brand",
          !done && !active && "bg-neutral-200 text-neutral-400",
        )}
      >
        <Icon size={12} strokeWidth={2.5} />
      </span>
      <span className="flex-1 font-ui text-[11px] font-bold text-neutral-700">
        {label}
      </span>
      {time && (
        <span className="font-ui text-[10px] text-neutral-400">{time}</span>
      )}
    </div>
  );
}
