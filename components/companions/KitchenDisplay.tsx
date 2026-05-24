"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Check, ChefHat, ChevronRight } from "lucide-react";
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
    id: "C-220",
    table: "Balcão",
    items: ["2x X-Burguer Artesanal", "2x Fritas grande"],
    elapsed: "04:12",
    status: "preparando",
  },
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
];

const STATUS_TONES: Record<
  KitchenOrder["status"],
  {
    border: string;
    bg: string;
    chip: string;
    label: string;
    accent: string;
  }
> = {
  novo: {
    border: "#020788",
    bg: "rgba(2,7,136,0.06)",
    chip: "#020788",
    label: "Novo",
    accent: "#020788",
  },
  preparando: {
    border: "#d97706",
    bg: "rgba(217,119,6,0.07)",
    chip: "#d97706",
    label: "Em preparo",
    accent: "#d97706",
  },
  pronto: {
    border: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    chip: "#16a34a",
    label: "Pronto",
    accent: "#16a34a",
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
      sublabel="Lá na copa"
      live
      pulse={!!highlightId}
    >
      {/* Light-grey monitor casing (matches device rule) */}
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
          padding: 10,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Webcam / sensor strip */}
        <div className="mb-1.5 flex items-center justify-center gap-2">
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-neutral-400/60"
          />
          <span className="text-[7px] font-bold uppercase tracking-[1.5px] text-neutral-400">
            Teknisa KDS
          </span>
          <span
            aria-hidden
            className="h-1 w-1 rounded-full bg-neutral-400/60"
          />
        </div>

        {/* LCD screen — LIGHT theme */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #f8f9fb 100%)",
            borderRadius: 14,
            padding: 10,
            border: "1px solid #c8ccd5",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand text-white">
                <ChefHat size={11} strokeWidth={2.25} />
              </span>
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[2px] text-brand leading-none">
                  Cozinha
                </p>
                <p className="text-[8px] text-neutral-500 leading-none">
                  Linha quente · turno 2
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <StatusPill
                tone={STATUS_TONES.novo.accent}
                count={stats.novo}
                label="Novos"
              />
              <StatusPill
                tone={STATUS_TONES.preparando.accent}
                count={stats.preparando}
                label="Em preparo"
              />
              <StatusPill
                tone={STATUS_TONES.pronto.accent}
                count={stats.pronto}
                label="Prontos"
              />
            </div>
          </div>

          {/* Orders grid */}
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
                      borderLeft: `3px solid ${tone.border}`,
                      borderRadius: 8,
                      padding: "6px 8px",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[12px] font-bold text-neutral-900">
                          {order.table}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-500 tabular-nums">
                          #{order.id}
                        </span>
                      </div>
                      <span
                        style={{ background: tone.chip }}
                        className="rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white"
                      >
                        {tone.label}
                      </span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {order.items.map((item, j) => (
                        <li
                          key={`${order.id}-${j}`}
                          className="flex items-start gap-1 text-[10px] text-neutral-700"
                        >
                          <ChevronRight
                            size={9}
                            strokeWidth={2.5}
                            className="mt-[3px] flex-none text-neutral-400"
                          />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-1 flex items-center justify-between border-t border-neutral-200/60 pt-1 text-[9px] text-neutral-500">
                      <span className="flex items-center gap-1 font-mono tabular-nums">
                        {order.status === "pronto" ? (
                          <Check
                            size={10}
                            strokeWidth={2.5}
                            color={tone.accent}
                          />
                        ) : (
                          <Clock size={10} strokeWidth={2.25} />
                        )}
                        {order.elapsed}
                      </span>
                      {order.status === "novo" && (
                        <span
                          className="flex items-center gap-1 font-bold uppercase tracking-wider"
                          style={{ color: tone.accent }}
                        >
                          <Flame size={9} strokeWidth={2.5} />
                          chegou agora
                        </span>
                      )}
                      {order.status === "pronto" && (
                        <span
                          className="font-bold uppercase tracking-wider"
                          style={{ color: tone.accent }}
                        >
                          pronto para servir
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bezel detail */}
        <div className="mt-1.5 flex items-center justify-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-10 rounded-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
          <span className="text-[7px] font-bold uppercase tracking-[2px] text-neutral-400">
            Pass · linha quente
          </span>
          <span
            aria-hidden
            className="h-0.5 w-10 rounded-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
        </div>
      </motion.div>
    </CompanionShell>
  );
}

function StatusPill({
  tone,
  count,
  label,
}: {
  tone: string;
  count: number;
  label: string;
}) {
  return (
    <span
      className="flex items-center gap-1 rounded-full px-1.5 py-0.5"
      style={{
        background: `${tone}10`,
        border: `1px solid ${tone}30`,
      }}
      title={label}
    >
      <span
        className="h-1 w-1 rounded-full"
        style={{ background: tone }}
      />
      <span
        className="font-display text-[9px] font-bold tabular-nums"
        style={{ color: tone }}
      >
        {count}
      </span>
    </span>
  );
}
