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

/**
 * v13.6 — redesign "painel" pedido pelo cliente:
 * - Mais quadrado (rounded-xl 12px, era 2xl 20px)
 * - Anatomia de painel: header (eyebrow numérico + chip), corpo
 *   (ícone + título + tagline), footer (divider sutil + meta)
 * - Animação NÃO PULA (sem y -3 brusco). Em vez disso:
 *   - Spring suave stiffness 180 damping 26 mass 0.8
 *   - Cursor parallax 3D sutil (rotateX/Y ~3° baseado em mouse) -
 *     dá sensação de painel respondendo ao usuário
 *   - Border brand fade-in (5% → 25% no hover) em vez de transform
 *   - Arrow desliza 2px à direita, sem rotação
 *   - Icon ganha glow soft no hover (boxShadow brand)
 *   - Status dot pulsante no canto (live indicator)
 */
function SegmentCard({ segment, onSelect }: SegmentCardProps) {
  const solutionCount = segment.solutions.length;

  // Parallax 3D motion values
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rxSpring = useSpring(rotateX, { stiffness: 220, damping: 28, mass: 0.6 });
  const rySpring = useSpring(rotateY, { stiffness: 220, damping: 28, mass: 0.6 });

  // Light position for the highlight gradient (follows mouse)
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
        rotateY.set((x - 0.5) * 6);
        rotateX.set(-(y - 0.5) * 6);
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
      className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white text-left"
      style={{
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)",
        transformStyle: "preserve-3d",
        rotateX: rxSpring,
        rotateY: rySpring,
        perspective: 1000,
      }}
    >
      {/* Cursor-following highlight (suave) */}
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

      {/* ───────── Header strip (panel anatomy) ───────── */}
      <div
        className="flex items-center justify-between px-7 pb-4 pt-5"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-ui text-[11px] font-bold tabular-nums text-neutral-400"
            style={{ letterSpacing: "0.16em" }}
          >
            {String(segments.findIndex((s) => s.id === segment.id) + 1).padStart(
              2,
              "0",
            )}
          </span>
          <span className="h-4 w-px bg-neutral-200" />
          <span
            className="font-ui text-[11px] font-bold uppercase text-neutral-400"
            style={{ letterSpacing: "0.16em" }}
          >
            {solutionCount === 1 ? "solução" : "soluções"}
          </span>
          <span
            className="font-ui text-[11px] font-bold tabular-nums text-brand"
            style={{ letterSpacing: "-0.005em" }}
          >
            ·{solutionCount.toString().padStart(2, "0")}
          </span>
        </div>
        {/* Live dot status — indica painel ativo */}
        <span
          aria-hidden
          className="relative flex h-2 w-2 items-center justify-center"
        >
          <motion.span
            animate={{ scale: [1, 2, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-success"
          />
          <span className="relative h-2 w-2 rounded-full bg-success" />
        </span>
      </div>

      {/* ───────── Body ───────── */}
      <div className="flex flex-1 flex-col gap-6 px-7 pb-5 pt-7">
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-brand transition-shadow duration-300"
          style={{
            background:
              "linear-gradient(135deg, rgba(2,7,136,0.10) 0%, rgba(59,66,196,0.14) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(2,7,136,0.06)",
          }}
        >
          <SegmentIcon name={segment.icon} size={32} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <h2
            className="font-display text-[30px] font-bold leading-[1.06] text-neutral-900"
            style={{ letterSpacing: "-0.028em" }}
          >
            {segment.label}
          </h2>
          <p
            className="mt-2.5 font-ui text-[14.5px] leading-[1.45] text-neutral-500"
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
      </div>

      {/* ───────── Footer (panel chrome) ───────── */}
      <div
        className="flex items-center justify-between px-7 py-4"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.04)",
          background: "linear-gradient(180deg, transparent 0%, #fafbfd 100%)",
        }}
      >
        <span
          className="font-ui text-[12px] font-bold uppercase text-neutral-400 transition-colors duration-300 group-hover:text-brand"
          style={{ letterSpacing: "0.16em" }}
        >
          Abrir painel
        </span>
        <motion.span
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-50 text-neutral-500 transition-all duration-300 group-hover:bg-brand group-hover:text-white"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          whileHover={{ x: 2 }}
        >
          <ArrowUpRight
            size={20}
            strokeWidth={2.5}
            className="transition-transform"
          />
        </motion.span>
      </div>
    </motion.button>
  );
}
