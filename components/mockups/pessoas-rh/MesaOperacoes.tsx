"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ScrollText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface MesaOperacoesProps {
  step: number;
}

const UNITS = [
  { name: "Filial Centro", presence: 94, status: "ok" as const },
  { name: "Ala B", presence: 88, status: "ok" as const },
  { name: "Unidade Norte", presence: 62, status: "alert" as const },
  { name: "Unidade Sul", presence: 96, status: "ok" as const },
  { name: "Unidade Oeste", presence: 91, status: "ok" as const },
  { name: "Café da Praça", presence: 100, status: "ok" as const },
];

export function MesaOperacoesMockup({ step }: MesaOperacoesProps) {
  const alertActive = step >= 1;
  const reallocating = step >= 2;
  const confirmed = step >= 3;
  const logged = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <LayoutDashboard size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Mesa de Operações
            </p>
            <p className="text-[8px] text-neutral-500">6 unidades · tempo real</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
          <Activity size={9} strokeWidth={2.5} />
          ao vivo
        </span>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_38%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <p className="text-[8px] font-semibold uppercase tracking-wider text-neutral-500">
            Mapa de unidades
          </p>
          <div data-tour="mo-grid" className="grid flex-1 grid-cols-3 gap-1.5">
            {UNITS.map((unit, i) => {
              const isAlert = unit.status === "alert";
              return (
                <motion.div
                  key={unit.name}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className={cn(
                    "relative flex flex-col justify-between rounded-md p-2 shadow-card",
                    isAlert && alertActive
                      ? "border-2 border-danger bg-danger/5"
                      : "border border-brand/10 bg-white",
                  )}
                >
                  {isAlert && alertActive && (
                    <motion.span
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-danger"
                    />
                  )}
                  <p className="text-[8px] font-semibold text-neutral-900">
                    {unit.name}
                  </p>
                  <div className="mt-1">
                    <p className="text-[7px] uppercase text-neutral-500">
                      Presença
                    </p>
                    <p
                      className={cn(
                        "font-display text-[14px] font-bold tabular-nums",
                        isAlert && alertActive ? "text-danger" : "text-brand",
                      )}
                    >
                      {unit.presence}%
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-2">
          {alertActive && !reallocating && (
            <motion.div
              data-tour="mo-alert"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 p-2"
            >
              <AlertTriangle
                size={16}
                strokeWidth={2}
                className="flex-none text-danger"
              />
              <div>
                <p className="text-[9px] font-bold text-danger">
                  Absenteísmo crítico
                </p>
                <p className="mt-0.5 text-[8px] text-neutral-700">
                  Unidade Norte com 62% (–22pp vs. meta) · 8 ausentes
                </p>
              </div>
            </motion.div>
          )}

          {reallocating && !confirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Ação sugerida
              </p>
              <div className="mt-1.5 flex items-center justify-between text-[9px]">
                <div>
                  <p className="font-semibold text-neutral-900">
                    Filial Centro
                  </p>
                  <p className="text-[8px] text-neutral-500">+2 disponíveis</p>
                </div>
                <ArrowRight size={14} strokeWidth={2} className="text-brand" />
                <div>
                  <p className="font-semibold text-neutral-900">
                    Unidade Norte
                  </p>
                  <p className="text-[8px] text-neutral-500">precisa cobrir</p>
                </div>
              </div>
              <button
                type="button"
                data-tour="mo-realloc"
                className="mt-2 w-full rounded bg-brand py-1.5 text-[9px] font-bold text-white shadow-brand"
              >
                Confirmar realocação
              </button>
            </motion.div>
          )}

          {confirmed && (
            <motion.div
              data-tour="mo-confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md border border-success/30 bg-success/5 p-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} strokeWidth={2.25} className="text-success" />
                <span className="text-[9px] font-bold text-success">
                  Atualizado
                </span>
              </div>
              <p className="mt-1 text-[8px] text-neutral-700">
                Unidade Norte agora projeta 82% de presença
              </p>
            </motion.div>
          )}

          {logged && (
            <motion.div
              data-tour="mo-log"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-auto rounded-md bg-white p-2 shadow-card"
            >
              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-brand">
                <ScrollText size={10} strokeWidth={2} />
                Log de operação
              </p>
              <ul className="mt-1 space-y-0.5 text-[8px] text-neutral-600">
                <li>14:38 · Alerta absenteísmo Norte</li>
                <li>14:39 · Sugestão de realocação</li>
                <li>14:40 · Realocação confirmada · 2 colaboradores</li>
              </ul>
            </motion.div>
          )}
        </aside>
      </main>
    </div>
  );
}
