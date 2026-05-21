"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Clock, Activity } from "lucide-react";
import { CompanionShell } from "./CompanionShell";
import { cn } from "@/lib/cn";

interface Restaurant {
  id: string;
  name: string;
  distance: string;
  queue: number;
  eta: string;
  capacity: number;
  status: "livre" | "moderado" | "cheio";
}

interface RestaurantQueueBoardProps {
  restaurants?: Restaurant[];
  selectedId?: string;
}

const DEFAULT: Restaurant[] = [
  {
    id: "central",
    name: "Restaurante Central",
    distance: "200 m",
    queue: 18,
    eta: "20 min",
    capacity: 85,
    status: "cheio",
  },
  {
    id: "alab",
    name: "Restaurante Ala B",
    distance: "450 m",
    queue: 6,
    eta: "8 min",
    capacity: 42,
    status: "moderado",
  },
  {
    id: "praca",
    name: "Café da Praça",
    distance: "320 m",
    queue: 0,
    eta: "Sem fila",
    capacity: 18,
    status: "livre",
  },
];

const STATUS_TONES: Record<
  Restaurant["status"],
  { label: string; chip: string; chipText: string; bar: string }
> = {
  livre: {
    label: "Livre",
    chip: "bg-success/15",
    chipText: "text-success",
    bar: "bg-success",
  },
  moderado: {
    label: "Moderado",
    chip: "bg-warning/15",
    chipText: "text-warning",
    bar: "bg-warning",
  },
  cheio: {
    label: "Cheio",
    chip: "bg-danger/15",
    chipText: "text-danger",
    bar: "bg-danger",
  },
};

export function RestaurantQueueBoard({
  restaurants = DEFAULT,
  selectedId,
}: RestaurantQueueBoardProps) {
  return (
    <CompanionShell
      label="Painel de filas"
      sublabel="Refeitórios · tempo real"
      live
      pulse={!!selectedId}
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
          padding: 14,
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        {/* Inner LCD board */}
        <div
          style={{
            background:
              "linear-gradient(180deg, #fbfcff 0%, #eef1f6 100%)",
            borderRadius: 14,
            padding: 12,
            border: "1px solid #c8ccd5",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.06), inset 0 -1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Top header */}
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-1.5">
              <Activity
                size={12}
                strokeWidth={2.25}
                className="text-brand"
              />
              <span className="font-display text-[10px] font-bold uppercase tracking-[2px] text-brand">
                Status agora
              </span>
            </div>
            <span className="font-display text-[10px] font-bold text-neutral-500 tabular-nums">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Restaurant rows */}
          <div className="space-y-2">
            {restaurants.map((r, i) => {
              const tone = STATUS_TONES[r.status];
              const isSelected = selectedId === r.id;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: isSelected ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.25,
                    scale: { duration: 0.6 },
                  }}
                  className={cn(
                    "relative rounded-xl border bg-white p-2.5 transition-shadow",
                    isSelected
                      ? "border-brand shadow-brand"
                      : "border-neutral-200/70",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 flex-none items-center justify-center rounded-lg",
                          isSelected
                            ? "bg-brand text-white shadow-brand"
                            : "bg-brand-subtle text-brand",
                        )}
                      >
                        <MapPin size={13} strokeWidth={2.25} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-[11px] font-bold leading-tight text-neutral-900">
                          {r.name}
                        </p>
                        <p className="text-[9px] text-neutral-500">
                          {r.distance}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                        tone.chip,
                        tone.chipText,
                      )}
                    >
                      {tone.label}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <Tile
                      Icon={Users}
                      label="Fila"
                      value={String(r.queue)}
                      tone={tone.chipText}
                    />
                    <Tile Icon={Clock} label="Espera" value={r.eta} />
                    <Tile
                      label="Lotação"
                      value={`${r.capacity}%`}
                      progress={r.capacity}
                      progressColor={tone.bar}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </CompanionShell>
  );
}

function Tile({
  Icon,
  label,
  value,
  tone,
  progress,
  progressColor,
}: {
  Icon?: typeof Users;
  label: string;
  value: string;
  tone?: string;
  progress?: number;
  progressColor?: string;
}) {
  return (
    <div className="rounded-md bg-surface-raised px-1.5 py-1">
      <div className="flex items-center gap-1">
        {Icon && <Icon size={9} strokeWidth={2.25} className="text-neutral-400" />}
        <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "mt-0.5 font-display text-[12px] font-bold leading-none tabular-nums",
          tone || "text-neutral-900",
        )}
      >
        {value}
      </p>
      {progress !== undefined && (
        <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-neutral-200">
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("block h-full rounded-full", progressColor || "bg-brand")}
          />
        </div>
      )}
    </div>
  );
}
