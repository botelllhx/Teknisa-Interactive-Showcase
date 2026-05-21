"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { segments, type Segment } from "@/data/solutions";
import { useShowcase } from "@/lib/store";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { SegmentIcon } from "@/components/ui/SegmentIcon";
import { cn } from "@/lib/cn";

export function SegmentGrid() {
  const selectSegment = useShowcase((s) => s.selectSegment);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 grid-rows-2 gap-6 px-16 pb-16"
    >
      {segments.map((segment) => (
        <SegmentCard
          key={segment.id}
          segment={segment}
          onSelect={() => {
            if (segment.comingSoon) return;
            selectSegment(segment.id);
          }}
        />
      ))}
    </motion.div>
  );
}

interface SegmentCardProps {
  segment: Segment;
  onSelect: () => void;
}

function SegmentCard({ segment, onSelect }: SegmentCardProps) {
  const disabled = !!segment.comingSoon;
  const solutionCount = segment.solutions.length;

  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      whileHover={disabled ? undefined : { scale: 1.02, y: -4 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Abrir ${segment.label}`}
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-frame border border-brand/10 bg-white p-8 text-left shadow-card transition-shadow",
        disabled
          ? "cursor-not-allowed opacity-60"
          : "hover:border-brand/20 hover:bg-brand-ghost hover:shadow-card-hover",
      )}
    >
      {disabled && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-200 px-3 py-1 text-label-sm font-medium text-neutral-700">
          <Clock size={14} strokeWidth={2} />
          Em breve
        </span>
      )}

      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors",
            disabled
              ? "bg-neutral-100 text-neutral-500"
              : "bg-brand-subtle text-brand group-hover:bg-brand group-hover:text-white",
          )}
        >
          <SegmentIcon name={segment.icon} size={32} />
        </div>

        {!disabled && (
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-label-sm font-medium text-neutral-700">
            {solutionCount} {solutionCount === 1 ? "solução" : "soluções"}
          </span>
        )}
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-display-lg leading-tight text-neutral-900">
            {segment.label}
          </h2>
          <p className="mt-2 max-w-[16ch] text-body-md text-neutral-600">
            {segment.tagline}
          </p>
        </div>

        {!disabled && (
          <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight size={22} strokeWidth={2} />
          </span>
        )}
      </div>
    </motion.button>
  );
}
