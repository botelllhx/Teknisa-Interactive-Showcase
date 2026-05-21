"use client";

import { motion } from "framer-motion";
import {
  GitBranch,
  Search,
  Package,
  Truck,
  Store,
  AlertTriangle,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface RotinaRastreabilidadeProps {
  step: number;
}

const TIMELINE = [
  {
    Icon: Truck,
    label: "Recebido do fornecedor",
    sub: "Fornecedor: Distribuidora São Paulo",
    when: "18/05 · 06:42",
    tone: "default" as const,
  },
  {
    Icon: Package,
    label: "Conferência e estocagem",
    sub: "Estoque CD-Central · Posição A12-3",
    when: "18/05 · 08:15",
    tone: "default" as const,
  },
  {
    Icon: GitBranch,
    label: "Transferência",
    sub: "Filial Centro · NF-2847",
    when: "20/05 · 11:30",
    tone: "default" as const,
  },
  {
    Icon: Store,
    label: "Saída para produção",
    sub: "Cozinha · OS-5821",
    when: "21/05 · 05:18",
    tone: "active" as const,
  },
];

export function RotinaRastreabilidadeMockup({ step }: RotinaRastreabilidadeProps) {
  const searched = step >= 0;
  const showTimeline = step >= 1;
  const showOrigin = step >= 2;
  const showRecall = step >= 3;
  const showReport = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <GitBranch size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Rastreabilidade
            </p>
            <p className="text-[8px] text-neutral-500">
              ERP Backoffice · Compliance
            </p>
          </div>
        </div>
        {showReport && (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-semibold text-success">
            <FileText size={9} strokeWidth={2.5} />
            Relatório pronto
          </span>
        )}
      </header>

      <main className="grid flex-1 grid-cols-[1fr_36%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <div className="rounded-md bg-white p-2 shadow-card">
            <div data-tour="rr-search" className="flex items-center gap-2 rounded bg-surface-raised px-2 py-1.5">
              <Search size={12} strokeWidth={2} className="text-neutral-400" />
              <span className="text-[9px] font-mono text-neutral-700">
                LOTE-AP247-2026-05
              </span>
            </div>
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center justify-between text-[8px]"
              >
                <div>
                  <p className="font-semibold text-neutral-900">
                    Arroz parboilizado 5kg
                  </p>
                  <p className="text-neutral-500">
                    Lote AP247 · Validade 18/04/2027
                  </p>
                </div>
                <span className="rounded-full bg-success/10 px-2 py-0.5 font-bold text-success">
                  Localizado
                </span>
              </motion.div>
            )}
          </div>

          {showTimeline && (
            <motion.div
              data-tour="rr-timeline"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Linha do tempo
              </p>
              <ol className="relative mt-2 space-y-1.5 border-l border-dashed border-neutral-200 pl-3">
                {TIMELINE.map((t, i) => (
                  <motion.li
                    key={t.label}
                    initial={{ x: 4, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.07 * i }}
                    className="relative"
                  >
                    <span
                      className={cn(
                        "absolute -left-[14px] top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full",
                        t.tone === "active"
                          ? "bg-brand text-white shadow-brand"
                          : "bg-brand-subtle text-brand",
                      )}
                    >
                      <t.Icon size={8} strokeWidth={2.25} />
                    </span>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-semibold text-neutral-900">
                          {t.label}
                        </p>
                        <p className="text-[8px] text-neutral-500">{t.sub}</p>
                      </div>
                      <span className="text-[7px] tabular-nums text-neutral-400">
                        {t.when}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-2">
          {showOrigin && (
            <motion.div
              data-tour="rr-chain"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="font-display text-[8px] font-bold uppercase text-brand">
                Cadeia de origem
              </p>
              <div className="mt-2 space-y-2">
                <Hop label="Produtor" detail="Coopcal · Goiás" tone="default" />
                <Hop label="Distribuidor" detail="DS São Paulo" tone="default" />
                <Hop label="CD Teknisa" detail="A12-3" tone="default" />
                <Hop label="Filial Centro" detail="Sua unidade" tone="active" />
              </div>
            </motion.div>
          )}

          {showRecall && (
            <motion.div
              data-tour="rr-recall"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 p-2"
            >
              <AlertTriangle size={16} strokeWidth={2} className="text-danger" />
              <div>
                <p className="text-[9px] font-bold text-danger">
                  Alerta de recall
                </p>
                <p className="text-[8px] text-neutral-600">
                  Lote AP247 sob investigação · Suspender uso
                </p>
              </div>
            </motion.div>
          )}

          {showReport && (
            <motion.div
              data-tour="rr-report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-auto rounded-md bg-white p-2 shadow-card"
            >
              <div className="flex items-start gap-2">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand text-white shadow-brand">
                  <FileText size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-neutral-900">
                    Relatório de rastreabilidade
                  </p>
                  <p className="text-[8px] text-neutral-500">
                    Exportado em PDF · 24 páginas
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-brand py-1.5 text-[9px] font-bold text-white shadow-brand"
              >
                <CheckCircle2 size={11} strokeWidth={2.5} />
                Compartilhar com auditoria
              </button>
            </motion.div>
          )}
        </aside>
      </main>
    </div>
  );
}

function Hop({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: "default" | "active";
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "h-2 w-2 flex-none rounded-full",
          tone === "active" ? "bg-brand shadow-brand" : "bg-brand/30",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold text-neutral-900">{label}</p>
        <p className="truncate text-[8px] text-neutral-500">{detail}</p>
      </div>
    </div>
  );
}
