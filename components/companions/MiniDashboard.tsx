"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { CompanionShell } from "./CompanionShell";
import { Card } from "@/components/ui/shadcn";

interface Metric {
  label: string;
  value: string;
  trend: number;
  sparkline: number[];
}

interface MiniDashboardProps {
  title?: string;
  metrics?: Metric[];
  className?: string;
}

const DEFAULT_METRICS: Metric[] = [
  {
    label: "Pedidos hoje",
    value: "1.284",
    trend: 12.4,
    sparkline: [38, 42, 36, 51, 47, 58, 54, 63, 60, 72, 68, 80],
  },
  {
    label: "Ticket médio",
    value: "R$ 38,90",
    trend: 4.1,
    sparkline: [45, 48, 44, 50, 47, 52, 51, 56, 54, 58, 56, 60],
  },
  {
    label: "Cancelamentos",
    value: "24",
    trend: -8.3,
    sparkline: [62, 58, 60, 52, 54, 48, 50, 44, 42, 38, 36, 32],
  },
];

export function MiniDashboard({
  title = "Visão geral",
  metrics = DEFAULT_METRICS,
}: MiniDashboardProps) {
  return (
    <CompanionShell
      label={title}
      sublabel="Atualização em tempo real"
      live
      pulse
    >
      <Card className="w-[268px] overflow-hidden p-4">
        <div className="space-y-3.5">
          {metrics.map((m, i) => {
            const max = Math.max(...m.sparkline);
            const lastIdx = m.sparkline.length - 1;
            const positive = m.trend >= 0;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-neutral-500">
                    {m.label}
                  </span>
                  <span
                    className="inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums"
                    style={{ color: positive ? "#16a34a" : "#dc2626" }}
                  >
                    {positive ? (
                      <ArrowUp size={10} strokeWidth={2.75} />
                    ) : (
                      <ArrowDown size={10} strokeWidth={2.75} />
                    )}
                    {Math.abs(m.trend).toFixed(1)}%
                  </span>
                </div>
                <motion.div
                  key={m.value}
                  initial={{ scale: 0.94, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-0.5 font-display text-[20px] font-bold leading-none tabular-nums text-brand"
                >
                  {m.value}
                </motion.div>
                <div
                  className="mt-1.5 flex items-end gap-[2px]"
                  style={{ height: 26 }}
                >
                  {m.sparkline.map((v, j) => (
                    <motion.div
                      key={j}
                      initial={{ height: 0 }}
                      animate={{ height: `${(v / max) * 100}%` }}
                      transition={{
                        delay: 0.15 + i * 0.06 + j * 0.012,
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                      style={{
                        flex: 1,
                        background:
                          j === lastIdx
                            ? "#020788"
                            : j > lastIdx - 3
                              ? "#3b42c4"
                              : "#e8e9f8",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </CompanionShell>
  );
}
