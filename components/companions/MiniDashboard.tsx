"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";

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
  title = "Visão geral · hoje",
  metrics = DEFAULT_METRICS,
}: MiniDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "white",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        width: 264,
        fontFamily: "var(--font-ui)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            color: "#020788",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(22,163,74,0.10)",
            color: "#16a34a",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          <Activity size={10} strokeWidth={2.5} />
          ao vivo
        </span>
      </div>

      {metrics.map((m, i) => {
        const max = Math.max(...m.sparkline);
        const lastIdx = m.sparkline.length - 1;
        const positive = m.trend >= 0;
        return (
          <div key={m.label} style={{ marginBottom: i === metrics.length - 1 ? 0 : 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 12, color: "#495057" }}>{m.label}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 600,
                  color: positive ? "#16a34a" : "#dc2626",
                }}
              >
                {positive ? (
                  <ArrowUp size={11} strokeWidth={2.5} />
                ) : (
                  <ArrowDown size={11} strokeWidth={2.5} />
                )}
                {Math.abs(m.trend).toFixed(1)}%
              </span>
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#020788",
                fontFamily: "var(--font-display)",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.1,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                height: 28,
                marginTop: 6,
              }}
            >
              {m.sparkline.map((v, j) => (
                <motion.div
                  key={j}
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / max) * 100}%` }}
                  transition={{
                    delay: 0.2 + i * 0.08 + j * 0.015,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  style={{
                    flex: 1,
                    background: j === lastIdx ? "#020788" : "#e8e9f8",
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
