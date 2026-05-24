"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useId } from "react";

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
  /** Show Y-axis labels (3 ticks on the left). */
  showYLabels?: boolean;
  /** Show last value as a halo dot. */
  highlightLast?: boolean;
  /** Optional reference (target) line value. */
  referenceY?: number;
  referenceLabel?: string;
  /** Optional override for min/max — useful to make small deltas visible. */
  yMin?: number;
  yMax?: number;
  /** Aspect of the chart viewBox. Ignored when `fillContainer` is true. */
  aspectRatio?: string;
  /**
   * When true, the chart fills its parent's width AND height instead of
   * being driven by `aspectRatio`. Use this when the chart sits inside a
   * `flex-1` row whose height is set by the surrounding layout.
   */
  fillContainer?: boolean;
  className?: string;
  /** Format the tooltip Y. */
  formatY?: (v: number) => string;
  /** Show x-axis labels. */
  showXLabels?: boolean;
  /** Smooth bezier curves between points. Default true (Linear/Sypher feel). */
  smooth?: boolean;
}

/**
 * v13.5 — refino profundo nível Linear/Sypher.
 *
 * Mudanças vs v13.4:
 * - Curva bezier suave entre pontos (smooth: true por padrão). Linhas
 *   poligonais ficaram para gráficos de barra discreta; aqui o feel é
 *   o de um gráfico de produto SaaS.
 * - Gradient fill 5 stops (era 3) com fade mais elegante na base
 * - Grid horizontal MUITO mais sutil (rgba 0.05 em vez de #e5e7eb)
 * - Y-axis ticks opcional (showYLabels) — 3 valores na esquerda em
 *   tabular-nums, cinza 50%
 * - Tooltip card Linear-style: dark navy bg, white text, delta vs
 *   ponto anterior (verde/vermelho), elevação refinada
 * - Halo 3-ring no ponto destacado em vez de 2
 * - Animação: linha desenha primeiro (1.1s), depois area fade-in (0.5s)
 * - Tipografia label: -0.01em letter-spacing em valores
 */
export function AreaChart({
  data,
  color = "#020788",
  grid = true,
  showYLabels = false,
  highlightLast = true,
  referenceY,
  referenceLabel,
  yMin: yMinOverride,
  yMax: yMaxOverride,
  aspectRatio = "16/7",
  fillContainer = false,
  className,
  formatY = (v) => v.toString(),
  showXLabels = true,
  smooth = true,
}: AreaChartProps) {
  const VBW = 400;
  const VBH = 160;
  const PAD_L = showYLabels ? 28 : 6;
  const PAD_R = 8;
  const PAD_T = 18;
  const PAD_B = showXLabels ? 24 : 8;

  const uid = useId().replace(/:/g, "");
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
  }, [data, referenceY, yMinOverride, yMaxOverride, PAD_L, PAD_B]);

  if (points.length === 0) return null;

  // Smooth bezier path generation (Catmull-Rom-like) — gives the Sypher
  // line feel without going full curve insanity.
  const linePath = smooth
    ? bezierPath(points.map((p) => ({ x: p.x, y: p.y })))
    : points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${VBH - PAD_B} L ${points[0].x} ${VBH - PAD_B} Z`;

  const refY = referenceY != null
    ? PAD_T + (VBH - PAD_T - PAD_B) - ((referenceY - yMin) / Math.max(0.001, yMax - yMin)) * (VBH - PAD_T - PAD_B)
    : null;

  const gridLines = grid ? [0, 0.25, 0.5, 0.75, 1] : [];
  const yTicks = showYLabels ? [0, 0.5, 1] : [];

  const hoverPoint = hover != null ? points[hover] : null;
  const hoverDelta = hover != null && hover > 0
    ? points[hover].raw.y - points[hover - 1].raw.y
    : null;

  return (
    <div
      className={className}
      style={
        fillContainer
          ? { width: "100%", height: "100%", position: "relative" }
          : { width: "100%", position: "relative", aspectRatio }
      }
    >
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "hidden",
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          {/* Linear-style 5-stop gradient — more depth than 3 stops */}
          <linearGradient id={`area-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="30%" stopColor={color} stopOpacity="0.18" />
            <stop offset="60%" stopColor={color} stopOpacity="0.06" />
            <stop offset="90%" stopColor={color} stopOpacity="0.01" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid — Linear ultra-subtle */}
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

        {/* Y-axis tick labels (left side) */}
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

        {/* Reference line */}
        {refY != null && (
          <>
            <line
              x1={PAD_L}
              x2={VBW - PAD_R}
              y1={refY}
              y2={refY}
              stroke="#16a34a"
              strokeWidth={0.6}
              strokeDasharray="3 2"
              opacity={0.7}
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
                style={{ letterSpacing: "0.02em" }}
              >
                {referenceLabel}
              </text>
            )}
          </>
        )}

        {/* Area fill — comes in AFTER the line draws */}
        <motion.path
          d={areaPath}
          fill={`url(#area-fill-${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />

        {/* Line — Sypher-thin elegant curve */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Hover crosshair */}
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
              opacity={0.5}
            />
            {/* Crosshair dot — outer halo + inner */}
            <circle
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r={6}
              fill={color}
              opacity={0.12}
            />
            <circle
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r={3.5}
              fill="white"
              stroke={color}
              strokeWidth={1.6}
            />
          </g>
        )}

        {/* Last-point halo — 3 concentric rings (Linear feel) */}
        {highlightLast && !hoverPoint && (
          <g>
            <motion.circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={8}
              fill={color}
              opacity={0.08}
              animate={{ r: [6, 10, 6], opacity: [0.06, 0.14, 0.06] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={5}
              fill={color}
              opacity={0.18}
              animate={{ r: [4, 6, 4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
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
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {String(p.raw.x)}
              </text>
            );
          })}
      </svg>

      {/* Linear-style dark tooltip card — bg navy, white text */}
      {hoverPoint && (
        <motion.div
          initial={{ opacity: 0, y: 2, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: `${(hoverPoint.x / VBW) * 100}%`,
            top: `${((hoverPoint.y - 18) / VBH) * 100}%`,
            transform: "translate(-50%, -100%)",
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
          }}
        >
          <div
            style={{
              fontSize: 8.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.55)",
              marginBottom: 3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {hoverPoint.raw.x}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "white",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.015em",
              }}
            >
              {formatY(hoverPoint.raw.y)}
            </span>
            {hoverDelta != null && hoverDelta !== 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: hoverDelta > 0 ? "#4ade80" : "#fca5a5",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {hoverDelta > 0 ? "+" : ""}
                {formatY(Math.abs(hoverDelta))}
              </span>
            )}
          </div>
          {/* Arrow caret pointing down to the data point */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              bottom: -5,
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid rgba(15,18,42,0.96)",
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * Catmull-Rom-style smooth path. Tension 0.5 = balanced curve.
 * Outputs an SVG d-attribute string.
 */
function bezierPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2)
    return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  const tension = 0.18; // 0 = polylines, 1 = very curvy. 0.18 = Sypher feel.
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
