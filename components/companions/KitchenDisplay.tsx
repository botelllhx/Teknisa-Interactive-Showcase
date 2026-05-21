"use client";

import { motion } from "framer-motion";
import { Flame, Clock, Check } from "lucide-react";

interface KitchenOrder {
  id: string;
  table: string;
  items: string[];
  elapsed: string;
  status: "novo" | "preparando" | "pronto";
}

interface KitchenDisplayProps {
  orders?: KitchenOrder[];
  className?: string;
}

const DEFAULT_ORDERS: KitchenOrder[] = [
  {
    id: "K-218",
    table: "Mesa 12",
    items: ["2x Costela no bafo 350g", "1x Salada caesar", "1x Suco de laranja"],
    elapsed: "04:12",
    status: "preparando",
  },
  {
    id: "K-219",
    table: "Mesa 07",
    items: ["1x Risoto de cogumelos", "1x Vinho tinto taça"],
    elapsed: "07:48",
    status: "pronto",
  },
  {
    id: "K-220",
    table: "Balcão",
    items: ["3x X-Burguer", "3x Fritas", "3x Refri"],
    elapsed: "00:42",
    status: "novo",
  },
];

const TONE: Record<KitchenOrder["status"], { ring: string; bg: string; chip: string; chipText: string }> = {
  novo: {
    ring: "rgba(2,7,136,0.20)",
    bg: "rgba(2,7,136,0.04)",
    chip: "#020788",
    chipText: "Novo",
  },
  preparando: {
    ring: "rgba(217,119,6,0.25)",
    bg: "rgba(217,119,6,0.06)",
    chip: "#d97706",
    chipText: "Preparando",
  },
  pronto: {
    ring: "rgba(22,163,74,0.25)",
    bg: "rgba(22,163,74,0.06)",
    chip: "#16a34a",
    chipText: "Pronto",
  },
};

export function KitchenDisplay({ orders = DEFAULT_ORDERS }: KitchenDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "white",
        borderRadius: 16,
        padding: 16,
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
          marginBottom: 12,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "#020788",
          }}
        >
          <Flame size={12} strokeWidth={2.5} />
          KDS · Cozinha
        </span>
        <span
          style={{
            background: "#e8e9f8",
            color: "#020788",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 999,
          }}
        >
          {orders.length} ativos
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {orders.map((order, i) => {
          const tone = TONE[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              style={{
                background: tone.bg,
                border: `1px solid ${tone.ring}`,
                borderRadius: 12,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#212529",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {order.table}
                  </span>
                  <span style={{ fontSize: 10, color: "#8a909a" }}>#{order.id}</span>
                </div>
                <span
                  style={{
                    background: tone.chip,
                    color: "white",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 999,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  {tone.chipText}
                </span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {order.items.map((item, j) => (
                  <li
                    key={`${order.id}-${j}`}
                    style={{
                      fontSize: 11,
                      color: "#495057",
                      lineHeight: 1.5,
                    }}
                  >
                    · {item}
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "#6c757d",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {order.status === "pronto" ? (
                    <Check size={11} strokeWidth={2.5} color="#16a34a" />
                  ) : (
                    <Clock size={11} strokeWidth={2.25} />
                  )}
                  {order.elapsed}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
