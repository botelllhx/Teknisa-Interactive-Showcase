"use client";

import { motion } from "framer-motion";

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
  /** Big label rendered in the center. */
  centerLabel?: string;
  /** Small label under the center label. */
  centerSublabel?: string;
  className?: string;
}

/**
 * Soft, modern donut chart — references: Panacea Patient Risk Analytics,
 * Knowwio Weekly Activity Split. Each slice animates draw-on with a stroke
 * dasharray transition.
 */
export function DonutChart({
  slices,
  size = 180,
  thickness = 0.6,
  centerLabel,
  centerSublabel,
  className,
}: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const radius = size / 2;
  const stroke = radius * (1 - thickness);
  const ringRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * ringRadius;

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
        {/* Track */}
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
          const length = portion * circumference;
          const dashArray = `${length} ${circumference - length}`;
          const dashOffset = -offsetAccum;
          offsetAccum += length;
          return (
            <motion.circle
              key={s.label}
              cx={radius}
              cy={radius}
              r={ringRadius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={dashArray}
              initial={{ strokeDashoffset: -offsetAccum + length }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{
                duration: 0.9,
                delay: 0.05 * i,
                ease: [0.16, 1, 0.3, 1],
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
                marginTop: 4,
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#6c757d",
              }}
            >
              {centerSublabel}
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Legend rows that pair with DonutChart — color dot + label + value/percent.
 * Reference: Panacea — list to the left of the donut.
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
    <ul className={className}>
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
              paddingTop: 6,
              paddingBottom: 6,
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "#495057",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: s.color,
                flex: "none",
              }}
            />
            <span style={{ flex: 1, fontWeight: 500 }}>{s.label}</span>
            <span
              style={{
                fontWeight: 700,
                color: "#212529",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatValue(s.value)}
            </span>
            <span
              style={{
                width: 32,
                textAlign: "right",
                color: "#6c757d",
                fontVariantNumeric: "tabular-nums",
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
