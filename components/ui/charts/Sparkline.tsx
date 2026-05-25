"use client";

import { motion } from "framer-motion";
import { useMemo, useId } from "react";
import { bezierPath, polylinePath } from "@/lib/svg";

interface SparklineProps {
  /** Series of numeric values. Index becomes x-position. */
  data: number[];
  color?: string;
  /** Width in px (height auto from aspectRatio). */
  width?: number;
  height?: number;
  /** Show subtle gradient fill below the line. */
  fill?: boolean;
  /** Show dot at the last point. */
  showLastDot?: boolean;
  /** Smooth bezier curve. */
  smooth?: boolean;
  className?: string;
}

/**
 * v13.6 — mini-chart inline para KPI tiles. Estilo Linear/Notion:
 * 60×20px típico, linha 1.4px, gradient soft opcional, dot no último
 * ponto. Sem grid, sem labels, sem nada — só a essência da tendência.
 *
 * Uso típico:
 *   <Sparkline data={[12,15,14,18,22,21,26,29]} color="#020788" />
 */
export function Sparkline({
  data,
  color = "#020788",
  width = 80,
  height = 24,
  fill = true,
  showLastDot = true,
  smooth = true,
  className,
}: SparklineProps) {
  const uid = useId().replace(/:/g, "");
  const PAD = 2;

  const { points, line, area } = useMemo(() => {
    if (data.length === 0) return { points: [], line: "", area: "" };
    const yMin = Math.min(...data);
    const yMax = Math.max(...data);
    const flat = yMax - yMin <= 0;
    const span = flat ? 1 : yMax - yMin;
    const innerW = width - PAD * 2;
    const innerH = height - PAD * 2;
    // When all values are equal the chart collapses to a flat midline
    // instead of NaN-producing math.
    const points = data.map((v, i) => ({
      x: PAD + (i / Math.max(1, data.length - 1)) * innerW,
      y: flat ? PAD + innerH / 2 : PAD + innerH - ((v - yMin) / span) * innerH,
    }));
    const line = smooth ? bezierPath(points) : polylinePath(points);
    const area =
      points.length > 0
        ? line +
          ` L ${points[points.length - 1].x} ${height - PAD} L ${points[0].x} ${height - PAD} Z`
        : "";
    return { points, line, area };
  }, [data, width, height, smooth]);

  if (points.length === 0) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: "block", overflow: "hidden" }}
    >
      <defs>
        <linearGradient id={`spark-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="80%" stopColor={color} stopOpacity="0.04" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <motion.path
          d={area}
          fill={`url(#spark-${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      )}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      {showLastDot && (
        <>
          <motion.circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}
            fill={color}
            opacity={0.18}
            animate={{ r: [2.4, 4, 2.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={1.6}
            fill={color}
          />
        </>
      )}
    </svg>
  );
}

