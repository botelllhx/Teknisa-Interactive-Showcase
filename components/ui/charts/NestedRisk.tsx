"use client";

import { motion } from "framer-motion";

interface RiskRing {
  pct: number; // 0-100
  label: string;
  color: string;
}

interface NestedRiskProps {
  rings: RiskRing[]; // ordered from outermost (largest pct) to innermost
  size?: number;
  centerLabel: string;
  centerSublabel?: string;
  className?: string;
}

/**
 * Concentric layered disks (Panacea/AI dashboard reference). Each ring is a
 * filled circle with decreasing radius + opacity stack, label rendered to
 * the side. Center cap shows the headline figure.
 */
export function NestedRisk({
  rings,
  size = 180,
  centerLabel,
  centerSublabel,
  className,
}: NestedRiskProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 6;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {rings.map((r, i) => {
          const radius = maxR * (r.pct / 100);
          return (
            <motion.circle
              key={`${r.label}-${i}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill={r.color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.08 * i,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
        {/* Side labels with leader dots */}
        {rings.map((r, i) => {
          const radius = maxR * (r.pct / 100);
          const labelX = cx - radius - 6;
          return (
            <motion.text
              key={`label-${r.label}-${i}`}
              x={labelX}
              y={cy + 3}
              fontFamily="var(--font-ui)"
              fontSize="9"
              fontWeight="700"
              fill="#475569"
              textAnchor="end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + 0.08 * i, duration: 0.3 }}
            >
              {r.pct}%
            </motion.text>
          );
        })}
      </svg>
      {/* Center label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <motion.span
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: size * 0.16,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {centerLabel}
        </motion.span>
        {centerSublabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            style={{
              marginTop: 2,
              fontFamily: "var(--font-ui)",
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {centerSublabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
