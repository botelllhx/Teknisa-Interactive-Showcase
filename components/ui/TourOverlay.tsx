"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TargetGeometry } from "@/hooks/useTour";
import type { TourStep } from "@/data/solutions";
import {
  TourTooltip,
  computePosition,
  tooltipEdgePoint,
} from "./TourTooltip";

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
          {geometry && <Connector geometry={geometry} />}

          <TourTooltip
            key={`tooltip-${step.id}`}
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            targetRect={geometry?.rect ?? null}
            frameRect={geometry?.frameRect ?? null}
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

/**
 * Draws a soft S-curve connector from the tooltip edge to the spotlight
 * ring on the target. Uses an SVG with a quadratic Bézier path so the line
 * reaches the element even when the tooltip is parked outside the device.
 */
function Connector({ geometry }: { geometry: TargetGeometry }) {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const targetCx = geometry.rect.left + geometry.rect.width / 2;
  const targetCy = geometry.rect.top + geometry.rect.height / 2;

  const pos = computePosition(geometry.rect, geometry.frameRect);
  const start = tooltipEdgePoint(pos, targetCx, targetCy);

  // Aim for a point just outside the spotlight ring edge instead of dead center
  const dx = targetCx - start.x;
  const dy = targetCy - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 24) return null;
  const ringRadius =
    Math.max(geometry.rect.width, geometry.rect.height) / 2 + SPOTLIGHT_PADDING + 4;
  const t = Math.max(0, 1 - ringRadius / distance);
  const endX = start.x + dx * t;
  const endY = start.y + dy * t;

  // Control point: nudged perpendicular to add a gentle curve
  const midX = (start.x + endX) / 2;
  const midY = (start.y + endY) / 2;
  const perpX = -dy / (distance || 1);
  const perpY = dx / (distance || 1);
  const curveOffset = Math.min(40, distance * 0.12);
  const ctrlX = midX + perpX * curveOffset;
  const ctrlY = midY + perpY * curveOffset;

  const path = `M ${start.x} ${start.y} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;

  return (
    <svg
      className="pointer-events-none fixed inset-0"
      width={vw}
      height={vh}
      style={{ zIndex: 9999 }}
      aria-hidden
    >
      <defs>
        <marker
          id="tour-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#020788" />
        </marker>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="#020788"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="6 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        markerEnd="url(#tour-arrow)"
      />
    </svg>
  );
}
