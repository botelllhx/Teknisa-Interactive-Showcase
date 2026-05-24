"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface LineSeries {
  label: string;
  color: string;
  data: number[];
  /** Optional dashed style. */
  dashed?: boolean;
}

interface LineChartProps {
  /** Series. Index of each value maps to xLabels[i]. */
  series: LineSeries[];
  xLabels: (string | number)[];
  aspectRatio?: string;
  yMin?: number;
  yMax?: number;
  formatY?: (v: number) => string;
  /** Show Y-axis labels (3 ticks left). */
  showYLabels?: boolean;
  /** Show X labels at bottom. */
  showXLabels?: boolean;
  /** Smooth bezier curves. */
  smooth?: boolean;
  /** Show legend chips above the chart. */
  showLegend?: boolean;
  className?: string;
}

/**
 * v13.6 — LineChart Sypher-style: linha PURA, sem area fill, multi-séries
 * com tooltip vertical compartilhado, crosshair, halo no último ponto
 * de cada série, animação stagger entre séries.
 *
 * Diferente do AreaChart porque comunica COMPARAÇÃO entre séries
 * (vs CMV histórico de 2 lojas, vs vendas previstas vs reais, etc).
 * AreaChart é melhor pra UMA série dominante; LineChart pra 2+.
 */
