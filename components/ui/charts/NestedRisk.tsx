"use client";

import { motion } from "framer-motion";
import { useId } from "react";

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
 * v13.5 — refino profundo.
 *
 * Discos concêntricos com:
 * - Cada anel ganha gradient radial (centro mais escuro, borda fade)
 * - Inner highlight branco no topo de cada anel
 * - Labels com leader dots (não mais texto solto)
 * - Animação stagger: anéis crescem de fora pra dentro com spring
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
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {rings.map((r, i) => (
            <radialGradient
              key={`grad-${i}`}
              id={`risk-grad-${uid}-${i}`}
              cx="50%"
              cy="35%"
              r="65%"
            >
              <stop offset="0%" stopColor={r.color} stopOpacity="1" />
              <stop offset="100%" stopColor={r.color} stopOpacity="0.78" />
            </radialGradient>
          ))}
        </defs>

        {rings.map((r, i) => {
          const radius = maxR * (r.pct / 100);
          return (
            <g key={`${r.label}-${i}`}>
              <motion.circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={`url(#risk-grad-${uid}-${i})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 20,
                  delay: 0.08 * i,
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
              {/* Inner top highlight */}
              <motion.ellipse
                cx={cx}
                cy={cy - radius * 0.45}
                rx={radius * 0.6}
                ry={radius * 0.18}
                fill="rgba(255,255,255,0.18)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + 0.08 * i, duration: 0.4 }}
              />
            </g>
          );
        })}

        {/* Side labels with leader dot + percentage */}
        {rings.map((r, i) => {
          const radius = maxR * (r.pct / 100);
          const labelX = cx - radius - 4;
          return (
            <g key={`label-${r.label}-${i}`}>
              <motion.circle
                cx={labelX + 2}
                cy={cy}
                r={1.5}
                fill="#94a3b8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + 0.08 * i, duration: 0.2 }}
              />
              <motion.text
                x={labelX - 3}
                y={cy + 2.5}
                fontFamily="var(--font-ui)"
                fontSize="8"
                fontWeight="700"
                fill="#475569"
                textAnchor="end"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + 0.08 * i, duration: 0.3 }}
                style={{
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.005em",
                }}
              >
                {r.pct}%
              </motion.text>
            </g>
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
            letterSpacing: "-0.025em",
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
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
              marginTop: 3,
              fontFamily: "var(--font-ui)",
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.92)",
              textShadow: "0 1px 1px rgba(0,0,0,0.10)",
            }}
          >
            {centerSublabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
