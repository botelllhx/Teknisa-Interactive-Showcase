"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

interface EmployeeCardProps {
  name?: string;
  role?: string;
  unit?: string;
  shift?: string;
  initials?: string;
  status?: "ativo" | "ferias" | "afastado";
  attendance?: number;
  className?: string;
}

const STATUS_STYLES: Record<
  NonNullable<EmployeeCardProps["status"]>,
  { label: string; className: string }
> = {
  ativo: { label: "Ativo", className: "bg-success/10 text-success" },
  ferias: { label: "Em férias", className: "bg-info/10 text-info" },
  afastado: { label: "Afastado", className: "bg-warning/10 text-warning" },
};

export function EmployeeCard({
  name = "Mariana Costa",
  role = "Nutricionista",
  unit = "Unidade Centro",
  shift = "Seg–Sex · 06h–14h",
  initials = "MC",
  status = "ativo",
  attendance = 98,
  className,
}: EmployeeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90, scale: 0.95 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, rotateY: 30, scale: 0.96 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformPerspective: 600 }}
      className={cn(
        "w-60 rounded-frame border border-brand/10 bg-white p-4 shadow-frame",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-brand font-display text-body-md font-bold text-white shadow-brand">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-body-md font-semibold text-neutral-900">
            {name}
          </p>
          <p className="truncate text-caption text-neutral-500">{role}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1.5 text-label-sm">
        <p className="flex items-center gap-2 text-neutral-600">
          <MapPin size={12} strokeWidth={2.25} className="text-brand" />
          {unit}
        </p>
        <p className="flex items-center gap-2 text-neutral-600">
          <Calendar size={12} strokeWidth={2.25} className="text-brand" />
          {shift}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-frame-inner bg-surface-raised px-3 py-2">
        <div>
          <p className="text-caption uppercase tracking-wider text-neutral-500">
            Presença
          </p>
          <p className="font-display text-body-md font-bold text-neutral-900">
            {attendance}%
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-caption font-semibold uppercase tracking-wider",
            STATUS_STYLES[status].className,
          )}
        >
          {STATUS_STYLES[status].label}
        </span>
      </div>
    </motion.div>
  );
}
