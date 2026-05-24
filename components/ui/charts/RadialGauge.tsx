"use client";

import { motion } from "framer-motion";
import { useId } from "react";

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
  /** Stroke thickness. Default 10 (thinner than v13.4's 14, Linear feel). */
  thickness?: number;
  /** Show tick marks on the arc. */
  showTicks?: boolean;
  /** Override the big label color (default brand). */
  labelColor?: string;
  /** Override the sublabel color (default neutral-400). */
  sublabelColor?: string;
  /** Override the track color (default neutral-100). */
  trackColor?: string;
  className?: string;
}

/**
 * v13.5 — refino profundo.
 *
 * Mudanças vs v13.4:
 * - Stroke padrão 10px (era 14) — vibe Linear/Knowwio, mais elegante
 * - Tick marks opcionais ao longo do arco (5 ticks) — leitura mais fácil
 * - Tracking refinado no big label (-0.030em)
 * - Halo pulsante no início do arco (indica posição "vivo")
 * - Sombra interna sutil na track via filter (depth real)
 */
export function RadialGauge({
  value,
  label,
  sublabel,
  colors = { from: "#3b42c4", to: "#020788" },
  size = 180,
  thickness = 10,
  showTicks = false,
  labelColor = "#020788",
  sublabelColor = "#9ca3af",
  trackColor = "#eef0f4",
  className,
}: RadialGaugeProps) {
  const padding = thickness / 2 + 2;
  const radius = size / 2 - padding;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const filled = (clamped / 100) * circumference;

  const uid = useId().replace(/:/g, "");
  const gid = `gauge-${uid}`;

  // Position of the tip of the filled arc (for halo)
  const tipAngle = Math.PI * (clamped / 100);
  const tipX = cx - radius * Math.cos(tipAngle);
  const tipY = cy - radius * Math.sin(tipAngle);

  // Tick marks (5 ticks along the arc: 0, 25, 50, 75, 100)
  const ticks = showTicks ? [0, 25, 50, 75, 100] : [];

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size / 2 + 26,
        position: "relative",
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size / 2 + 26}`}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="55%" stopColor={colors.to} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>

        {/* Tick marks behind the track */}
        {ticks.map((tickPct, i) => {
          const angle = Math.PI * (tickPct / 100);
          const outerR = radius + thickness / 2 + 1;
          const innerR = radius + thickness / 2 + 5;
          const x1 = cx - outerR * Math.cos(angle);
          const y1 = cy - outerR * Math.sin(angle);
          const x2 = cx - innerR * Math.cos(angle);
          const y2 = cy - innerR * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(0,0,0,0.10)"
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Track */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <motion.path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Pulsing halo at the tip of the filled arc */}
        {clamped > 0 && (
          <motion.circle
            cx={tipX}
            cy={tipY}
            r={thickness / 2 + 2}
            fill={colors.to}
            opacity={0.32}
            animate={{
              r: [thickness / 2 + 1, thickness / 2 + 4, thickness / 2 + 1],
              opacity: [0.20, 0.40, 0.20],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.3,
            }}
          />
        )}
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
            color: labelColor,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.030em",
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
              marginTop: 4,
              fontFamily: "var(--font-ui)",
              fontSize: 9.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: sublabelColor,
            }}
          >
            {sublabel}
          </motion.span>
        )}
      </div>
    </div>
  );
}
