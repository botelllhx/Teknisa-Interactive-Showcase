"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { CompanionShell } from "./CompanionShell";
import { Card, Badge } from "@/components/ui/shadcn";

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
  const lowCount = items.filter((i) => i.current / i.target < 0.5).length;

  return (
    <CompanionShell
      label={title}
      sublabel="Centro de distribuição"
      live
      pulse={lowCount > 0}
      className={className}
    >
      <Card className="w-[268px] p-4">
        <div className="flex items-center justify-between">
          <p className="font-ui text-[11px] font-medium text-neutral-500">
            {items.length} itens monitorados
          </p>
          {lowCount > 0 && (
            <Badge variant="warning" className="text-[9px]">
              <AlertTriangle size={9} strokeWidth={2.5} />
              {lowCount} baixo
            </Badge>
          )}
        </div>

        <ul className="mt-3 space-y-3">
          {items.map((item, i) => {
            const ratio = Math.min(1, item.current / item.target);
            const lowStock = ratio < 0.5;
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-ui font-medium text-neutral-800">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 font-semibold tabular-nums",
                      lowStock ? "text-warning" : "text-neutral-700",
                    )}
                  >
                    {lowStock && (
                      <AlertTriangle size={10} strokeWidth={2.5} />
                    )}
                    {item.current}
                    <span className="opacity-50">/{item.target}</span>
                    <span className="ml-0.5 opacity-60">{item.unit}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${ratio * 100}%` }}
                    transition={{
                      delay: 0.18 + i * 0.06,
                      duration: 0.55,
                      ease: "easeOut",
                    }}
                    className={cn(
                      "block h-full rounded-full",
                      lowStock
                        ? "bg-gradient-to-r from-warning/80 to-warning"
                        : "bg-gradient-to-r from-brand to-brand-light",
                    )}
                  />
                </div>
              </motion.li>
            );
          })}
        </ul>
      </Card>
    </CompanionShell>
  );
}
