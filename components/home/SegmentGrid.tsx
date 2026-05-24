"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { segments, type Segment } from "@/data/solutions";
import { useShowcase } from "@/lib/store";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { SegmentIcon } from "@/components/ui/SegmentIcon";

export function SegmentGrid() {
  const selectSegment = useShowcase((s) => s.selectSegment);

  // v13: 7 segments (Gestão Corporativa removed). Auto rows so the second
  // row holds 3 cards left-aligned without a visible empty cell stretching.
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-5 px-12 pb-10"
    >
      {segments.map((segment) => (
        <SegmentCard
          key={segment.id}
          segment={segment}
          onSelect={() => selectSegment(segment.id)}
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
  const solutionCount = segment.solutions.length;

  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      onClick={onSelect}
      aria-label={`Abrir ${segment.label}`}
      // v13 refinement: tighter typography (tracking -0.02em on big title),
      // subtle shadow (shadow-subtle), borders 6% opacity, uniform tagline
      // height via min-h so titles align across cards even with varied text
      className="group relative flex h-full flex-col justify-between rounded-2xl bg-white p-6 text-left transition-all hover:-translate-y-[1px] hover:shadow-elevated"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-subtle text-brand transition-colors group-hover:bg-brand group-hover:text-white"
          style={{
            background:
              "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
            color: "#020788",
          }}
        >
          <SegmentIcon name={segment.icon} size={28} />
        </div>

        <span
          className="font-ui text-[10px] font-bold uppercase text-neutral-500"
          style={{ letterSpacing: "0.08em" }}
        >
          {solutionCount} {solutionCount === 1 ? "solução" : "soluções"}
        </span>
      </div>

      <div className="mt-12 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className="font-display text-[26px] font-bold leading-tight text-neutral-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            {segment.label}
          </h2>
          <p
            className="mt-1.5 font-ui text-[12.5px] leading-snug text-neutral-500"
            style={{
              letterSpacing: "-0.005em",
              minHeight: "2.6em", // mantém títulos alinhados independente do tamanho da tagline
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {segment.tagline}
          </p>
        </div>

        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors group-hover:bg-brand group-hover:text-white">
          <ArrowUpRight size={18} strokeWidth={2.25} />
        </span>
      </div>
    </motion.button>
  );
}
