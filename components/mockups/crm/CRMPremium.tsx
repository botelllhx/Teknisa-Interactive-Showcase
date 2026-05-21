"use client";

import { motion } from "framer-motion";
import {
  Heart,
  TrendingUp,
  Star,
  Gift,
  Sparkles,
  Send,
  CheckCircle2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface CRMPremiumProps {
  step: number;
}

const KPIS = [
  { label: "Base ativa", value: "18.420", delta: "+4,2%" },
  { label: "LTV médio", value: "R$ 642", delta: "+8,7%" },
  { label: "Recompra", value: "61%", delta: "+3,1%" },
];

const SEGMENT_BARS = [62, 41, 28, 18, 12, 8];

const CUSTOMER_HISTORY = [
  { label: "Última visita", value: "há 5 dias", tone: "default" as const },
  { label: "Frequência", value: "8x no mês", tone: "success" as const },
  { label: "Ticket médio", value: "R$ 78,90", tone: "default" as const },
  { label: "Categoria favorita", value: "Massas", tone: "default" as const },
];

export function CRMPremiumMockup({ step }: CRMPremiumProps) {
  const profile = step >= 1;
  const campaign = step >= 2;
  const offer = step >= 3;
  const activated = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <Heart size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              CRM Premium
            </p>
            <p className="text-[8px] text-neutral-500">
              Fidelidade · Maio 2026
            </p>
          </div>
        </div>
        {activated && (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
            <CheckCircle2 size={9} strokeWidth={2.5} />
            Campanha ativa
          </span>
        )}
      </header>

      <main className="grid flex-1 grid-cols-[1fr_38%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <div className="rounded-md bg-white p-2 shadow-card">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
              Indicadores · 30 dias
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {KPIS.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded bg-surface-raised p-1.5"
                >
                  <p className="text-[7px] uppercase text-neutral-500">
                    {kpi.label}
                  </p>
                  <p className="font-display text-[12px] font-bold text-neutral-900 tabular-nums">
                    {kpi.value}
                  </p>
                  <p className="flex items-center gap-0.5 text-[7px] font-semibold text-success">
                    <TrendingUp size={8} strokeWidth={2.5} />
                    {kpi.delta}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-[7px] uppercase tracking-wider text-neutral-500">
                Segmentos de fidelidade
              </p>
              <div className="mt-1 flex h-12 items-end gap-1">
                {SEGMENT_BARS.map((v, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.35 }}
                    style={{ height: `${v}%`, transformOrigin: "bottom" }}
                    className={cn(
                      "flex-1 rounded-t",
                      i < 2 ? "bg-brand" : "bg-brand/40",
                    )}
                  />
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[7px] text-neutral-500">
                <span>VIP</span>
                <span>Frequente</span>
                <span>Casual</span>
                <span>Esporádico</span>
                <span>Inativo</span>
                <span>Churn</span>
              </div>
            </div>
          </div>

          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-md bg-white p-2 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-[10px] font-bold text-white shadow-brand">
                  AS
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-semibold text-neutral-900">
                    Ana Silva
                  </p>
                  <p className="text-[8px] text-neutral-500">
                    ana.silva@email.com · São Paulo, SP
                  </p>
                </div>
                <span className="flex items-center gap-0.5 rounded-full bg-warning/10 px-2 py-0.5 text-[8px] font-bold text-warning">
                  <Star size={9} strokeWidth={2} className="fill-warning" />
                  VIP
                </span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {CUSTOMER_HISTORY.map((h, i) => (
                  <motion.div
                    key={h.label}
                    initial={{ x: 4, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i }}
                    className="rounded bg-surface-raised p-1.5"
                  >
                    <p className="text-[7px] uppercase text-neutral-500">
                      {h.label}
                    </p>
                    <p
                      className={cn(
                        "text-[9px] font-bold",
                        h.tone === "success" && "text-success",
                        h.tone === "default" && "text-neutral-900",
                      )}
                    >
                      {h.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-2">
          {campaign && !activated && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md border border-brand/30 bg-gradient-to-br from-brand-ghost via-white to-brand-subtle p-2"
            >
              <div className="flex items-center gap-2">
                <Gift size={14} strokeWidth={2.25} className="text-brand" />
                <p className="font-display text-[9px] font-bold text-brand">
                  Nova campanha
                </p>
              </div>
              <p className="mt-1 font-display text-[11px] font-bold text-neutral-900">
                Volta da Ana
              </p>
              <p className="text-[8px] text-neutral-500">
                Reativar VIPs com mais de 7 dias sem visitar
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {["VIPs", "Inativos 7d+", "Categoria: Massas"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2 py-0.5 text-[7px] font-semibold text-brand shadow-card"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {offer && !activated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wider text-brand">
                <Sparkles size={10} strokeWidth={2.25} />
                Oferta personalizada
              </p>
              <div className="mt-2 rounded border-2 border-brand bg-brand-ghost p-2 text-center">
                <p className="font-display text-[18px] font-bold leading-none text-brand">
                  20% OFF
                </p>
                <p className="mt-1 text-[8px] text-neutral-700">
                  Em massas frescas + entrega grátis
                </p>
                <p className="mt-1 text-[7px] text-neutral-500">
                  Válido por 48h · Cupom AVOLTA20
                </p>
              </div>
              <div className="mt-2 flex items-center justify-between text-[8px]">
                <span className="text-neutral-500">Alcance estimado</span>
                <span className="flex items-center gap-0.5 font-bold text-brand">
                  <Users size={9} strokeWidth={2.25} />
                  1.842 clientes
                </span>
              </div>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-brand py-1.5 text-[9px] font-bold text-white shadow-brand"
              >
                <Send size={11} strokeWidth={2} />
                Ativar campanha
              </button>
            </motion.div>
          )}

          {activated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md border border-success/30 bg-success/5 p-3"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-white shadow-brand"
                >
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </motion.div>
                <div>
                  <p className="text-[9px] font-bold text-success">
                    Campanha ativada
                  </p>
                  <p className="text-[8px] text-neutral-600">
                    Disparada para 1.842 clientes VIPs
                  </p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center">
                {[
                  { label: "Enviadas", value: "1.842" },
                  { label: "Abertas", value: "920" },
                  { label: "Resgatadas", value: "184" },
                ].map((s) => (
                  <div key={s.label} className="rounded bg-white p-1.5">
                    <p className="text-[7px] uppercase text-neutral-500">
                      {s.label}
                    </p>
                    <p className="font-display text-[10px] font-bold text-success tabular-nums">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!campaign && (
            <div className="rounded-md border border-dashed border-brand/20 bg-white/50 p-3 text-center text-[8px] text-neutral-500">
              Selecione um cliente para criar campanha personalizada
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
