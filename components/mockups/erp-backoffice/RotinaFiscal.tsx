"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
import { Badge, Button, Card } from "@/components/ui/shadcn";

interface RotinaFiscalProps {
  step: number;
}

const OBLIGATIONS = [
  { code: "SPED Fiscal", desc: "Apuração ICMS/IPI", due: "20/05", status: "ok" as const },
  { code: "EFD-Reinf", desc: "Retenções federais", due: "21/05", status: "pending" as const },
  { code: "DCTFWeb", desc: "Débitos e créditos", due: "22/05", status: "pending" as const },
  { code: "SPED Contribuições", desc: "PIS/COFINS", due: "25/05", status: "next" as const },
];

export function RotinaFiscalMockup({ step }: RotinaFiscalProps) {
  const showReforma = step >= 1;
  const showValidation = step >= 2;
  const showApuracao = step >= 3;
  const declared = step >= 4;

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
              <FileText size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Rotina Fiscal
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                ERP Backoffice · Maio 2026
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">
            <Sparkles size={10} strokeWidth={2.5} />
            Reforma 2026
          </Badge>
          {declared && (
            <Badge variant="success">
              <CheckCircle2 size={10} strokeWidth={2.5} />
              SPED enviado
            </Badge>
          )}
        </div>
      </header>

      <main className="grid flex-1 grid-cols-[1fr_360px] gap-4 overflow-hidden p-4">
        <section className="flex flex-col gap-3 overflow-hidden">
          <Card data-tour="rf-obligations" className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                Obrigações do mês
              </p>
              <span className="font-ui text-[11px] text-neutral-500">
                4 itens
              </span>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {OBLIGATIONS.map((o, i) => (
                <motion.li
                  key={o.code}
                  initial={{ x: 6, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.04 * i, duration: 0.22 }}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        o.status === "ok" && "bg-success",
                        o.status === "pending" && "bg-warning",
                        o.status === "next" && "bg-neutral-300",
                      )}
                    />
                    <div>
                      <p className="font-ui text-[12px] font-bold text-neutral-900">
                        {o.code}
                      </p>
                      <p className="font-ui text-[10px] text-neutral-500">
                        {o.desc}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 font-ui text-[11px] tabular-nums text-neutral-500">
                    <Calendar size={11} strokeWidth={2} />
                    {o.due}
                  </span>
                </motion.li>
              ))}
            </ul>
          </Card>

          {showReforma && (
            <motion.div
              data-tour="rf-reform-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative overflow-hidden rounded-2xl border border-warning/30 bg-gradient-to-br from-warning/5 via-white to-warning/10 p-4"
            >
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-warning/15"
              />
              <div className="relative flex items-start gap-3">
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-warning/15 text-warning">
                  <ShieldCheck size={22} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-ui text-[14px] font-bold text-warning">
                    Reforma Tributária 2026
                  </p>
                  <p className="font-ui text-[11px] text-neutral-700">
                    Nova estrutura tributária ativa a partir de 01/01/2026
                  </p>
                </div>
              </div>
              <div className="relative mt-3 flex flex-wrap gap-1.5">
                {["IBS", "CBS", "IS", "Split Payment"].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ y: 4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + 0.05 * i }}
                    className="rounded-full bg-white px-2.5 py-1 font-ui text-[10px] font-bold text-warning shadow-card"
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
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Validação automática de notas
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Stat label="Validadas" value="1.842" tone="success" />
                  <Stat label="Inconsistência" value="12" tone="warning" />
                  <Stat label="Pendentes" value="6" tone="neutral" />
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 font-ui text-[11px] font-bold text-success">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  Mapeamento IBS/CBS aplicado automaticamente
                </div>
              </Card>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-3 overflow-hidden">
          {showApuracao ? (
            <motion.div
              data-tour="rf-comparison"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Apuração comparativa
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-neutral-50 p-3">
                    <p className="font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-neutral-500">
                      Regime atual
                    </p>
                    <p className="mt-1 font-ui text-[22px] font-bold tabular-nums leading-none text-neutral-700">
                      R$ 84,2k
                    </p>
                    <p className="mt-1 font-ui text-[10px] text-neutral-500">
                      ICMS + ISS + PIS/COFINS
                    </p>
                  </div>
                  <div className="rounded-xl border-2 border-warning/30 bg-warning/5 p-3">
                    <p className="flex items-center gap-1 font-ui text-[10px] font-bold uppercase tracking-[1.5px] text-warning">
                      <Sparkles size={10} strokeWidth={2.5} />
                      Novo regime
                    </p>
                    <p className="mt-1 font-ui text-[22px] font-bold tabular-nums leading-none text-warning">
                      R$ 79,4k
                    </p>
                    <p className="mt-1 font-ui text-[10px] text-warning">
                      IBS + CBS + IS
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-success/10 px-3 py-2">
                  <span className="font-ui text-[11px] font-bold text-success">
                    Economia projetada
                  </span>
                  <span className="flex items-center gap-1 font-ui text-[14px] font-bold tabular-nums text-success">
                    <TrendingDown size={13} strokeWidth={2.5} />
                    −5,7%
                  </span>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-brand/20 bg-white/60 p-4 text-center font-ui text-[11px] italic text-neutral-500">
              Apuração comparativa aparece após validação
            </div>
          )}

          <Card className="mt-auto p-4">
            <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
              SPED
            </p>
            <p className="mt-1 font-ui text-[11px] text-neutral-500">
              Período: 01/05 a 31/05
            </p>
            <Button
              type="button"
              data-tour="rf-send"
              variant={declared ? "success" : "default"}
              size="lg"
              className="mt-3 w-full"
            >
              {declared ? (
                <>
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Enviado · 21/05 14:38
                </>
              ) : (
                <>
                  <Send size={14} strokeWidth={2} />
                  Gerar e transmitir
                </>
              )}
            </Button>
          </Card>
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
    <div className="rounded-xl bg-neutral-50 p-2.5 text-center">
      <p className="font-ui text-[9px] font-bold uppercase tracking-[1.5px] text-neutral-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-ui text-[20px] font-bold tabular-nums leading-none",
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
