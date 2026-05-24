"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { segments, type Segment } from "@/data/solutions";
import { useShowcase } from "@/lib/store";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { SegmentIcon } from "@/components/ui/SegmentIcon";

export function SegmentGrid() {
  const selectSegment = useShowcase((s) => s.selectSegment);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-4 gap-5 px-12 pb-10"
    >
      {segments.map((segment, idx) => (
        <SegmentCard
          key={segment.id}
          segment={segment}
          index={idx}
          onSelect={() => selectSegment(segment.id)}
        />
      ))}
    </motion.div>
  );
}

interface SegmentCardProps {
  segment: Segment;
  index: number;
  onSelect: () => void;
}

/**
 * v13.16 — DENSE card layout (Noteflow / Linear style).
 * Antes: body flex-1 com gap-6 deixava muito whitespace vertical
 * Agora: estrutura compacta sem flex-1 internamente; o conteúdo
 * preenche naturalmente. Cards uniformes via min-h.
 */
function SegmentCard({ segment, index, onSelect }: SegmentCardProps) {
  const solutionCount = segment.solutions.length;

  // Parallax 3D motion values (suaves)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rxSpring = useSpring(rotateX, {
    stiffness: 220,
    damping: 28,
    mass: 0.6,
  });
  const rySpring = useSpring(rotateY, {
    stiffness: 220,
    damping: 28,
    mass: 0.6,
  });

  const lightX = useMotionValue(50);
  const lightY = useMotionValue(50);
  const lxSpring = useSpring(lightX, { stiffness: 80, damping: 18 });
  const lySpring = useSpring(lightY, { stiffness: 80, damping: 18 });
  const lightBg = useTransform(
    [lxSpring, lySpring],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(2,7,136,0.06), transparent 60%)`,
  );

  return (
    <motion.button
      type="button"
      variants={fadeInUp}
      transition={{ type: "spring", stiffness: 180, damping: 26, mass: 0.8 }}
      onClick={onSelect}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        rotateY.set((x - 0.5) * 5);
        rotateX.set(-(y - 0.5) * 5);
        lightX.set(x * 100);
        lightY.set(y * 100);
      }}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
        lightX.set(50);
        lightY.set(50);
      }}
      whileTap={{ scale: 0.99 }}
      aria-label={`Abrir ${segment.label}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-7 text-left"
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)",
        transformStyle: "preserve-3d",
        rotateX: rxSpring,
        rotateY: rySpring,
        perspective: 1000,
        minHeight: 280,
      }}
    >
      {/* Cursor follow highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: lightBg }}
      />

      {/* Hover border glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(2,7,136,0.18), 0 12px 28px -10px rgba(2,7,136,0.12)",
        }}
      />

      {/* Top row: ícone + eyebrow numérico + live dot */}
      <div className="relative flex items-start justify-between">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-brand transition-transform group-hover:scale-[1.04]"
          style={{
            background:
              "linear-gradient(135deg, rgba(2,7,136,0.10) 0%, rgba(59,66,196,0.14) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(2,7,136,0.06)",
          }}
        >
          <SegmentIcon name={segment.icon} size={32} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="font-ui text-[10px] font-bold uppercase text-neutral-400"
            style={{ letterSpacing: "0.16em" }}
          >
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>{" "}
            ·{" "}
            <span className="tabular-nums">
              {String(solutionCount).padStart(2, "0")} {" "}
            </span>
            {solutionCount === 1 ? "solução" : "soluções"}
          </span>
          <span
            aria-hidden
            className="relative flex h-2 w-2 items-center justify-center"
          >
            <motion.span
              animate={{ scale: [1, 2, 1], opacity: [0.35, 0, 0.35] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-success"
            />
            <span className="relative h-2 w-2 rounded-full bg-success" />
          </span>
        </div>
      </div>

      {/* Title + tagline (sem flex-1 — naturalmente denso) */}
      <div className="relative mt-6">
        <h2
          className="font-display text-[28px] font-bold leading-[1.05] text-neutral-900"
          style={{ letterSpacing: "-0.030em" }}
        >
          {segment.label}
        </h2>
        <p
          className="mt-2 font-ui text-[14.5px] leading-[1.45] text-neutral-500"
          style={{
            letterSpacing: "-0.005em",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.7em",
          }}
        >
          {segment.tagline}
        </p>
      </div>

      {/* Footer mt-auto pins ao bottom; cards mesma altura uniforme */}
      <div
        className="relative mt-auto flex items-center justify-between border-t border-neutral-100 pt-4"
      >
        <span
          className="font-ui text-[10.5px] font-bold uppercase text-neutral-400 transition-colors duration-300 group-hover:text-brand"
          style={{ letterSpacing: "0.16em" }}
        >
          Abrir painel
        </span>
        <motion.span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition-all duration-300 group-hover:bg-brand group-hover:text-white"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          whileHover={{ x: 2 }}
        >
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </motion.span>
      </div>
    </motion.button>
  );
}
