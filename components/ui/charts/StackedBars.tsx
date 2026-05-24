"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface StackedBar {
  label: string;
  /** Per-segment value array (matches segments order). */
  values: number[];
}

interface StackedBarsProps {
  bars: StackedBar[];
  /** Names + colors of the stacked segments (legend). */
  segments: { label: string; color: string }[];
  /** Show legend chips above the chart. */
  showLegend?: boolean;
  /** Show value labels on top of each bar. */
  showTotal?: boolean;
  /** Format the total value. */
  formatTotal?: (v: number) => string;
  /** Approximate height in px. */
  height?: number;
  className?: string;
}

/**
 * v13.6 — barras verticais empilhadas estilo Poseidon. Cada barra
 * representa um período/categoria; cada segmento dentro é colorido
 * e ganha gradient (top mais escuro, bottom mais claro) + topo arredondado
 * só no segmento mais alto. Hover destaca a barra inteira e mostra
 * breakdown completo em tooltip.
 *
 * Ideal para "Distribuição por categoria" (vendas por departamento por
 * mês, sobras por tipo por semana, etc).
 */
export function StackedBars({
  bars,
  segments,
  showLegend = true,
  showTotal = true,
  formatTotal = (v) => v.toLocaleString("pt-BR"),
  height = 180,
  className,
}: StackedBarsProps) {
  const [hover, setHover] = useState<number | null>(null);

  const totals = bars.map((b) => b.values.reduce((s, x) => s + x, 0));
  const maxTotal = Math.max(...totals, 1);

  return (
    <div className={className} style={{ width: "100%" }}>
      {showLegend && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {segments.map((s) => (
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
                  width: 9,
                  height: 9,
                  borderRadius: 2,
                  background: s.color,
                  flex: "none",
                  boxShadow: `0 0 0 3px ${s.color}1a`,
                }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          position: "relative",
          display: "flex",
          gap: 8,
          height,
          alignItems: "flex-end",
        }}
      >
        {bars.map((bar, bIdx) => {
          const total = totals[bIdx];
          const heightPct = (total / maxTotal) * 100;
          const isHover = hover === bIdx;
          const isDimmed = hover !== null && !isHover;

          return (
            <div
              key={bar.label}
              onPointerEnter={() => setHover(bIdx)}
              onPointerLeave={() => setHover(null)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 6,
                cursor: "pointer",
                opacity: isDimmed ? 0.55 : 1,
                transition: "opacity 200ms ease",
                position: "relative",
              }}
            >
              {showTotal && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + 0.04 * bIdx, duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: isHover ? "#020788" : "#495057",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.01em",
                    transition: "color 200ms ease",
                  }}
                >
                  {formatTotal(total)}
                </motion.span>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{
                  delay: 0.05 * bIdx,
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: isHover
                    ? "0 6px 14px rgba(2,7,136,0.18)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                  transition: "box-shadow 200ms ease",
                }}
              >
                {bar.values.map((v, sIdx) => {
                  if (total === 0) return null;
                  const segPct = (v / total) * 100;
                  const seg = segments[sIdx];
                  const isTopSegment =
                    sIdx === bar.values.length - 1 ||
                    bar.values.slice(sIdx + 1).every((x) => x === 0);
                  const colorLight = lighten(seg.color, 0.15);
                  return (
                    <motion.div
                      key={`${bar.label}-${sIdx}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        delay: 0.3 + 0.05 * bIdx + 0.04 * sIdx,
                        duration: 0.3,
                      }}
                      style={{
                        height: `${segPct}%`,
                        background: `linear-gradient(180deg, ${colorLight} 0%, ${seg.color} 100%)`,
                        borderTopLeftRadius: isTopSegment ? 6 : 0,
                        borderTopRightRadius: isTopSegment ? 6 : 0,
                        position: "relative",
                      }}
                    >
                      {/* Top inner highlight */}
                      {isTopSegment && (
                        <span
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: "0 0 60% 0",
                            background:
                              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 9.5,
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: "0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {bar.label}
              </span>

              {/* Tooltip on hover — dark Linear style, breakdown by segment */}
              {isHover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.14 }}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translate(-50%, -8px)",
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
                    zIndex: 2,
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
                    }}
                  >
                    {bar.label} ·{" "}
                    <span style={{ color: "white" }}>
                      {formatTotal(total)}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {bar.values.map((v, sIdx) => (
                      <div
                        key={sIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 10.5,
                          fontWeight: 600,
                          fontVariantNumeric: "tabular-nums",
                          letterSpacing: "-0.005em",
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 2,
                            background: segments[sIdx].color,
                            flex: "none",
                          }}
                        />
                        <span
                          style={{ color: "rgba(255,255,255,0.70)", flex: 1 }}
                        >
                          {segments[sIdx].label}
                        </span>
                        <span style={{ color: "white", fontWeight: 700 }}>
                          {formatTotal(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function lighten(color: string, amount: number): string {
  if (!color.startsWith("#")) return color;
  const hex = color.replace("#", "");
  const num = parseInt(
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex,
    16,
  );
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const mix = (v: number) =>
    Math.round(v + (255 - v) * Math.min(1, Math.max(0, amount)));
  const rr = mix(r).toString(16).padStart(2, "0");
  const gg = mix(g).toString(16).padStart(2, "0");
  const bb = mix(b).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`;
}
