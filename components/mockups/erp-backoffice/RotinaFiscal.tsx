"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Send,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface RotinaFiscalProps {
  step: number;
}

const OBLIGATIONS = [
  { code: "SPED Fiscal", due: "20/05", status: "ok" as const },
  { code: "EFD-Reinf", due: "21/05", status: "pending" as const },
  { code: "DCTFWeb", due: "22/05", status: "pending" as const },
  { code: "SPED Contribuições", due: "25/05", status: "next" as const },
];

export function RotinaFiscalMockup({ step }: RotinaFiscalProps) {
  const showReforma = step >= 1;
  const showValidation = step >= 2;
  const showApuracao = step >= 3;
  const declared = step >= 4;

  return (
    <div className="flex h-full w-full flex-col bg-surface-raised text-neutral-800">
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-card">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
            <FileText size={12} strokeWidth={2} />
          </div>
          <div>
            <p className="font-display text-[10px] font-bold text-neutral-900">
              Rotina Fiscal
            </p>
            <p className="text-[8px] text-neutral-500">
              ERP Backoffice · Maio 2026
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[8px] font-bold text-warning">
            <Sparkles size={9} strokeWidth={2.5} />
            Reforma 2026
          </span>
          {declared && (
            <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[8px] font-bold text-success">
              <CheckCircle2 size={9} strokeWidth={2.5} />
              SPED enviado
            </span>
          )}
        </div>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_36%] gap-3 p-3">
        <section className="flex flex-col gap-2">
          <div data-tour="rf-obligations" className="rounded-md bg-white p-2 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Obrigações do mês
              </p>
              <span className="text-[8px] text-neutral-500">4 itens</span>
            </div>
            <ul className="mt-2 space-y-1">
              {OBLIGATIONS.map((o, i) => (
                <motion.li
                  key={o.code}
                  initial={{ x: 6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className="flex items-center justify-between rounded bg-surface-raised px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        o.status === "ok" && "bg-success",
                        o.status === "pending" && "bg-warning",
                        o.status === "next" && "bg-neutral-300",
                      )}
                    />
                    <span className="text-[9px] font-semibold text-neutral-900">
                      {o.code}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[8px] text-neutral-500">
                    <Calendar size={9} strokeWidth={2} />
                    {o.due}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {showReforma && (
            <motion.div
              data-tour="rf-reform-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-md border border-warning/30 bg-gradient-to-br from-warning/5 via-white to-warning/10 p-3"
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-warning/15"
              />
              <div className="relative flex items-start gap-2">
                <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-warning/15 text-warning">
                  <ShieldCheck size={18} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-display text-[10px] font-bold text-warning">
                    Reforma Tributária 2026
                  </p>
                  <p className="text-[8px] text-neutral-700">
                    Nova estrutura tributária ativa a partir de 01/01/2026
                  </p>
                </div>
              </div>
              <div className="relative mt-2 flex flex-wrap gap-1">
                {["IBS", "CBS", "IS", "Split Payment"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ y: 4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + 0.05 * i }}
                    className="rounded-full bg-white px-2 py-0.5 text-[8px] font-bold text-warning shadow-card"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {showValidation && (
            <motion.div
              data-tour="rf-validation"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 rounded-md bg-white p-2 shadow-card"
            >
              <p className="text-[8px] font-semibold uppercase tracking-wider text-brand">
                Validação automática de notas
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                <Stat label="Notas validadas" value="1.842" tone="success" />
                <Stat label="Com inconsistência" value="12" tone="warning" />
                <Stat label="Pendentes" value="6" tone="neutral" />
              </div>
              <div className="mt-2 rounded bg-success/10 px-2 py-1 text-[8px] font-semibold text-success">
                <CheckCircle2 size={9} strokeWidth={2.5} className="inline mr-1" />
                Mapeamento IBS/CBS aplicado automaticamente
              </div>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-2">
          {showApuracao ? (
            <motion.div
              data-tour="rf-comparison"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-md bg-white p-2 shadow-card"
            >
              <p className="font-display text-[8px] font-bold uppercase text-brand">
                Apuração comparativa
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="rounded bg-surface-raised p-2">
                  <p className="text-[7px] uppercase text-neutral-500">
                    Regime atual
                  </p>
                  <p className="mt-0.5 font-display text-[12px] font-bold text-neutral-700 tabular-nums">
                    R$ 84,2k
                  </p>
                  <p className="text-[7px] text-neutral-500">ICMS + ISS + PIS/COFINS</p>
                </div>
                <div className="rounded border-2 border-warning/30 bg-warning/5 p-2">
                  <p className="flex items-center gap-1 text-[7px] uppercase text-warning">
                    <Sparkles size={8} strokeWidth={2.5} />
                    Novo regime
                  </p>
                  <p className="mt-0.5 font-display text-[12px] font-bold text-warning tabular-nums">
                    R$ 79,4k
                  </p>
                  <p className="text-[7px] text-warning">IBS + CBS + IS</p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded bg-success/10 px-2 py-1">
                <span className="text-[8px] font-semibold text-success">
                  Economia projetada
                </span>
                <span className="flex items-center gap-1 font-display text-[10px] font-bold text-success">
                  <TrendingDown size={10} strokeWidth={2.5} />
                  -5,7%
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-md border border-dashed border-brand/20 bg-white/50 p-3 text-center text-[8px] text-neutral-500">
              Apuração comparativa aparece após validação
            </div>
          )}

          <div className="mt-auto rounded-md bg-white p-2 shadow-card">
            <p className="font-display text-[8px] font-bold uppercase text-brand">
              SPED
            </p>
            <p className="mt-1 text-[8px] text-neutral-500">
              Período: 01/05 – 31/05
            </p>
            <button
              type="button"
              data-tour="rf-send"
              className={cn(
                "mt-2 flex w-full items-center justify-center gap-1 rounded py-1.5 text-[9px] font-bold",
                declared
                  ? "bg-success text-white shadow-brand"
                  : "bg-brand text-white shadow-brand",
              )}
            >
              {declared ? (
                <>
                  <CheckCircle2 size={11} strokeWidth={2.5} />
                  Enviado · 21/05 14:38
                </>
              ) : (
                <>
                  <Send size={11} strokeWidth={2} />
                  Gerar e transmitir
                </>
              )}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "neutral";
}) {
  return (
    <div className="rounded bg-surface-raised p-1.5 text-center">
      <p className="text-[7px] uppercase text-neutral-500">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-display text-[12px] font-bold tabular-nums",
          tone === "success" && "text-success",
          tone === "warning" && "text-warning",
          tone === "neutral" && "text-neutral-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}
