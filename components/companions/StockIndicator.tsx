"use client";

import { motion } from "framer-motion";
import { Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

interface StockItem {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

interface StockIndicatorProps {
  title?: string;
  items?: StockItem[];
  className?: string;
}

const DEFAULT_ITEMS: StockItem[] = [
  { label: "Arroz parboilizado", current: 84, target: 100, unit: "kg" },
  { label: "Frango congelado", current: 32, target: 80, unit: "kg" },
  { label: "Óleo de soja", current: 92, target: 100, unit: "L" },
];

export function StockIndicator({
  title = "Estoque atual",
  items = DEFAULT_ITEMS,
  className,
}: StockIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "w-64 rounded-frame border border-brand/10 bg-white p-4 shadow-frame",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-display text-caption font-bold uppercase tracking-wider text-brand">
          <Package size={12} strokeWidth={2.5} />
          {title}
        </p>
      </div>

      <ul className="mt-3 space-y-3">
        {items.map((item, i) => {
          const ratio = Math.min(1, item.current / item.target);
          const lowStock = ratio < 0.5;
          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.07, duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-label-sm">
                <span className="font-ui font-medium text-neutral-800">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 tabular-nums font-semibold",
                    lowStock ? "text-warning" : "text-neutral-700",
                  )}
                >
                  {lowStock && <AlertTriangle size={12} strokeWidth={2.5} />}
                  {item.current}/{item.target} {item.unit}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio * 100}%` }}
                  transition={{ delay: 0.22 + i * 0.07, duration: 0.55, ease: "easeOut" }}
                  className={cn(
                    "block h-full rounded-full",
                    lowStock ? "bg-warning" : "bg-brand",
                  )}
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
