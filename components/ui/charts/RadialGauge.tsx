"use client";

import { motion } from "framer-motion";

interface RadialGaugeProps {
  /** Value 0–100. */
  value: number;
  /** Label inside the gauge (big). */
  label?: string;
  /** Small label under the big label. */
  sublabel?: string;
  /** Color stops for the arc gradient. */
  colors?: { from: string; to: string };
  /** Diameter in px. */
  size?: number;
  className?: string;
}

/**
 * Half-circle radial gauge — the "speedometer" pattern from Knowwio Speed
 * Optimization (87%) and DropInBlog. Animated arc fill + big value in center.
 */
export function RadialGauge({
  value,
  label,
  sublabel,
  colors = { from: "#3b42c4", to: "#020788" },
  size = 180,
  className,
}: RadialGaugeProps) {
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius; // half-circle
  const clamped = Math.max(0, Math.min(100, value));
  const filled = (clamped / 100) * circumference;

  const id = `gauge-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size / 2 + 24,
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size / 2 + 24}`}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 4,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: size * 0.22,
            fontWeight: 700,
            color: "#020788",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {label ?? `${Math.round(clamped)}%`}
        </motion.span>
        {sublabel && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.3 }}
            style={{
              marginTop: 2,
              fontFamily: "var(--font-ui)",
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.6,
              color: "#6c757d",
            }}
          >
            {sublabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
