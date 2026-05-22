"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
import { Badge, Button, Card } from "@/components/ui/shadcn";

interface RotinaRastreabilidadeProps {
  step: number;
}

const TIMELINE = [
  {
    Icon: Truck,
    label: "Recebido do fornecedor",
    sub: "Distribuidora São Paulo",
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

export function RotinaRastreabilidadeMockup({
  step,
}: RotinaRastreabilidadeProps) {
  const searched = step >= 0;
  const showTimeline = step >= 1;
  const showOrigin = step >= 2;
  const showRecall = step >= 3;
  const showReport = step >= 4;

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
              <GitBranch size={14} strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <p className="font-ui text-[13px] font-bold text-neutral-900">
                Rastreabilidade
              </p>
              <p className="font-ui text-[11px] text-neutral-500">
                ERP Backoffice · Compliance
              </p>
            </div>
          </div>
        </div>
        {showReport && (
          <Badge variant="success">
            <FileText size={10} strokeWidth={2.5} />
            Relatório pronto
          </Badge>
        )}
      </header>

      <main className="grid flex-1 grid-cols-[1fr_360px] gap-4 overflow-hidden p-4">
        <section className="flex flex-col gap-3 overflow-hidden">
          <Card className="p-4">
            <div
              data-tour="rr-search"
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5"
            >
              <Search size={14} strokeWidth={2} className="text-neutral-400" />
              <span className="font-ui text-[12px] font-bold tracking-wider text-neutral-700">
                LOTE-AP247-2026-05
              </span>
            </div>
            {searched && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="mt-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-ui text-[13px] font-bold text-neutral-900">
                    Arroz parboilizado 5kg
                  </p>
                  <p className="font-ui text-[11px] text-neutral-500">
                    Lote AP247 · Validade 18/04/2027
                  </p>
                </div>
                <Badge variant="success">Localizado</Badge>
              </motion.div>
            )}
          </Card>

          {showTimeline && (
            <motion.div
              data-tour="rr-timeline"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Linha do tempo
                </p>
                <ol className="relative mt-3 space-y-3 border-l-2 border-dashed border-neutral-200 pl-5">
                  {TIMELINE.map((t, i) => (
                    <motion.li
                      key={t.label}
                      initial={{ x: 4, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.06 * i, duration: 0.22 }}
                      className="relative"
                    >
                      <span
                        className={cn(
                          "absolute -left-[26px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full",
                          t.tone === "active"
                            ? "bg-brand text-white shadow-brand"
                            : "bg-brand-subtle text-brand",
                        )}
                      >
                        <t.Icon size={11} strokeWidth={2.25} />
                      </span>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-ui text-[12px] font-bold text-neutral-900">
                            {t.label}
                          </p>
                          <p className="font-ui text-[11px] text-neutral-500">
                            {t.sub}
                          </p>
                        </div>
                        <span className="font-ui text-[10px] tabular-nums text-neutral-400">
                          {t.when}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </Card>
            </motion.div>
          )}
        </section>

        <aside className="flex flex-col gap-3 overflow-hidden">
          {showOrigin && (
            <motion.div
              data-tour="rr-chain"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="p-4">
                <p className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-brand">
                  Cadeia de origem
                </p>
                <div className="mt-3 space-y-2.5">
                  <Hop label="Produtor" detail="Coopcal · Goiás" tone="default" />
                  <Hop label="Distribuidor" detail="DS São Paulo" tone="default" />
                  <Hop label="CD Teknisa" detail="A12-3" tone="default" />
                  <Hop label="Filial Centro" detail="Sua unidade" tone="active" />
                </div>
              </Card>
            </motion.div>
          )}

          {showRecall && (
            <motion.div
              data-tour="rr-recall"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22 }}
              className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/5 p-3.5"
            >
              <AlertTriangle
                size={20}
                strokeWidth={2}
                className="flex-none text-danger"
              />
              <div>
                <p className="font-ui text-[12px] font-bold text-danger">
                  Alerta de recall
                </p>
                <p className="mt-0.5 font-ui text-[11px] text-neutral-600">
                  Lote AP247 sob investigação. Suspender uso imediato.
                </p>
              </div>
            </motion.div>
          )}

          {showReport && (
            <motion.div
              data-tour="rr-report"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.22 }}
              className="mt-auto"
            >
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-brand text-white shadow-brand">
                    <FileText size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-ui text-[12px] font-bold text-neutral-900">
                      Relatório de rastreabilidade
                    </p>
                    <p className="font-ui text-[11px] text-neutral-500">
                      Exportado em PDF · 24 páginas
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  className="mt-3 w-full"
                >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Compartilhar com auditoria
                </Button>
              </Card>
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
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "h-2.5 w-2.5 flex-none rounded-full",
          tone === "active" ? "bg-brand shadow-brand" : "bg-brand/30",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="font-ui text-[12px] font-bold text-neutral-900">{label}</p>
        <p className="truncate font-ui text-[11px] text-neutral-500">{detail}</p>
      </div>
    </div>
  );
}
