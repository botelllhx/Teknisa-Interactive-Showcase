"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Check, ChefHat } from "lucide-react";
import { CompanionShell } from "./CompanionShell";

interface KitchenOrder {
  id: string;
  table: string;
  items: string[];
  elapsed: string;
  status: "novo" | "preparando" | "pronto";
}

interface KitchenDisplayProps {
  orders?: KitchenOrder[];
  highlightId?: string;
}

const DEFAULT_ORDERS: KitchenOrder[] = [
  {
    id: "C-218",
    table: "Mesa 07",
    items: ["1x Risoto cogumelos", "1x Vinho tinto taça"],
    elapsed: "07:48",
    status: "pronto",
  },
  {
    id: "C-219",
    table: "Mesa 12",
    items: ["1x Penne ao funghi", "1x Parmesão extra"],
    elapsed: "00:08",
    status: "novo",
  },
  {
    id: "C-220",
    table: "Balcão",
    items: ["2x X-Burguer", "2x Fritas grande"],
    elapsed: "04:12",
    status: "preparando",
  },
];

const STATUS_TONES: Record<
  KitchenOrder["status"],
  { bg: string; ring: string; chip: string; chipText: string }
> = {
  novo: {
    bg: "rgba(2,7,136,0.05)",
    ring: "rgba(2,7,136,0.25)",
    chip: "#020788",
    chipText: "Novo",
  },
  preparando: {
    bg: "rgba(217,119,6,0.06)",
    ring: "rgba(217,119,6,0.30)",
    chip: "#d97706",
    chipText: "Preparando",
  },
  pronto: {
    bg: "rgba(22,163,74,0.06)",
    ring: "rgba(22,163,74,0.30)",
    chip: "#16a34a",
    chipText: "Pronto",
  },
};

export function KitchenDisplay({
  orders = DEFAULT_ORDERS,
  highlightId,
}: KitchenDisplayProps) {
  const stats = {
    novo: orders.filter((o) => o.status === "novo").length,
    preparando: orders.filter((o) => o.status === "preparando").length,
    pronto: orders.filter((o) => o.status === "pronto").length,
  };

  return (
    <CompanionShell
      label="KDS · Cozinha"
      sublabel="Monitor da copa"
      live
      pulse={!!highlightId}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          width: "100%",
          background:
            "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)",
          borderRadius: 22,
          padding: 12,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* LCD screen */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #1a1f2e 0%, #0f1421 100%)",
            borderRadius: 14,
            padding: 12,
            border: "1px solid #c8ccd5",
            boxShadow:
              "inset 0 2px 6px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ChefHat size={11} strokeWidth={2.25} className="text-white/70" />
              <span className="font-display text-[10px] font-bold uppercase tracking-[2px] text-white/90">
                Cozinha
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot tone="#020788" count={stats.novo} />
              <StatusDot tone="#d97706" count={stats.preparando} />
              <StatusDot tone="#16a34a" count={stats.pronto} />
            </div>
          </div>

          {/* Orders */}
          <div className="mt-2 space-y-1.5">
            <AnimatePresence mode="popLayout">
              {orders.map((order, i) => {
                const tone = STATUS_TONES[order.status];
                const isHighlight = highlightId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: isHighlight ? [1, 1.02, 1] : 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.25,
                      scale: { duration: 0.6 },
                    }}
                    style={{
                      background: tone.bg,
                      border: `1px solid ${tone.ring}`,
                      borderRadius: 10,
                      padding: "8px 10px",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[12px] font-bold text-white">
                          {order.table}
                        </span>
                        <span className="text-[9px] font-mono text-white/60 tabular-nums">
                          #{order.id}
                        </span>
                      </div>
                      <span
                        style={{ background: tone.chip }}
                        className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
                      >
                        {tone.chipText}
                      </span>
                    </div>
                    <ul className="mt-1.5 space-y-0.5">
                      {order.items.map((item, j) => (
                        <li
                          key={`${order.id}-${j}`}
                          className="text-[10px] text-white/80"
                        >
                          · {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px] text-white/70">
                      <span className="flex items-center gap-1">
                        {order.status === "pronto" ? (
                          <Check
                            size={10}
                            strokeWidth={2.5}
                            color="#22c55e"
                          />
                        ) : (
                          <Clock size={10} strokeWidth={2.25} />
                        )}
                        {order.elapsed}
                      </span>
                      {order.status === "novo" && (
                        <span className="flex items-center gap-1 text-warning">
                          <Flame size={10} strokeWidth={2.5} />
                          chegou agora
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Mount bezel detail */}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span
            aria-hidden
            className="h-1 w-12 rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />
          <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-400">
            Cozinha · Linha quente
          </span>
          <span
            aria-hidden
            className="h-1 w-12 rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />
        </div>
      </motion.div>
    </CompanionShell>
  );
}

function StatusDot({ tone, count }: { tone: string; count: number }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: tone, boxShadow: `0 0 6px ${tone}80` }}
      />
      <span className="text-[9px] font-bold text-white/80 tabular-nums">
        {count}
      </span>
    </span>
  );
}