export function LineChart({
  series,
  xLabels,
  aspectRatio = "16/7",
  yMin: yMinOverride,
  yMax: yMaxOverride,
  formatY = (v) => v.toString(),
  showYLabels = false,
  showXLabels = true,
  smooth = true,
  showLegend = true,
  className,
}: LineChartProps) {
  const VBW = 400;
  const VBH = 160;
  const PAD_L = showYLabels ? 30 : 6;
  const PAD_R = 8;
  const PAD_T = 18;
  const PAD_B = showXLabels ? 22 : 8;

  const [hover, setHover] = useState<number | null>(null);

  const { seriesPoints, yMin, yMax } = useMemo(() => {
    const allValues = series.flatMap((s) => s.data);
    const yMin = yMinOverride ?? Math.min(...allValues) - 1;
    const yMax = yMaxOverride ?? Math.max(...allValues) + 1;
    const span = Math.max(0.001, yMax - yMin);
    const inner = VBW - PAD_L - PAD_R;
    const innerH = VBH - PAD_T - PAD_B;
    const seriesPoints = series.map((s) =>
      s.data.map((v, i) => ({
        x: PAD_L + (i / Math.max(1, s.data.length - 1)) * inner,
        y: PAD_T + innerH - ((v - yMin) / span) * innerH,
        v,
      })),
    );
    return { seriesPoints, yMin, yMax };
  }, [series, yMinOverride, yMaxOverride, PAD_L, PAD_B]);

  if (seriesPoints.length === 0 || seriesPoints[0].length === 0) return null;

  const xCount = seriesPoints[0].length;
  const xPositions = seriesPoints[0].map((p) => p.x);

  const yTicks = showYLabels ? [0, 0.5, 1] : [];
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div
      className={className}
      style={{ width: "100%", position: "relative", aspectRatio }}
    >
      {showLegend && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 8,
            flexWrap: "wrap",
          }}
        >
          {series.map((s) => (
            <span
              key={s.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 600,
                color: "#495057",
                letterSpacing: "-0.005em",
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 2.5,
                  background: s.color,
                  borderRadius: 2,
                  boxShadow: `0 0 0 3px ${s.color}1a`,
                  ...(s.dashed && {
                    background: `repeating-linear-gradient(90deg, ${s.color} 0 3px, transparent 3px 6px)`,
                  }),
                }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: showLegend ? "calc(100% - 24px)" : "100%",
          display: "block",
        }}
        onPointerLeave={() => setHover(null)}
      >
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
              stroke="rgba(0,0,0,0.05)"
              strokeWidth={0.4}
            />
          );
        })}

        {/* Y-axis ticks */}
        {yTicks.map((t, i) => {
          const y = PAD_T + (VBH - PAD_T - PAD_B) * t;
          const value = yMax - (yMax - yMin) * t;
          return (
            <text
              key={`yt-${i}`}
              x={PAD_L - 4}
              y={y + 2}
              fontFamily="var(--font-ui)"
              fontSize="7"
              fontWeight="600"
              fill="#9ca3af"
              textAnchor="end"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatY(value)}
            </text>
          );
        })}

        {/* Lines */}
        {seriesPoints.map((pts, sIdx) => {
          const linePath = smooth
            ? bezierPath(pts.map((p) => ({ x: p.x, y: p.y })))
            : polylinePath(pts.map((p) => ({ x: p.x, y: p.y })));
          const s = series[sIdx];
          return (
            <motion.path
              key={s.label}
              d={linePath}
              fill="none"
              stroke={s.color}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={s.dashed ? "4 3" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.1,
                delay: 0.08 * sIdx,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* Hit areas */}
        {xPositions.map((x, i) => (
          <rect
            key={i}
            x={x - (VBW / xCount) / 2}
            y={PAD_T}
            width={VBW / xCount}
            height={VBH - PAD_T - PAD_B}
            fill="transparent"
            onPointerEnter={() => setHover(i)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Hover crosshair */}
        {hover != null && (
          <g>
            <line
              x1={xPositions[hover]}
              x2={xPositions[hover]}
              y1={PAD_T}
              y2={VBH - PAD_B}
              stroke="#6b7280"
              strokeWidth={0.6}
              strokeDasharray="2 2"
              opacity={0.45}
            />
            {seriesPoints.map((pts, sIdx) => (
              <g key={sIdx}>
                <circle
                  cx={pts[hover].x}
                  cy={pts[hover].y}
                  r={5}
                  fill={series[sIdx].color}
                  opacity={0.14}
                />
                <circle
                  cx={pts[hover].x}
                  cy={pts[hover].y}
                  r={3}
                  fill="white"
                  stroke={series[sIdx].color}
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </g>
        )}

        {/* Last-point halos (one per series) when no hover */}
        {hover == null &&
          seriesPoints.map((pts, sIdx) => {
            const last = pts[pts.length - 1];
            return (
              <g key={`halo-${sIdx}`}>
                <motion.circle
                  cx={last.x}
                  cy={last.y}
                  r={5}
                  fill={series[sIdx].color}
                  opacity={0.12}
                  animate={{ r: [3.5, 6, 3.5], opacity: [0.08, 0.16, 0.08] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: sIdx * 0.2,
                  }}
                />
                <circle
                  cx={last.x}
                  cy={last.y}
                  r={2}
                  fill={series[sIdx].color}
                />
              </g>
            );
          })}

        {/* X labels */}
        {showXLabels &&
          xPositions.map((x, i) => {
            const showEvery = Math.max(1, Math.floor(xCount / 7));
            if (i % showEvery !== 0 && i !== xCount - 1) return null;
            return (
              <text
                key={`xl-${i}`}
                x={x}
                y={VBH - 4}
                fontFamily="var(--font-ui)"
                fontSize="8"
                fontWeight="500"
                fill="#9ca3af"
                textAnchor="middle"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(xLabels[i] ?? "")}
              </text>
            );
          })}
      </svg>

      {/* Tooltip — shows ALL series values for the hovered x */}
      {hover != null && (
        <motion.div
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "absolute",
            left: `${(xPositions[hover] / VBW) * 100}%`,
            top: showLegend ? 28 : 4,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            background: "rgba(15,18,42,0.96)",
            color: "white",
            borderRadius: 8,
            padding: "8px 11px",
            boxShadow:
              "0 8px 24px rgba(2,7,136,0.18), 0 2px 6px rgba(0,0,0,0.14)",
            fontFamily: "var(--font-ui)",
            whiteSpace: "nowrap",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.55)",
              marginBottom: 5,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(xLabels[hover] ?? "")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {seriesPoints.map((pts, sIdx) => (
              <div
                key={series[sIdx].label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.01em",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: series[sIdx].color,
                    flex: "none",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.70)", flex: 1 }}>
                  {series[sIdx].label}
                </span>
                <span
                  style={{
                    color: "white",
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {formatY(pts[hover].v)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function polylinePath(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

function bezierPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2)
    return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  const tension = 0.18;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}
