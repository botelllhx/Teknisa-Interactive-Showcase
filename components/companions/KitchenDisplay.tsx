"use client";

import { motion } from "framer-motion";
import { Clock, Flame, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface KitchenOrder {
  id: string;
  table: string;
  items: string[];
  elapsed: string;
  status: "preparando" | "pronto";
}

interface KitchenDisplayProps {
  orders?: KitchenOrder[];
  className?: string;
}

const DEFAULT_ORDERS: KitchenOrder[] = [
  {
    id: "K-218",
    table: "Mesa 12",
    items: ["Arroz integral", "Filé grelhado", "Salada caesar"],
    elapsed: "04:12",
    status: "preparando",
  },
  {
    id: "K-219",
    table: "Mesa 07",
    items: ["Risoto de cogumelos", "Suco verde"],
    elapsed: "07:48",
    status: "pronto",
  },
];

export function KitchenDisplay({
  orders = DEFAULT_ORDERS,
  className,
}: KitchenDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-64 rounded-frame border border-brand/10 bg-white p-4 shadow-frame",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="font-display text-caption font-bold uppercase tracking-wider text-brand">
          KDS · Cozinha
        </p>
        <span className="flex h-5 items-center gap-1 rounded-full bg-brand-subtle px-2 text-caption font-semibold text-brand">
          <Flame size={10} strokeWidth={2.5} />
          {orders.length}
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {orders.map((order, i) => (
          <motion.li
            key={order.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.08, duration: 0.3 }}
            className={cn(
              "rounded-frame-inner border px-3 py-2",
              order.status === "pronto"
                ? "border-success/30 bg-success/5"
                : "border-brand/10 bg-surface-raised",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-label-sm font-semibold text-neutral-900">
                {order.table}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-caption font-medium",
                  order.status === "pronto" ? "text-success" : "text-neutral-500",
                )}
              >
                {order.status === "pronto" ? (
                  <>
                    <Check size={12} strokeWidth={3} />
                    Pronto
                  </>
                ) : (
                  <>
                    <Clock size={12} strokeWidth={2.25} />
                    {order.elapsed}
                  </>
                )}
              </span>
            </div>
            <ul className="mt-1 space-y-0.5">
              {order.items.map((item, j) => (
                <li
                  key={`${order.id}-${j}`}
                  className="text-caption text-neutral-600"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
