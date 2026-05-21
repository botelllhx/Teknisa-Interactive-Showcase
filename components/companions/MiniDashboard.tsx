"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { cn } from "@/lib/cn";

interface Kpi {
  label: string;
  value: string;
  delta: number;
}

interface MiniDashboardProps {
  title?: string;
  kpis?: Kpi[];
  series?: number[];
  className?: string;
}

const DEFAULT_KPIS: Kpi[] = [
  { label: "Pedidos", value: "1.284", delta: 12.4 },
  { label: "Ticket médio", value: "R$ 38,90", delta: 4.1 },
  { label: "Cancelados", value: "24", delta: -8.3 },
];

const DEFAULT_SERIES = [38, 42, 36, 51, 47, 58, 54, 63, 60, 72, 68, 80];

export function MiniDashboard({
  title = "Visão geral · hoje",
  kpis = DEFAULT_KPIS,
  series = DEFAULT_SERIES,
  className,
}: MiniDashboardProps) {
  const max = Math.max(...series);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-72 rounded-frame border border-brand/10 bg-white p-4 shadow-frame",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-caption font-bold uppercase tracking-wider text-brand">
          {title}
        </p>
        <span className="flex h-5 items-center gap-1 rounded-full bg-success/10 px-2 text-caption font-semibold text-success">
          <Activity size={10} strokeWidth={2.5} />
          ao vivo
        </span>
      </div>

      <div className="mt-3 flex h-14 items-end gap-1">
        {series.map((value, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.15 + i * 0.03, duration: 0.35, ease: "easeOut" }}
            style={{ height: `${(value / max) * 100}%`, transformOrigin: "bottom" }}
            className={cn(
              "flex-1 rounded-t-sm",
              i === series.length - 1 ? "bg-brand" : "bg-brand/30",
            )}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {kpis.map((kpi, i) => {
          const positive = kpi.delta >= 0;
          return (
            <motion.li
              key={kpi.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.06, duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-caption text-neutral-500">{kpi.label}</p>
                <p className="font-display text-body-md font-bold text-neutral-900">
                  {kpi.value}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-caption font-semibold",
                  positive
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger",
                )}
              >
                {positive ? (
                  <ArrowUpRight size={12} strokeWidth={2.5} />
                ) : (
                  <ArrowDownRight size={12} strokeWidth={2.5} />
                )}
                {Math.abs(kpi.delta).toFixed(1)}%
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
