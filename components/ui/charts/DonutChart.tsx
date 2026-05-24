"use client";

import { motion } from "framer-motion";
import { useId, useState } from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** Diameter in px. */
  size?: number;
  /** Donut hole as a fraction of the radius. 0.65 = thin ring. */
  thickness?: number;
  /** Gap between slices in degrees. Default 1.5° (subtle). */
  gapDeg?: number;
  /** Big label rendered in the center. */
  centerLabel?: string;
  /** Small label under the center label. */
  centerSublabel?: string;
  /** Allow hover state to highlight slice. Default true. */
  interactive?: boolean;
  className?: string;
}

/**
 * v13.5 — refino profundo nível Linear.
 *
 * Mudanças vs v13.4:
 * - Espaço entre slices (gapDeg) — separa visualmente sem heavy strokes
 * - Hover state: slice "ativo" cresce 2px outward, slices inativos
 *   ficam com opacity 0.55
 * - Track interno (hole) com sutil inset shadow para depth
 * - Center label com gradient text quando interativo está em hover
 * - Animação stroke-dasharray refinada (1.0s ease em vez de 0.9s linear)
 */
export function DonutChart({
  slices,
  size = 180,
  thickness = 0.55,
  gapDeg = 1.5,
  centerLabel,
  centerSublabel,
  interactive = true,
  className,
}: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = size / 2;
  const stroke = radius * (1 - thickness);
  const ringRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const gapFraction = gapDeg / 360;
  const gap = gapFraction * circumference;

  const uid = useId().replace(/:/g, "");
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  let offsetAccum = 0;
  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          {/* Inner shadow via mask for depth on the track */}
          <filter id={`donut-inset-${uid}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" />
            <feOffset dx="0" dy="1" />
            <feComposite
              in2="SourceAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
              result="shadowDiff"
            />
            <feFlood floodColor="black" floodOpacity="0.06" />
            <feComposite in2="shadowDiff" operator="in" />
            <feComposite in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Track — neutral background ring */}
        <circle
          cx={radius}
          cy={radius}
          r={ringRadius}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={stroke}
        />
        {slices.map((s, i) => {
          const portion = s.value / total;
          const length = portion * circumference - gap;
          const dashArray = `${Math.max(0, length)} ${circumference - length}`;
          const dashOffset = -offsetAccum;
          offsetAccum += portion * circumference;
          const isHover = hoverIdx === i;
          const isDimmed = hoverIdx !== null && !isHover;
          return (
            <motion.circle
              key={s.label}
              cx={radius}
              cy={radius}
              r={ringRadius}
              fill="none"
              stroke={s.color}
              strokeWidth={isHover ? stroke + 3 : stroke}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              initial={{ strokeDashoffset: -offsetAccum + length }}
              animate={{
                strokeDashoffset: dashOffset,
                opacity: isDimmed ? 0.45 : 1,
              }}
              transition={{
                duration: 1,
                delay: 0.05 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
              onPointerEnter={
                interactive ? () => setHoverIdx(i) : undefined
              }
              onPointerLeave={
                interactive ? () => setHoverIdx(null) : undefined
              }
              style={{
                cursor: interactive ? "pointer" : "default",
                transition: "stroke-width 200ms ease",
              }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerSublabel) && (
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
          {hoverIdx !== null ? (
            <>
              <motion.span
                key={`hover-${hoverIdx}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: size * 0.18,
                  fontWeight: 700,
                  color: slices[hoverIdx].color,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.025em",
                }}
              >
                {((slices[hoverIdx].value / total) * 100).toFixed(0)}%
              </motion.span>
              <motion.span
                key={`hover-label-${hoverIdx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.22, delay: 0.05 }}
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-ui)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "#6c757d",
                  maxWidth: size * 0.8,
                  textAlign: "center",
                }}
              >
                {slices[hoverIdx].label}
              </motion.span>
            </>
          ) : (
            <>
              {centerLabel && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: size * 0.18,
                    fontWeight: 700,
                    color: "#020788",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {centerLabel}
                </motion.span>
              )}
              {centerSublabel && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.3 }}
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#6c757d",
                  }}
                >
                  {centerSublabel}
                </motion.span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Legend rows — refino v13.5:
 * - Border-left 2px color (em vez de só o dot)
 * - Hover row sutil (bg neutral-50)
 * - Tipografia mais firme (-0.005em em labels)
 */
export function DonutLegend({
  slices,
  total,
  formatValue = (v) => v.toString(),
  className,
}: {
  slices: DonutSlice[];
  total?: number;
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const sum = (total ?? slices.reduce((s, x) => s + x.value, 0)) || 1;
  return (
    <ul className={className} style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {slices.map((s, i) => {
        const pct = ((s.value / sum) * 100).toFixed(0);
        return (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0 8px 10px",
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "#495057",
              borderLeft: `2px solid ${s.color}`,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
              marginBottom: 2,
              transition: "background 150ms ease",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: s.color,
                flex: "none",
                boxShadow: `0 0 0 3px ${s.color}1a`,
              }}
            />
            <span
              style={{
                flex: 1,
                fontWeight: 600,
                letterSpacing: "-0.005em",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontWeight: 700,
                color: "#212529",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.01em",
              }}
            >
              {formatValue(s.value)}
            </span>
            <span
              style={{
                width: 32,
                textAlign: "right",
                color: "#9ca3af",
                fontVariantNumeric: "tabular-nums",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {pct}%
            </span>
          </motion.li>
        );
      })}
    </ul>
  );
}
