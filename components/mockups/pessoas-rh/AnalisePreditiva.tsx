"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge, Card } from "@/components/ui/shadcn";
import { people, type Photo } from "@/lib/photos";
import { PersonAvatar } from "@/components/ui/PersonAvatar";

interface AnalisePreditivaProps {
  step: number;
}

const RISK_PEOPLE: Array<{
  name: string;
  unit: string;
  risk: number;
  tenure: string;
  photo: Photo;
}> = [
  { name: "Ricardo Almeida", unit: "Filial Centro", risk: 87, tenure: "2,4 anos", photo: people.ricardo },
  { name: "Juliana Mendes", unit: "Ala B", risk: 74, tenure: "1,8 anos", photo: people.juliana },
  { name: "Pedro Souza", unit: "Unidade Norte", risk: 62, tenure: "3,2 anos", photo: people.pedro },
  { name: "Camila Lopes", unit: "Filial Centro", risk: 41, tenure: "4,5 anos", photo: people.camila },
];

const RISK_SERIES = [
  { m: "Out", v: 12 },
  { m: "Nov", v: 15 },
  { m: "Dez", v: 14 },
  { m: "Jan", v: 18 },
  { m: "Fev", v: 22 },
  { m: "Mar", v: 21 },
  { m: "Abr", v: 26 },
  { m: "Mai", v: 29 },
];

export function AnalisePreditivaMockup({ step }: AnalisePreditivaProps) {
  const max = Math.max(...RISK_SERIES.map((s) => s.v));
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
              <TrendingUp size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Análise Preditiva
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                Predição de turnover · Maio 2026
              </p>
            </div>
          </div>
        </div>
        <Badge variant="ai">
          <Sparkles size={10} strokeWidth={2.5} />
          IA
        </Badge>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_380px] gap-4 overflow-hidden p-4">
        <section className="flex flex-col gap-3 overflow-hidden">
          <Card data-tour="ip-kpis" className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                Indicadores de RH
              </p>
              <Badge variant="secondary">12 meses</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: "Turnover atual", value: "8,4%", tone: "warning" as const },
                { label: "Predição 90d", value: "11,2%", tone: "warning" as const },
                { label: "Risco crítico", value: "14", tone: "danger" as const },
              ].map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl bg-neutral-50 p-3"
                >
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                    {k.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-ui text-[26px] font-bold tabular-nums leading-none",
                      k.tone === "warning" && "text-warning",
                      k.tone === "danger" && "text-danger",
                    )}
                  >
                    {k.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                Tendência · últimos 8 meses
              </p>
              <div className="mt-2 flex h-32 items-end gap-1.5">
                {RISK_SERIES.map((s, i) => {
                  const h = (s.v / max) * 100;
                  const critical = i >= 6;
                  return (
                    <div
                      key={s.m}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                      <span className="font-ui text-[10px] font-bold tabular-nums text-neutral-500">
                        {s.v}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          delay: 0.04 * i,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={cn(
                          "w-full rounded-t-md",
                          critical
                            ? "bg-gradient-to-t from-danger to-danger/55 shadow-[0_2px_8px_rgba(220,38,38,0.25)]"
                            : "bg-gradient-to-t from-brand to-brand/40",
                        )}
                      />
                      <span className="font-ui text-[9px] font-bold text-neutral-500">
                        {s.m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {step >= 1 && (
            <motion.div
              data-tour="ip-risk-map"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-hidden"
            >
              <Card className="flex h-full flex-col p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Mapa de risco · pessoas
                </p>
                <div className="mt-2 flex-1 space-y-2 overflow-y-auto">
                  {RISK_PEOPLE.map((p, i) => {
                    const selected = step >= 2 && i === 0;
                    return (
                      <motion.button
                        key={p.name}
                        data-tour={i === 0 ? "ip-risk-item" : undefined}
                        initial={{ x: 6, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.04 * i, duration: 0.22 }}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all",
                          selected
                            ? "border-2 border-brand bg-brand-ghost shadow-card"
                            : "border border-brand/10 bg-white hover:-translate-y-[1px] hover:shadow-card-hover",
                        )}
                      >
                        <PersonAvatar
                          photo={p.photo}
                          name={p.name}
                          size={40}
                          ring={selected}
                          status={p.risk >= 70 ? "busy" : "online"}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-ui text-[12px] font-bold text-neutral-900">
                            {p.name}
                          </p>
                          <p className="font-ui text-[10px] text-neutral-500">
                            {p.unit} · {p.tenure}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-ui text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                            Risco
                          </p>
                          <p
                            className={cn(
                              "font-ui text-[16px] font-bold tabular-nums leading-none",
                              p.risk >= 70 && "text-danger",
                              p.risk < 70 && p.risk >= 50 && "text-warning",
                              p.risk < 50 && "text-neutral-700",
                            )}
                          >
                            {p.risk}%
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-3 overflow-hidden">
          {step >= 3 && (
            <motion.div
              data-tour="ip-suggestion"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-4"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} strokeWidth={2.25} className="text-brand" />
                <p className="font-ui text-[12px] font-bold uppercase tracking-[2px] text-brand">
                  Plano sugerido pela IA
                </p>
              </div>
              <ul className="mt-3 space-y-2 font-ui text-[11px]">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span className="text-neutral-700">
                    Conversa de carreira com gestor até 28/05
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span className="text-neutral-700">
                    Ajuste salarial, faixa atual P50
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                  <span className="text-neutral-700">
                    Programa de mentoria interno
                  </span>
                </li>
              </ul>
            </motion.div>
          )}

          {step >= 2 && step < 3 && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-danger/30 bg-danger/5 p-4"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} strokeWidth={2.25} className="text-danger" />
                <p className="font-ui text-[12px] font-bold text-danger">
                  Risco crítico
                </p>
              </div>
              <p className="mt-1 font-ui text-[11px] text-neutral-700">
                Ricardo Almeida · 87% de probabilidade nos próximos 90 dias
              </p>
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div
              data-tour="ip-impact"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Simulação de impacto
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-neutral-50 p-3 text-center">
                    <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                      Antes
                    </p>
                    <p className="mt-1 font-ui text-[26px] font-bold tabular-nums leading-none text-danger">
                      87%
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-success/30 bg-success/5 p-3 text-center">
                    <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-success">
                      Depois
                    </p>
                    <p className="mt-1 font-ui text-[26px] font-bold tabular-nums leading-none text-success">
                      34%
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                  <span className="font-ui text-[11px] font-bold text-success">
                    Redução de risco
                  </span>
                  <span className="flex items-center gap-1 font-ui text-[14px] font-bold tabular-nums text-success">
                    <TrendingDown size={13} strokeWidth={2.5} />
                    −61%
                  </span>
                </div>
              </Card>
            </motion.div>
          )}

          {step < 2 && (
            <div className="rounded-xl border border-dashed border-brand/20 bg-white/60 p-4 text-center font-ui text-[11px] italic text-neutral-500">
              Selecione uma pessoa para ver detalhes do risco
            </div>
          )}

          <Card className="mt-auto p-4">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
              Modelo
            </p>
            <p className="mt-1 font-ui text-[12px] font-bold text-neutral-900">
              Random Forest · acurácia 91,2%
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-ui text-[11px] text-success">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              Última atualização: hoje 06:00
            </p>
          </Card>
        </aside>
      </main>
    </div>
  );
}
