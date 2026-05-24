"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
import { AreaChart, Sparkline } from "@/components/ui/charts";

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
  // v13.10 — user pode clicar livre em qualquer pessoa pra selecionar
  // (não fica só preso ao step do tour). O detail panel reflete a
  // pessoa escolhida.
  const [pickedPersonIdx, setPickedPersonIdx] = useState<number>(0);
  // tour controla o detail panel automaticamente nos steps 2+
  useEffect(() => {
    if (step >= 2 && pickedPersonIdx === null) setPickedPersonIdx(0);
  }, [step, pickedPersonIdx]);
  const activePerson = RISK_PEOPLE[pickedPersonIdx ?? 0];
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
                  "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
                boxShadow:
                  "0 3px 10px rgba(124,58,237,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
              }}
            >
              <TrendingUp size={15} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <p
                className="font-display text-[14px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.018em" }}
              >
                Análise Preditiva
              </p>
              <p
                className="font-ui text-[10.5px] text-neutral-500"
                style={{ letterSpacing: "-0.005em" }}
              >
                Predição de turnover ·{" "}
                <span className="tabular-nums">Maio 2026</span>
              </p>
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-ui text-[10.5px] font-bold uppercase text-white"
          style={{
            background:
              "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
            boxShadow:
              "0 2px 8px rgba(124,58,237,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
            letterSpacing: "0.12em",
          }}
        >
          <Sparkles size={11} strokeWidth={2.5} />
          IA
        </span>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_380px] gap-4 overflow-hidden p-4">
        <section className="flex flex-col gap-3 overflow-hidden">
          <Card data-tour="ip-kpis" className="p-4">
            <div className="flex items-center justify-between">
              <p
                className="font-ui text-[10.5px] font-bold uppercase text-brand"
                style={{ letterSpacing: "0.18em" }}
              >
                Indicadores de RH
              </p>
              <Badge variant="secondary">12 meses</Badge>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                {
                  label: "Turnover atual",
                  value: "8,4%",
                  tone: "warning" as const,
                  trend: [6.2, 6.8, 7.1, 7.0, 7.5, 7.9, 8.1, 8.4],
                  color: "#d97706",
                },
                {
                  label: "Predição 90d",
                  value: "11,2%",
                  tone: "warning" as const,
                  trend: [7.8, 8.2, 8.8, 9.3, 9.8, 10.4, 10.8, 11.2],
                  color: "#d97706",
                },
                {
                  label: "Risco crítico",
                  value: "14",
                  tone: "danger" as const,
                  trend: [5, 6, 7, 8, 10, 11, 13, 14],
                  color: "#dc2626",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  className="relative rounded-xl bg-neutral-50 p-3"
                  style={{
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <p
                    className="font-ui text-[10.5px] font-bold uppercase text-neutral-500"
                    style={{ letterSpacing: "0.16em" }}
                  >
                    {k.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 font-ui text-[26px] font-bold tabular-nums leading-none",
                      k.tone === "warning" && "text-warning",
                      k.tone === "danger" && "text-danger",
                    )}
                    style={{ letterSpacing: "-0.030em" }}
                  >
                    {k.value}
                  </p>
                  {/* Sparkline mini-chart — Linear/Notion style */}
                  <div className="mt-2">
                    <Sparkline
                      data={k.trend}
                      color={k.color}
                      width={92}
                      height={20}
                      fill
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p
                  className="font-ui text-[10.5px] font-bold uppercase text-neutral-500"
                  style={{ letterSpacing: "0.16em" }}
                >
                  Tendência · últimos 8 meses
                </p>
                <p
                  className="font-ui text-[10.5px] text-neutral-400 tabular-nums"
                  style={{ letterSpacing: "-0.005em" }}
                >
                  Riscos críticos
                </p>
              </div>
              <div className="mt-2">
                <AreaChart
                  data={RISK_SERIES.map((s) => ({ x: s.m, y: s.v }))}
                  color="#dc2626"
                  aspectRatio="16/7"
                  yMin={10}
                  formatY={(v) => Math.round(v).toString()}
                  showYLabels
                  smooth
                />
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
                    const selected =
                      pickedPersonIdx === i && step >= 2;
                    return (
                      <motion.button
                        key={p.name}
                        data-tour={i === 0 ? "ip-risk-item" : undefined}
                        initial={{ x: 6, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.04 * i, duration: 0.22 }}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPickedPersonIdx(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all",
                          selected
                            ? "border-2 border-brand bg-brand-ghost shadow-card"
                            : "border border-brand/10 bg-white hover:-translate-y-[1px] hover:shadow-card-hover",
                        )}
                      >
                        <PersonAvatar
                          photo={p.photo}
                          name={p.name}
                          size={42}
                          ring={selected}
                          status={p.risk >= 70 ? "busy" : "online"}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="font-ui text-[12.5px] font-bold text-neutral-900"
                            style={{ letterSpacing: "-0.005em" }}
                          >
                            {p.name}
                          </p>
                          <p
                            className="font-ui text-[10.5px] text-neutral-500"
                            style={{ letterSpacing: "-0.005em" }}
                          >
                            {p.unit} · <span className="tabular-nums">{p.tenure}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-ui text-[10.5px] font-bold uppercase text-neutral-400"
                            style={{ letterSpacing: "0.16em" }}
                          >
                            Risco
                          </p>
                          <p
                            className={cn(
                              "font-display text-[17px] font-bold tabular-nums leading-none",
                              p.risk >= 70 && "text-danger",
                              p.risk < 70 && p.risk >= 50 && "text-warning",
                              p.risk < 50 && "text-neutral-700",
                            )}
                            style={{ letterSpacing: "-0.030em" }}
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
              key={activePerson.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "rounded-2xl p-4",
                activePerson.risk >= 70
                  ? "border border-danger/30 bg-danger/5"
                  : activePerson.risk >= 50
                    ? "border border-warning/30 bg-warning/5"
                    : "border border-brand/15 bg-brand-ghost",
              )}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={16}
                  strokeWidth={2.25}
                  className={cn(
                    activePerson.risk >= 70
                      ? "text-danger"
                      : activePerson.risk >= 50
                        ? "text-warning"
                        : "text-brand",
                  )}
                />
                <p
                  className={cn(
                    "font-display text-[13px] font-bold",
                    activePerson.risk >= 70
                      ? "text-danger"
                      : activePerson.risk >= 50
                        ? "text-warning"
                        : "text-brand",
                  )}
                  style={{ letterSpacing: "-0.018em" }}
                >
                  {activePerson.risk >= 70
                    ? "Risco crítico"
                    : activePerson.risk >= 50
                      ? "Risco moderado"
                      : "Risco baixo"}
                </p>
              </div>
              <p
                className="mt-1.5 font-ui text-[12px] leading-snug text-neutral-700"
                style={{ letterSpacing: "-0.005em" }}
              >
                <span className="font-bold">{activePerson.name}</span> ·{" "}
                <span className="tabular-nums">{activePerson.risk}%</span> de
                probabilidade nos próximos 90 dias
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
                    <p className="font-ui text-[10.5px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                      Antes
                    </p>
                    <p className="mt-1 font-ui text-[26px] font-bold tabular-nums leading-none text-danger">
                      87%
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-success/30 bg-success/5 p-3 text-center">
                    <p className="font-ui text-[10.5px] font-bold uppercase tracking-[1.5px] text-success">
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
            <p className="font-ui text-[10.5px] font-bold uppercase tracking-[1.5px] text-neutral-500">
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
