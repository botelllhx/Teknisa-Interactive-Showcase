"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText } from "lucide-react";
import {
  getSolutionsBySegment,
  segmentsById,
  type Solution,
  type SolutionSegment,
} from "@/data/solutions";
import { useShowcase } from "@/lib/store";
import { getFlow } from "@/data/flows";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { SegmentIcon } from "@/components/ui/SegmentIcon";
import { cn } from "@/lib/cn";

interface SolutionGridProps {
  segmentId: SolutionSegment;
}

export function SolutionGrid({ segmentId }: SolutionGridProps) {
  const selectSolution = useShowcase((s) => s.selectSolution);
  const segment = segmentsById[segmentId];
  const items = getSolutionsBySegment(segmentId);

  return (
    <div className="flex h-full flex-col px-12 pb-10 pt-2">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex items-end justify-between"
      >
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-white shadow-brand">
            <SegmentIcon name={segment.icon} size={36} />
          </div>
          <div>
            <p className="text-label-sm font-medium uppercase tracking-wider text-brand">
              {items.length} {items.length === 1 ? "solução" : "soluções"}
            </p>
            <h1 className="font-display text-display-xl leading-tight text-neutral-900">
              {segment.label}
            </h1>
            <p className="mt-1 max-w-[60ch] text-body-lg text-neutral-600">
              {segment.description}
            </p>
          </div>
        </div>
      </motion.header>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid gap-5",
          items.length <= 2
            ? "grid-cols-2"
            : items.length === 3
              ? "grid-cols-3"
              : items.length === 4
                ? "grid-cols-4"
                : "grid-cols-5",
        )}
      >
        {items.map((solution) => (
          <SolutionCard
            key={solution.id}
            solution={solution}
            onSelect={() => {
              const flow = getFlow(solution.id);
              selectSolution(solution.id, flow.length);
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

interface SolutionCardProps {
  solution: Solution;
  onSelect: () => void;
}

function SolutionCard({ solution, onSelect }: SolutionCardProps) {
  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onSelect}
      aria-label={`Abrir demo de ${solution.name}`}
      className="group flex h-full min-h-[260px] flex-col justify-between rounded-frame border border-brand/10 bg-white p-7 text-left shadow-card transition-shadow hover:border-brand/30 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-subtle text-brand transition-colors group-hover:bg-brand group-hover:text-white">
          <SegmentIcon name={solution.icon} size={26} />
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {solution.badges?.map((badge) => (
            <SolutionBadge key={badge} label={badge} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-heading-xl leading-tight text-neutral-900">
          {solution.name}
        </h3>
        <p className="mt-1.5 text-body-md text-neutral-600">{solution.tagline}</p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
        <span className="text-label-sm font-medium uppercase tracking-wider text-neutral-500">
          {deviceLabel(solution.device)}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-brand group-hover:text-white">
          <ArrowRight size={18} strokeWidth={2} />
        </span>
      </div>
    </motion.button>
  );
}

function SolutionBadge({ label }: { label: string }) {
  if (label === "IA") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-caption font-semibold uppercase tracking-wider text-white">
        <Sparkles size={12} strokeWidth={2.5} />
        IA
      </span>
    );
  }
  if (label === "Reforma Tributária") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-caption font-semibold uppercase tracking-wider text-warning">
        <FileText size={12} strokeWidth={2.5} />
        Reforma 2026
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-200 px-2.5 py-1 text-caption font-medium uppercase tracking-wider text-neutral-700">
      {label}
    </span>
  );
}

function deviceLabel(device: Solution["device"]): string {
  switch (device) {
    case "desktop":
      return "Desktop";
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    case "pos-terminal":
      return "PDV";
    case "kiosk":
      return "Totem";
    default:
      return device;
  }
}
