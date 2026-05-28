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
  autoAdvanceMs?: number;
  autoAdvanceKey?: number;
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
  autoAdvanceMs = 0,
  autoAdvanceKey = 0,
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
            autoAdvanceMs={autoAdvanceMs}
            autoAdvanceKey={autoAdvanceKey}
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
 * Draws a straight line from the tooltip edge toward the target, but
 * terminates at the FRAME EDGE (not inside the frame). The spotlight ring
 * is what signals "look here" once the eye reaches the frame — the line
 * only needs to bridge tooltip ↔ frame, not travel through the mockup's
 * internal UI.
 *
 * Falls back to stopping just outside the spotlight ring when the target
 * is outside the frame or no frame info is available.
 */
function Connector({ geometry }: { geometry: TargetGeometry }) {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const targetCx = geometry.rect.left + geometry.rect.width / 2;
  const targetCy = geometry.rect.top + geometry.rect.height / 2;

  const pos = computePosition(geometry.rect, geometry.frameRect);
  const start = tooltipEdgePoint(pos, targetCx, targetCy);

  const dx = targetCx - start.x;
  const dy = targetCy - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 24) return null;

  // Default endpoint = just outside the spotlight ring (used when there's
  // no frame, or when the target sits outside the frame for some reason).
  const ringRadius =
    Math.max(geometry.rect.width, geometry.rect.height) / 2 +
    SPOTLIGHT_PADDING +
    6;
  const tRing = Math.max(0, 1 - ringRadius / distance);
  let endX = start.x + dx * tRing;
  let endY = start.y + dy * tRing;

  // If we have a frame and the tooltip is positioned OUTSIDE it, terminate
  // the line at the frame edge facing the tooltip. The line should never
  // cross into the mockup's interior — that's what made it visually noisy
  // (passing through journey panels, neighbouring cards, etc.).
  const frame = geometry.frameRect;
  if (frame) {
    const eps = 0.5;
    const SIDE_INSET = 14; // keep endpoint a bit inside the frame edge length
    let tFrame: number | null = null;
    let edgeEndX = endX;
    let edgeEndY = endY;

    if (pos.anchor === "right" && start.x >= frame.right && dx < -eps) {
      tFrame = (frame.right - start.x) / dx;
      edgeEndX = frame.right;
      edgeEndY = start.y + dy * tFrame;
      edgeEndY = Math.max(
        frame.top + SIDE_INSET,
        Math.min(edgeEndY, frame.bottom - SIDE_INSET),
      );
    } else if (pos.anchor === "left" && start.x <= frame.left && dx > eps) {
      tFrame = (frame.left - start.x) / dx;
      edgeEndX = frame.left;
      edgeEndY = start.y + dy * tFrame;
      edgeEndY = Math.max(
        frame.top + SIDE_INSET,
        Math.min(edgeEndY, frame.bottom - SIDE_INSET),
      );
    } else if (pos.anchor === "below" && start.y >= frame.bottom && dy < -eps) {
      tFrame = (frame.bottom - start.y) / dy;
      edgeEndY = frame.bottom;
      edgeEndX = start.x + dx * tFrame;
      edgeEndX = Math.max(
        frame.left + SIDE_INSET,
        Math.min(edgeEndX, frame.right - SIDE_INSET),
      );
    } else if (pos.anchor === "above" && start.y <= frame.top && dy > eps) {
      tFrame = (frame.top - start.y) / dy;
      edgeEndY = frame.top;
      edgeEndX = start.x + dx * tFrame;
      edgeEndX = Math.max(
        frame.left + SIDE_INSET,
        Math.min(edgeEndX, frame.right - SIDE_INSET),
      );
    }

    if (tFrame != null && tFrame > 0 && tFrame < tRing) {
      endX = edgeEndX;
      endY = edgeEndY;
    }
  }

  return (
    <svg
      className="pointer-events-none fixed inset-0"
      width={vw}
      height={vh}
      style={{ zIndex: 9999 }}
      aria-hidden
    >
      <motion.line
        x1={start.x}
        y1={start.y}
        x2={endX}
        y2={endY}
        stroke="#020788"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="6 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.85 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.circle
        cx={endX}
        cy={endY}
        r={6}
        fill="#020788"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: `${endX}px ${endY}px` }}
      />
      <motion.circle
        cx={endX}
        cy={endY}
        r={6}
        fill="#020788"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        style={{ transformOrigin: `${endX}px ${endY}px` }}
      />
    </svg>
  );
}
