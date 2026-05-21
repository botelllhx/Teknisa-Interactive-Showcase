"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface OrderTicketProps {
  items?: OrderItem[];
  orderNumber?: string;
  store?: string;
  className?: string;
}

const DEFAULT_ITEMS: OrderItem[] = [
  { name: "Almoço Executivo", qty: 1, price: 32.9 },
  { name: "Suco natural laranja", qty: 1, price: 9.5 },
  { name: "Sobremesa do dia", qty: 1, price: 8.0 },
];

export function OrderTicket({
  items = DEFAULT_ITEMS,
  orderNumber = "#A1247",
  store = "Restaurante Central",
  className,
}: OrderTicketProps) {
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        type: "spring",
        stiffness: 240,
        damping: 18,
      }}
      className={cn("relative w-60", className)}
    >
      <TearEdge orientation="top" />

      <div className="rounded-b-frame-inner bg-white px-5 py-4 shadow-frame">
        <div className="text-center">
          <p className="font-display text-caption font-bold uppercase tracking-widest text-brand">
            Teknisa
          </p>
          <p className="mt-1 text-caption text-neutral-500">{store}</p>
        </div>

        <div className="my-3 border-t border-dashed border-neutral-200" />

        <div className="flex items-center justify-between text-caption text-neutral-500">
          <span>Pedido {orderNumber}</span>
          <span>{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>

        <ul className="mt-3 space-y-2">
          {items.map((item, i) => (
            <motion.li
              key={`${item.name}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              className="flex items-start justify-between gap-2 text-label-sm"
            >
              <div className="flex-1">
                <p className="font-ui text-neutral-800">{item.name}</p>
                <p className="text-caption text-neutral-500">
                  {item.qty} × {brl(item.price)}
                </p>
              </div>
              <span className="font-ui font-semibold tabular-nums text-neutral-900">
                {brl(item.qty * item.price)}
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="my-3 border-t border-dashed border-neutral-200" />

        <div className="flex items-baseline justify-between">
          <span className="text-label-sm font-medium uppercase tracking-wider text-neutral-500">
            Total
          </span>
          <span className="font-display text-heading-lg font-bold text-brand">
            {brl(total)}
          </span>
        </div>
      </div>

      <TearEdge orientation="bottom" />
    </motion.div>
  );
}

function TearEdge({ orientation }: { orientation: "top" | "bottom" }) {
  return (
    <div
      className={cn("flex h-3 items-center justify-around overflow-hidden bg-white px-1", orientation === "top" ? "rounded-t-sm" : "rounded-b-sm")}
      aria-hidden
    >
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-3 w-2 bg-surface-raised",
            orientation === "top" ? "rounded-b-full" : "rounded-t-full",
          )}
        />
      ))}
    </div>
  );
}

function brl(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
