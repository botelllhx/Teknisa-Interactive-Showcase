"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { CompanionShell } from "./CompanionShell";
import { Card, Badge } from "@/components/ui/shadcn";
import { cn } from "@/lib/cn";

interface FiscalBadgeProps {
  className?: string;
}

const TAGS = ["IBS", "CBS", "IS", "Split Payment"];

export function FiscalBadge({ className }: FiscalBadgeProps) {
  return (
    <CompanionShell
      label="Reforma Tributária"
      sublabel="Compliance Teknisa"
      live
      pulse
      className={className}
    >
      <Card
        className={cn(
          "relative w-[268px] overflow-hidden border-warning/20 p-4",
          "bg-gradient-to-br from-warning/5 via-white to-warning/10",
        )}
      >
        {/* Decorative pulse halo */}
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.5, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-warning/20"
        />

        <div className="relative flex items-center gap-3">
          <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-warning text-white shadow-[0_4px_14px_rgba(217,119,6,0.30)]">
            <ShieldCheck size={22} strokeWidth={2.25} />
            <Sparkles
              size={10}
              strokeWidth={2.5}
              className="absolute -right-1 -top-1 text-warning bg-white rounded-full p-[2px] shadow-card"
            />
          </div>
          <div className="min-w-0">
            <p className="font-ui text-[10px] font-bold uppercase tracking-wider text-warning">
              Preparado para 2026
            </p>
            <p className="mt-0.5 font-ui text-[13px] font-semibold leading-tight text-neutral-900">
              Novo regime tributário
            </p>
          </div>
        </div>

        <div className="relative mt-3 flex flex-wrap gap-1">
          {TAGS.map((tag, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
            >
              <Badge variant="warning" className="text-[9px]">
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </CompanionShell>
  );
}
