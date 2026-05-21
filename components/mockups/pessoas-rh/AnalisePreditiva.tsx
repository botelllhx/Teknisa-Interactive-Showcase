"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface AnalisePreditivaProps {
  step: number;
}

const RISK_PEOPLE = [
  { initials: "RA", name: "Ricardo A.", unit: "Centro", risk: 87 },
  { initials: "JM", name: "Juliana M.", unit: "Ala B", risk: 74 },
  { initials: "PS", name: "Pedro S.", unit: "Norte", risk: 62 },
  { initials: "CL", name: "Camila L.", unit: "Centro", risk: 41 },
];

const RISK_SERIES = [12, 15, 14, 18, 22, 21, 26, 29];

export function AnalisePreditivaMockup({ step }: AnalisePreditivaProps) {
  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <TrendingUp size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Análise Preditiva
            </p>
            <p className="text-[8px] text-neutral-500">
              Predição de turnover · Maio 2026
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-brand">
          <Sparkles size={9} strokeWidth={2.5} />
          IA
        </span>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_38%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <div className="rounded-md bg-white p-2 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Indicadores de RH
              </p>
              <span className="rounded bg-brand-subtle px-1.5 py-0.5 text-[7px] font-bold uppercase text-brand">
                12 meses
              </span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { label: "Turnover atual", value: "8,4%", tone: "warning" as const },
                { label: "Predição 90d", value: "11,2%", tone: "warning" as const },
                { label: "Risco crítico", value: "14", tone: "danger" as const },
              ].map((k) => (
                <div key={k.label} className="rounded bg-surface-raised p-1.5">
                  <p className="text-[7px] uppercase text-neutral-500">
                    {k.label}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 font-display text-[14px] font-bold tabular-nums",
                      k.tone === "warning" && "text-warning",
                      k.tone === "danger" && "text-danger",
                    )}
                  >
                    {k.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex h-12 items-end gap-1">
              {RISK_SERIES.map((v, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.03 * i, duration: 0.35 }}
                  style={{ height: `${(v / 30) * 100}%`, transformOrigin: "bottom" }}
                  className={cn(
                    "flex-1 rounded-t",
                    i >= 6 ? "bg-danger" : "bg-brand/40",
                  )}
                />
              ))}
            </div>
          </div>

          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Mapa de risco · pessoas
              </p>
              <div className="mt-2 space-y-1.5">
                {RISK_PEOPLE.map((p, i) => {
                  const selected = step >= 2 && i === 0;
                  return (
                    <motion.button
                      key={p.name}
                      initial={{ x: 6, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.04 * i }}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md p-1.5 text-left",
                        selected
                          ? "border-2 border-brand bg-brand-ghost"
                          : "border border-brand/10 bg-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-[9px] font-bold",
                          selected
                            ? "bg-brand text-white shadow-brand"
                            : "bg-brand-subtle text-brand",
                        )}
                      >
                        {p.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold text-neutral-900">
                          {p.name}
                        </p>
                        <p className="text-[7px] text-neutral-500">{p.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] uppercase text-neutral-500">
                          Risco
                        </p>
                        <p
                          className={cn(
                            "font-display text-[10px] font-bold tabular-nums",
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
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-2">
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative overflow-hidden rounded-md border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} strokeWidth={2.25} className="text-brand" />
                <p className="font-display text-[9px] font-bold text-brand">
                  Plano sugerido pela IA
                </p>
              </div>
              <ul className="mt-2 space-y-1 text-[8px]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  <span className="text-neutral-700">
                    Conversa de carreira com gestor (até 28/05)
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  <span className="text-neutral-700">
                    Ajuste salarial · faixa atual P50
                  </span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-brand" />
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
              className="rounded-md border border-danger/30 bg-danger/5 p-2"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} strokeWidth={2.25} className="text-danger" />
                <p className="text-[9px] font-bold text-danger">Risco crítico</p>
              </div>
              <p className="mt-1 text-[8px] text-neutral-700">
                Ricardo A. · 87% de probabilidade nos próximos 90 dias
              </p>
            </motion.div>
          )}

          {step >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Simulação de impacto
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="rounded bg-surface-raised p-2 text-center">
                  <p className="text-[7px] uppercase text-neutral-500">Antes</p>
                  <p className="font-display text-[12px] font-bold text-danger tabular-nums">
                    87%
                  </p>
                </div>
                <div className="rounded border-2 border-success/30 bg-success/5 p-2 text-center">
                  <p className="text-[7px] uppercase text-success">Depois</p>
                  <p className="font-display text-[12px] font-bold text-success tabular-nums">
                    34%
                  </p>
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between rounded bg-success/10 px-2 py-1">
                <span className="text-[8px] font-semibold text-success">
                  Redução de risco
                </span>
                <span className="flex items-center gap-1 font-display text-[10px] font-bold text-success">
                  <TrendingDown size={10} strokeWidth={2.5} />
                  -61%
                </span>
              </div>
            </motion.div>
          )}

          {step < 2 && (
            <div className="rounded-md border border-dashed border-brand/20 bg-white/50 p-3 text-center text-[8px] text-neutral-500">
              Selecione uma pessoa para ver detalhes do risco
            </div>
          )}

          <div className="mt-auto rounded-md bg-white p-2 shadow-card">
            <p className="text-[7px] uppercase tracking-wider text-neutral-500">
              Modelo
            </p>
            <p className="text-[8px] font-semibold text-neutral-900">
              Random Forest · acurácia 91,2%
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[8px] text-success">
              <CheckCircle2 size={9} strokeWidth={2.5} />
              Última atualização: hoje 06:00
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
