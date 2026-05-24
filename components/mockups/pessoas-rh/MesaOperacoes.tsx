"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ScrollText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge, Button, Card } from "@/components/ui/shadcn";
import { people } from "@/lib/photos";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StackedAvatars } from "@/components/ui/StackedAvatars";

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
              <LayoutDashboard size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Mesa de Operações
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                6 unidades · tempo real
              </p>
            </div>
          </div>
        </div>
        <Badge variant="success">
          <Activity size={10} strokeWidth={2.5} />
          ao vivo
        </Badge>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_360px] gap-4 overflow-hidden p-4">
        <section className="flex flex-col gap-3 overflow-hidden">
          <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
            Mapa de unidades
          </p>
          <div
            data-tour="mo-grid"
            className="grid flex-1 grid-cols-3 gap-2.5"
          >
            {UNITS.map((unit, i) => {
              const isAlert = unit.status === "alert";
              return (
                <motion.div
                  key={unit.name}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-4 shadow-card transition-shadow",
                    isAlert && alertActive
                      ? "border-2 border-danger bg-gradient-to-br from-danger/5 via-white to-danger/10"
                      : "border border-brand/8 bg-white",
                  )}
                >
                  {isAlert && alertActive && (
                    <motion.span
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger"
                    />
                  )}
                  <p className="font-ui text-[12px] font-bold text-neutral-900">
                    {unit.name}
                  </p>
                  <div className="mt-2">
                    <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                      Presença
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 font-ui text-[28px] font-bold tabular-nums leading-none",
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

        <aside className="flex flex-col gap-3 overflow-hidden">
          {alertActive && !reallocating && (
            <motion.div
              data-tour="mo-alert"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-3.5"
            >
              <AlertTriangle
                size={20}
                strokeWidth={2}
                className="flex-none text-danger"
              />
              <div>
                <p className="font-ui text-[12px] font-bold text-danger">
                  Absenteísmo crítico
                </p>
                <p className="mt-0.5 font-ui text-[11px] text-neutral-700">
                  Unidade Norte com 62%, 22pp abaixo da meta. 8 ausentes.
                </p>
              </div>
            </motion.div>
          )}

          {/* Live alert feed — chat-style stream de eventos por unidade */}
          <div
            className="flex min-h-0 flex-1 flex-col rounded-2xl bg-white p-3 shadow-subtle"
            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between">
              <p
                className="font-ui text-[10px] font-bold uppercase text-brand"
                style={{ letterSpacing: "0.10em" }}
              >
                Feed ao vivo
              </p>
              <span className="flex items-center gap-1 font-ui text-[9px] font-bold text-success">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-success"
                />
                4 eventos / 12min
              </span>
            </div>
            <div className="mt-2 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
              {[
                {
                  who: "Unidade Norte",
                  photo: people.diego,
                  when: "agora",
                  msg: "8 ausentes confirmadas no almoço",
                  tone: "danger" as const,
                },
                {
                  who: "Filial Centro",
                  photo: people.ana,
                  when: "3 min",
                  msg: "+2 disponíveis para realocação",
                  tone: "success" as const,
                },
                {
                  who: "Unidade Sul",
                  photo: people.sofia,
                  when: "7 min",
                  msg: "Presença normalizou em 96%",
                  tone: "success" as const,
                },
                {
                  who: "Café da Praça",
                  photo: people.mariana,
                  when: "12 min",
                  msg: "Pico de demanda atendido",
                  tone: "brand" as const,
                },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.22 }}
                  className={cn(
                    "flex items-start gap-2 rounded-lg p-2",
                    m.tone === "danger" && "bg-danger/5",
                    m.tone === "success" && "bg-success/5",
                    m.tone === "brand" && "bg-brand-ghost",
                  )}
                >
                  <PersonAvatar photo={m.photo} name={m.who} size={24} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className="font-ui text-[10px] font-bold text-neutral-900">
                        {m.who}
                      </p>
                      <span className="font-ui text-[8px] tabular-nums text-neutral-400">
                        {m.when}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 font-ui text-[10px] leading-snug",
                        m.tone === "danger" && "text-danger",
                        m.tone === "success" && "text-success",
                        m.tone === "brand" && "text-brand",
                      )}
                    >
                      {m.msg}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {reallocating && !confirmed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Ação sugerida
                </p>
                <div className="mt-3 flex items-center justify-between gap-2 font-ui text-[12px]">
                  <div>
                    <p className="font-bold text-neutral-900">Filial Centro</p>
                    <p className="font-ui text-[10px] text-neutral-500">
                      +2 disponíveis
                    </p>
                    <div className="mt-1.5">
                      <StackedAvatars
                        size={26}
                        max={3}
                        people={[
                          { name: "Mariana Costa", photo: people.mariana },
                          { name: "Ana Costa", photo: people.ana },
                          { name: "Sofia Almeida", photo: people.sofia },
                        ]}
                      />
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    strokeWidth={2}
                    className="flex-none text-brand"
                  />
                  <div>
                    <p className="font-bold text-neutral-900">Unidade Norte</p>
                    <p className="font-ui text-[10px] text-neutral-500">
                      precisa cobrir
                    </p>
                    <div className="mt-1.5">
                      <StackedAvatars
                        size={26}
                        max={2}
                        people={[
                          { name: "Pedro Souza", photo: people.pedro },
                          { name: "Diego Lima", photo: people.diego },
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  data-tour="mo-realloc"
                  variant="default"
                  size="lg"
                  className="mt-3 w-full"
                >
                  Confirmar realocação
                </Button>
              </Card>
            </motion.div>
          )}

          {confirmed && (
            <motion.div
              data-tour="mo-confirmed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border border-success/30 bg-success/5 p-3.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  strokeWidth={2.25}
                  className="text-success"
                />
                <span className="font-ui text-[12px] font-bold text-success">
                  Atualizado
                </span>
              </div>
              <p className="mt-1 font-ui text-[11px] text-neutral-700">
                Unidade Norte agora projeta 82% de presença
              </p>
            </motion.div>
          )}

          {logged && (
            <motion.div
              data-tour="mo-log"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="mt-auto"
            >
              <Card className="p-4">
                <p className="flex items-center gap-1.5 font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  <ScrollText size={12} strokeWidth={2} />
                  Log de operação
                </p>
                <ul className="mt-2 space-y-1 font-ui text-[11px] text-neutral-600">
                  <li>14:38 · Alerta absenteísmo Norte</li>
                  <li>14:39 · Sugestão de realocação</li>
                  <li>14:40 · Realocação confirmada, 2 colaboradores</li>
                </ul>
              </Card>
            </motion.div>
          )}
        </aside>
      </main>
    </div>
  );
}
