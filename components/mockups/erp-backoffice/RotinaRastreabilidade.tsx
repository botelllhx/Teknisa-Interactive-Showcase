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
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
              style={{
                background:
                  "linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)",
                boxShadow:
                  "0 3px 8px rgba(13,148,136,0.32), inset 0 1px 0 rgba(255,255,255,0.20)",
              }}
            >
              <GitBranch size={15} strokeWidth={2.25} />
            </span>
            <div className="leading-tight">
              <p
                className="font-display text-[14px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.018em" }}
              >
                Rastreabilidade
              </p>
              <p
                className="font-ui text-[10.5px] text-neutral-500"
                style={{ letterSpacing: "-0.005em" }}
              >
                ERP Backoffice · Compliance
              </p>
            </div>
          </div>
        </div>
        {showReport && (
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-1 font-ui text-[9.5px] font-bold uppercase text-success"
            style={{ letterSpacing: "0.12em" }}
          >
            <FileText size={11} strokeWidth={2.5} />
            Relatório pronto
          </motion.span>
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
              <Card
                className="p-4 shadow-elevated"
                style={{ borderColor: "rgba(2,7,136,0.06)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-ui text-[10px] font-bold uppercase text-brand"
                      style={{ letterSpacing: "0.10em" }}
                    >
                      Linha do tempo · lote AP247
                    </p>
                    <p
                      className="mt-0.5 font-ui text-[16px] font-bold text-neutral-900"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      Trajeto completo em {TIMELINE.length} etapas
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Sem inconsistências
                  </Badge>
                </div>

                {/* Horizontal milestone rail (PMO Golden Garden style) */}
                <div className="relative mt-6 overflow-hidden pb-2 pt-1">
                  {/* connector line behind nodes */}
                  <div
                    aria-hidden
                    className="absolute left-4 right-4 top-[36px] h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(2,7,136,0.18) 0%, rgba(2,7,136,0.45) 50%, rgba(2,7,136,0.18) 100%)",
                    }}
                  />
                  <ol
                    className="relative grid"
                    style={{
                      gridTemplateColumns: `repeat(${TIMELINE.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {TIMELINE.map((t, i) => {
                      const isActive = t.tone === "active";
                      const isPast = i < TIMELINE.findIndex((x) => x.tone === "active");
                      const node = isActive ? "active" : isPast ? "done" : "pending";
                      return (
                        <motion.li
                          key={t.label}
                          initial={{ y: 6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.06 * i, duration: 0.3 }}
                          className="relative flex flex-col items-center text-center"
                        >
                          {/* Node */}
                          <div className="relative flex h-[44px] w-[44px] items-center justify-center">
                            {node === "active" && (
                              <motion.span
                                aria-hidden
                                animate={{ scale: [1, 1.55, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                                className="absolute inset-0 rounded-full bg-brand/30"
                              />
                            )}
                            <span
                              className={cn(
                                "relative z-10 flex h-9 w-9 items-center justify-center rounded-full ring-4 ring-white",
                                node === "active" &&
                                  "bg-gradient-to-br from-brand to-[#1a1fa8] text-white shadow-brand",
                                node === "done" &&
                                  "bg-success text-white shadow-[0_4px_14px_rgba(22,163,74,0.30)]",
                                node === "pending" &&
                                  "bg-white text-neutral-400",
                              )}
                              style={{
                                border:
                                  node === "pending"
                                    ? "1.5px solid rgba(0,0,0,0.10)"
                                    : undefined,
                              }}
                            >
                              <t.Icon size={15} strokeWidth={2.2} />
                            </span>
                          </div>
                          {/* Label */}
                          <p
                            className={cn(
                              "mt-2 font-ui text-[10.5px] font-bold leading-tight",
                              node === "active"
                                ? "text-brand"
                                : node === "done"
                                  ? "text-neutral-700"
                                  : "text-neutral-400",
                            )}
                            style={{ letterSpacing: "-0.005em" }}
                          >
                            {t.label}
                          </p>
                          <p className="mt-0.5 px-1 font-ui text-[9px] leading-tight text-neutral-400 line-clamp-2">
                            {t.sub}
                          </p>
                          <span className="mt-1 font-ui text-[9px] font-bold tabular-nums text-neutral-400">
                            {t.when}
                          </span>
                        </motion.li>
                      );
                    })}
                  </ol>
                </div>
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
      <span className="relative flex h-3 w-3 flex-none items-center justify-center">
        {tone === "active" && (
          <motion.span
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-brand/40"
          />
        )}
        <span
          className={cn(
            "relative h-2.5 w-2.5 rounded-full",
            tone === "active"
              ? "bg-brand shadow-brand ring-2 ring-brand/30"
              : "bg-brand/30",
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="font-display text-[12.5px] font-bold text-neutral-900"
          style={{ letterSpacing: "-0.018em" }}
        >
          {label}
        </p>
        <p
          className="truncate font-ui text-[11px] text-neutral-500"
          style={{ letterSpacing: "-0.005em" }}
        >
          {detail}
        </p>
      </div>
    </div>
  );
}
