"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Rocket } from "lucide-react";
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
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 flex items-end justify-between"
      >
        <div className="flex items-center gap-6">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-3xl text-white"
            style={{
              background:
                "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #3b42c4 100%)",
              boxShadow:
                "0 12px 32px -8px rgba(2,7,136,0.45), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
          >
            <SegmentIcon name={segment.icon} size={34} />
          </div>
          <div>
            <p
              className="font-ui text-[11px] font-bold uppercase text-brand"
              style={{ letterSpacing: "0.18em" }}
            >
              {items.length} {items.length === 1 ? "solução" : "soluções"} no grupo
            </p>
            <h1
              className="mt-1 font-display text-[44px] font-bold leading-[1.04] text-neutral-900"
              style={{ letterSpacing: "-0.028em" }}
            >
              {segment.label}
            </h1>
            <p
              className="mt-2 max-w-[60ch] font-ui text-[15px] leading-relaxed text-neutral-500"
              style={{ letterSpacing: "-0.005em" }}
            >
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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onSelect}
      aria-label={`Abrir demo de ${solution.name}`}
      className="group relative flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 text-left transition-all"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Hover wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(59,66,196,0.08), transparent 60%)",
        }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-brand transition-transform group-hover:scale-[1.04]"
          style={{
            background:
              "linear-gradient(135deg, rgba(2,7,136,0.10) 0%, rgba(59,66,196,0.14) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(2,7,136,0.08)",
          }}
        >
          <SegmentIcon name={solution.icon} size={26} />
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {solution.badges?.map((badge) => (
            <SolutionBadge key={badge} label={badge} />
          ))}
        </div>
      </div>

      <div className="relative mt-8">
        <h3
          className="font-display text-[22px] font-bold leading-[1.1] text-neutral-900"
          style={{ letterSpacing: "-0.022em" }}
        >
          {solution.name}
        </h3>
        <p
          className="mt-1.5 font-ui text-[13.5px] leading-snug text-neutral-500"
          style={{ letterSpacing: "-0.005em" }}
        >
          {solution.tagline}
        </p>
      </div>

      <div className="relative mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span
          className="font-ui text-[10.5px] font-bold uppercase text-neutral-400"
          style={{ letterSpacing: "0.14em" }}
        >
          {deviceLabel(solution.device)}
        </span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 text-neutral-500 transition-all group-hover:bg-brand group-hover:text-white group-hover:shadow-brand"
          style={{ border: "1px solid rgba(0,0,0,0.05)" }}
        >
          <ArrowRight
            size={18}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </motion.button>
  );
}

function SolutionBadge({ label }: { label: string }) {
  if (label === "IA") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white"
        style={{
          letterSpacing: "0.10em",
          background:
            "linear-gradient(135deg, #020788 0%, #1a1fa8 55%, #7c3aed 100%)",
          boxShadow: "0 2px 8px rgba(124,58,237,0.30)",
        }}
      >
        <Sparkles size={11} strokeWidth={2.5} />
        IA
      </span>
    );
  }
  if (label === "Reforma Tributária") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-[10px] font-bold uppercase text-warning"
        style={{ letterSpacing: "0.10em" }}
      >
        <FileText size={11} strokeWidth={2.5} />
        Reforma 2026
      </span>
    );
  }
  if (label === "Tendência 2026") {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase text-white"
        style={{
          letterSpacing: "0.10em",
          background:
            "linear-gradient(135deg, #020788 0%, #6b21a8 60%, #d946ef 100%)",
          boxShadow: "0 2px 8px rgba(217,70,239,0.25)",
        }}
      >
        <Rocket size={11} strokeWidth={2.5} />
        Tendência 2026
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-neutral-600"
      style={{ letterSpacing: "0.10em" }}
    >
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
    case "smartpos":
      return "Smart POS";
    default:
      return device;
  }
}
