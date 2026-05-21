"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TargetGeometry } from "@/hooks/useTour";
import type { TourStep } from "@/data/solutions";
import { TourTooltip } from "./TourTooltip";

interface TourOverlayProps {
  active: boolean;
  step: TourStep | null;
  stepIndex: number;
  totalSteps: number;
  geometry: TargetGeometry | null;
  isFirst: boolean;
  isLast: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const SPOTLIGHT_PADDING = 8;

export function TourOverlay({
  active,
  step,
  stepIndex,
  totalSteps,
  geometry,
  isFirst,
  isLast,
  onNext,
  onPrev,
  onSkip,
}: TourOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {active && step && (
        <motion.div
          key="tour-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none fixed inset-0 z-[9999]"
        >
          {geometry && <SpotlightRing geometry={geometry} />}

          <TourTooltip
            key={`tooltip-${step.id}`}
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            targetRect={geometry?.rect ?? null}
            onNext={onNext}
            onPrev={onPrev}
            onSkip={onSkip}
            isFirst={isFirst}
            isLast={isLast}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function SpotlightRing({ geometry }: { geometry: TargetGeometry }) {
  const { rect, borderRadius } = geometry;
  const x = rect.left - SPOTLIGHT_PADDING;
  const y = rect.top - SPOTLIGHT_PADDING;
  const w = rect.width + SPOTLIGHT_PADDING * 2;
  const h = rect.height + SPOTLIGHT_PADDING * 2;

  return (
    <>
      {/* Outer pulsing halo */}
      <motion.div
        className="pointer-events-none fixed"
        initial={false}
        animate={{
          top: y - 6,
          left: x - 6,
          width: w + 12,
          height: h + 12,
          borderRadius: Math.min(borderRadius + 6, 22),
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.7 }}
      >
        <motion.div
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full rounded-[inherit]"
          style={{
            boxShadow:
              "0 0 0 6px rgba(2,7,136,0.18), 0 0 32px 8px rgba(2,7,136,0.30), 0 0 60px 12px rgba(2,7,136,0.12)",
          }}
        />
      </motion.div>

      {/* Inner solid ring */}
      <motion.div
        className="pointer-events-none fixed"
        initial={false}
        animate={{
          top: y,
          left: x,
          width: w,
          height: h,
          borderRadius: Math.min(borderRadius, 16),
        }}
        transition={{ type: "spring", stiffness: 220, damping: 26, mass: 0.7 }}
        style={{
          border: "3px solid #020788",
          background: "transparent",
        }}
      />
    </>
  );
}
