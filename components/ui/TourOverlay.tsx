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

const SPOTLIGHT_PADDING = 10;

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
          transition={{ duration: 0.25 }}
          className="pointer-events-none fixed inset-0 z-[9999]"
        >
          <Spotlight geometry={geometry} />

          {geometry ? (
            <>
              <SpotlightRing geometry={geometry} />
              <TourTooltip
                key={`tooltip-${step.id}`}
                step={step}
                stepIndex={stepIndex}
                totalSteps={totalSteps}
                targetRect={geometry.rect}
                onNext={onNext}
                onPrev={onPrev}
                onSkip={onSkip}
                isFirst={isFirst}
                isLast={isLast}
              />
            </>
          ) : (
            <CenteredTooltip
              step={step}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              onNext={onNext}
              onPrev={onPrev}
              onSkip={onSkip}
              isFirst={isFirst}
              isLast={isLast}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Spotlight({ geometry }: { geometry: TargetGeometry | null }) {
  // The SVG mask carves a rounded-rect hole through a 60% black backdrop.
  // We always render the backdrop. When there is no geometry, the rect is at
  // (-100, -100, 0, 0) so the hole is invisible and the full screen darkens.
  const rect = geometry?.rect;
  const radius = geometry?.borderRadius ?? 8;

  const x = rect ? rect.left - SPOTLIGHT_PADDING : -100;
  const y = rect ? rect.top - SPOTLIGHT_PADDING : -100;
  const w = rect ? rect.width + SPOTLIGHT_PADDING * 2 : 0;
  const h = rect ? rect.height + SPOTLIGHT_PADDING * 2 : 0;

  return (
    <svg
      className="pointer-events-none fixed inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="tour-spotlight-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.rect
            initial={false}
            animate={{ x, y, width: w, height: h }}
            transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
            rx={Math.min(radius, 16)}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(0,0,0,0.60)"
        mask="url(#tour-spotlight-mask)"
      />
    </svg>
  );
}

function SpotlightRing({ geometry }: { geometry: TargetGeometry }) {
  const { rect, borderRadius } = geometry;
  const x = rect.left - SPOTLIGHT_PADDING;
  const y = rect.top - SPOTLIGHT_PADDING;
  const w = rect.width + SPOTLIGHT_PADDING * 2;
  const h = rect.height + SPOTLIGHT_PADDING * 2;

  return (
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
      transition={{ type: "spring", stiffness: 200, damping: 28, mass: 0.8 }}
      style={{
        border: "2px solid rgba(2,7,136,0.65)",
        boxShadow:
          "0 0 0 6px rgba(2,7,136,0.18), 0 0 24px rgba(2,7,136,0.25)",
      }}
    />
  );
}

function CenteredTooltip({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: Omit<TourOverlayProps, "active" | "geometry"> & { step: TourStep }) {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <TourTooltip
        step={step}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        targetRect={null}
        onNext={onNext}
        onPrev={onPrev}
        onSkip={onSkip}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  );
}
