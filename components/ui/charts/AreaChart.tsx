"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface AreaPoint {
  x: string | number;
  y: number;
}

interface AreaChartProps {
  data: AreaPoint[];
  /** Color for the line + gradient. Defaults to brand. */
  color?: string;
  /** Show horizontal grid lines. */
  grid?: boolean;
  /** Show last value as a halo dot. */
  highlightLast?: boolean;
  /** Optional reference (target) line value. */
  referenceY?: number;
  referenceLabel?: string;
  /** Optional override for min/max — useful to make small deltas visible. */
  yMin?: number;
  yMax?: number;
  /** Aspect of the chart viewBox. */
  aspectRatio?: string;
  className?: string;
  /** Format the tooltip Y. */
  formatY?: (v: number) => string;
  /** Show x-axis labels. */
  showXLabels?: boolean;
}

/**
 * Smooth area chart with a soft brand gradient fill, hover tooltip, and
 * last-point halo. Reference: Knowwio Progress Overview (orange area with
 * vertical tooltip line and dot), Panacea Patients Statistics.
 */
export function AreaChart({
  data,
  color = "#020788",
  grid = true,
  highlightLast = true,
  referenceY,
  referenceLabel,
  yMin: yMinOverride,
  yMax: yMaxOverride,
  aspectRatio = "16/7",
  className,
  formatY = (v) => v.toString(),
  showXLabels = true,
}: AreaChartProps) {
  const VBW = 400;
  const VBH = 160;
  const PAD_L = 4;
  const PAD_R = 8;
  const PAD_T = 18;
  const PAD_B = showXLabels ? 24 : 8;

  const [hover, setHover] = useState<number | null>(null);

  const { points, yMin, yMax } = useMemo(() => {
    const values = data.map((d) => d.y);
    const yMin =
      yMinOverride ?? Math.min(...values, referenceY ?? Infinity) - 1;
    const yMax =
      yMaxOverride ?? Math.max(...values, referenceY ?? -Infinity) + 1;
    const span = Math.max(0.001, yMax - yMin);
    const inner = VBW - PAD_L - PAD_R;
    const innerH = VBH - PAD_T - PAD_B;
    const points = data.map((d, i) => ({
      x: PAD_L + (i / Math.max(1, data.length - 1)) * inner,
      y: PAD_T + innerH - ((d.y - yMin) / span) * innerH,
      raw: d,
    }));
    return { points, yMin, yMax };
  }, [data, referenceY, yMinOverride, yMaxOverride, PAD_B]);

  if (points.length === 0) return null;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${VBH - PAD_B} L ${points[0].x} ${VBH - PAD_B} Z`;

  const refY = referenceY != null
    ? PAD_T + (VBH - PAD_T - PAD_B) - ((referenceY - yMin) / Math.max(0.001, yMax - yMin)) * (VBH - PAD_T - PAD_B)
    : null;

  const gridLines = grid ? [0.25, 0.5, 0.75] : [];

  const hoverPoint = hover != null ? points[hover] : null;

  return (
    <div
      className={className}
      style={{ width: "100%", position: "relative", aspectRatio }}
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", overflow: "visible" }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="60%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {gridLines.map((t) => {
          const y = PAD_T + (VBH - PAD_T - PAD_B) * t;
          return (
            <line
              key={t}
              x1={PAD_L}
              x2={VBW - PAD_R}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth={0.5}
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Reference line */}
        {refY != null && (
          <>
            <line
              x1={PAD_L}
              x2={VBW - PAD_R}
              y1={refY}
              y2={refY}
              stroke="#16a34a"
              strokeWidth={0.7}
              strokeDasharray="3 2"
            />
            {referenceLabel && (
              <text
                x={VBW - PAD_R - 4}
                y={refY - 3}
                fontFamily="var(--font-ui)"
                fontSize="8"
                fontWeight="700"
                fill="#16a34a"
                textAnchor="end"
              >
                {referenceLabel}
              </text>
            )}
          </>
        )}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#area-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        />

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Invisible hit areas */}
        {points.map((p, i) => (
          <rect
            key={i}
            x={p.x - (VBW / points.length) / 2}
            y={PAD_T}
            width={VBW / points.length}
            height={VBH - PAD_T - PAD_B}
            fill="transparent"
            onPointerEnter={() => setHover(i)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Hover vertical line */}
        {hoverPoint && (
          <g>
            <line
              x1={hoverPoint.x}
              x2={hoverPoint.x}
              y1={PAD_T}
              y2={VBH - PAD_B}
              stroke={color}
              strokeWidth={0.6}
              strokeDasharray="2 2"
              opacity={0.7}
            />
            <circle
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r={3}
              fill="white"
              stroke={color}
              strokeWidth={1.5}
            />
          </g>
        )}

        {/* Last-point halo */}
        {highlightLast && !hoverPoint && (
          <g>
            <motion.circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={6}
              fill={color}
              opacity={0.18}
              animate={{ r: [4, 7, 4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={2.5}
              fill={color}
            />
          </g>
        )}

        {/* X-axis labels */}
        {showXLabels &&
          points.map((p, i) => {
            // Show every Nth label for density control
            const showEvery = Math.max(1, Math.floor(points.length / 7));
            if (i % showEvery !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={`xl-${i}`}
                x={p.x}
                y={VBH - 4}
                fontFamily="var(--font-ui)"
                fontSize="8"
                fontWeight="500"
                fill="#9ca3af"
                textAnchor="middle"
              >
                {String(p.raw.x)}
              </text>
            );
          })}
      </svg>

      {/* Hover tooltip */}
      {hoverPoint && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "absolute",
            left: `${(hoverPoint.x / VBW) * 100}%`,
            top: `${((hoverPoint.y - 24) / VBH) * 100}%`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            background: "white",
            borderRadius: 8,
            padding: "6px 10px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.10)",
            fontFamily: "var(--font-ui)",
            whiteSpace: "nowrap",
            border: "1px solid rgba(2,7,136,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: "#6c757d",
            }}
          >
            {hoverPoint.raw.x}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#020788",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatY(hoverPoint.raw.y)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
