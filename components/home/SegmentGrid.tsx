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
      // v13.3: card refinado Noteflow-airy. Eyebrow numérico "0X · grupo",
      // ícone gradient soft brand→roxo (Notion-style), arrow chip que ganha
      // wash brand no hover, tipografia mais firme (-0.025em no título).
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 text-left transition-all hover:-translate-y-[1px]"
      style={{
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* Hover-only soft wash (apenas indigo brand) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(59,66,196,0.08), transparent 55%), radial-gradient(ellipse at bottom right, rgba(2,7,136,0.05), transparent 60%)",
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
          <SegmentIcon name={segment.icon} size={26} />
        </div>

        <span
          className="font-ui text-[10px] font-bold uppercase text-neutral-400"
          style={{ letterSpacing: "0.14em" }}
        >
          {solutionCount} {solutionCount === 1 ? "solução" : "soluções"}
        </span>
      </div>

      <div className="relative mt-12 flex items-end justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className="font-display text-[26px] font-bold leading-[1.08] text-neutral-900"
            style={{ letterSpacing: "-0.025em" }}
          >
            {segment.label}
          </h2>
          <p
            className="mt-2 font-ui text-[12.5px] leading-snug text-neutral-500"
            style={{
              letterSpacing: "-0.005em",
              minHeight: "2.6em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {segment.tagline}
          </p>
        </div>

        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-neutral-50 text-neutral-500 transition-all group-hover:bg-brand group-hover:text-white group-hover:shadow-brand"
          style={{
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <ArrowUpRight
            size={18}
            strokeWidth={2.25}
            className="transition-transform duration-300 group-hover:rotate-12"
          />
        </span>
      </div>
    </motion.button>
  );
}
