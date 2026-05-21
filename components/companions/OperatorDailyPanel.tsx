"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Receipt, Award } from "lucide-react";
import { CompanionShell } from "./CompanionShell";

interface OperatorDailyPanelProps {
  operatorName?: string;
  operatorInitials?: string;
  shiftStart?: string;
  totalSales?: number;
  orderCount?: number;
  avgTicket?: number;
  approvalRate?: number;
  sparkline?: number[];
}

const DEFAULT_SPARKLINE = [
  32, 41, 38, 52, 48, 61, 58, 72, 68, 81, 76, 88,
];

export function OperatorDailyPanel({
  operatorName = "Carlos Mello",
  operatorInitials = "CM",
  shiftStart = "08:00",
  totalSales = 1842.5,
  orderCount = 47,
  avgTicket = 39.2,
  approvalRate = 98,
  sparkline = DEFAULT_SPARKLINE,
}: OperatorDailyPanelProps) {
  const max = Math.max(...sparkline);
  const goal = 2500;
  const progress = Math.min(100, (totalSales / goal) * 100);

  return (
    <CompanionShell
      label="Painel do operador"
      sublabel={`Turno desde ${shiftStart}`}
      live
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          background:
            "linear-gradient(180deg, #ffffff 0%, #fafbfd 100%)",
          borderRadius: 20,
          padding: 18,
          boxShadow:
            "0 0 0 1px rgba(2,7,136,0.06), 0 16px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
        }}
      >
        {/* Operator header */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light font-display text-[13px] font-bold text-white shadow-brand">
            {operatorInitials}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-success" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-display text-[13px] font-bold leading-tight text-neutral-900">
              {operatorName}
            </p>
            <p className="text-[10px] text-neutral-500">
              Padaria Centro · Caixa móvel
            </p>
          </div>
        </div>

        {/* Hero metric: total sales */}
        <div className="mt-4 rounded-xl bg-gradient-to-br from-brand-ghost via-white to-brand-subtle/40 p-3">
          <div className="flex items-baseline justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
              Vendas hoje
            </p>
            <p className="flex items-center gap-1 text-[10px] font-bold text-success">
              <TrendingUp size={11} strokeWidth={2.5} />
              +12,4%
            </p>
          </div>
          <p className="mt-0.5 font-display text-[24px] font-bold leading-none text-brand tabular-nums">
            R$ {totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500">
            <span>Meta R$ {goal.toLocaleString("pt-BR")}</span>
            <span className="font-bold text-neutral-700 tabular-nums">{progress.toFixed(0)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/80">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="block h-full rounded-full bg-brand"
            />
          </div>
        </div>

        {/* Sparkline */}
        <div className="mt-3 flex h-10 items-end gap-0.5">
          {sparkline.map((v, i) => (
            <motion.span
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                delay: 0.1 + i * 0.025,
                duration: 0.3,
                ease: "easeOut",
              }}
              style={{
                height: `${(v / max) * 100}%`,
                transformOrigin: "bottom",
                flex: 1,
                background: i === sparkline.length - 1 ? "#020788" : "#e8e9f8",
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* KPI grid */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <KpiTile Icon={Receipt} label="Pedidos" value={String(orderCount)} />
          <KpiTile Icon={Clock} label="Ticket" value={`R$ ${avgTicket.toFixed(2).replace(".", ",")}`} />
          <KpiTile Icon={Award} label="Aprov." value={`${approvalRate}%`} tone="success" />
        </div>
      </motion.div>
    </CompanionShell>
  );
}

function KpiTile({
  Icon,
  label,
  value,
  tone = "neutral",
}: {
  Icon: typeof TrendingUp;
  label: string;
  value: string;
  tone?: "neutral" | "success";
}) {
  return (
    <div className="rounded-lg bg-surface-raised p-2">
      <Icon
        size={11}
        strokeWidth={2}
        className={tone === "success" ? "text-success" : "text-brand"}
      />
      <p className="mt-1 text-[8px] font-bold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="font-display text-[11px] font-bold text-neutral-900 tabular-nums">
        {value}
      </p>
    </div>
  );
}
