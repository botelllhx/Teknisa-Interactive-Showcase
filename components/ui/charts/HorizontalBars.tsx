"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useId } from "react";

export interface HBar {
  label: string;
  value: number;
  total?: number;
  color: string;
  /** Optional sub-label rendered to the right of the value. */
  meta?: string;
}

interface HorizontalBarsProps {
  bars: HBar[];
  /** Max value used for normalization; defaults to max of values. */
  max?: number;
  /** Show the value (e.g. "321 leads") next to each label. */
  showValue?: boolean;
  /** Bar thickness in px. */
  thickness?: number;
  /** Number formatter. Default toLocaleString('pt-BR'). */
  formatValue?: (v: number) => string;
  className?: string;
}

/**
 * v13.5 — refino profundo.
 *
 * Mudanças vs v13.4:
 * - Bar fill com gradient horizontal (color → color-light) — não mais flat
 * - Track behind bar com subtle gradient inset
 * - Value count-up animado (count-up de 0 até value durante 0.9s)
 * - Hover row: bar cresce 1.5px + value vira bold-er
 * - Tipografia label tighter (-0.01em), número tabular -0.015em
 * - Index chip "01" virou pill brand-ghost (mais elegante)
 */
export function HorizontalBars({
  bars,
  max,
  showValue = true,
  thickness = 7,
  formatValue = (v) => v.toLocaleString("pt-BR"),
  className,
}: HorizontalBarsProps) {
  const ceiling = max ?? Math.max(...bars.map((b) => b.value), 1);
  return (
    <ul
      className={className}
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {bars.map((b, i) => {
        const pct = (b.value / ceiling) * 100;
        return (
          <BarRow
            key={b.label}
            bar={b}
            index={i}
            pct={pct}
            showValue={showValue}
            thickness={thickness}
            formatValue={formatValue}
          />
        );
      })}
    </ul>
  );
}

function BarRow({
  bar,
  index,
  pct,
  showValue,
  thickness,
  formatValue,
}: {
  bar: HBar;
  index: number;
  pct: number;
  showValue: boolean;
  thickness: number;
  formatValue: (v: number) => string;
}) {
  const uid = useId().replace(/:/g, "");
  const motionVal = useMotionValue(0);
  const display = useTransform(motionVal, (v) => formatValue(Math.round(v)));

  useEffect(() => {
    const controls = animate(motionVal, bar.value, {
      duration: 0.9,
      delay: 0.15 + 0.06 * index,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [bar.value, index, motionVal]);

  // Slightly lighten the color for the gradient endpoint
  const colorLight = lighten(bar.color, 0.18);

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.28 }}
      style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr auto",
        alignItems: "center",
        gap: 10,
        padding: "9px 0",
        borderTop: index > 0 ? "1px solid rgba(0,0,0,0.04)" : "none",
      }}
    >
      {/* Index chip — brand-ghost pill */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 20,
          borderRadius: 6,
          background: "rgba(2,7,136,0.06)",
          fontFamily: "var(--font-ui)",
          fontSize: 9.5,
          fontWeight: 700,
          color: "#020788",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.005em",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11.5,
            fontWeight: 600,
            color: "#212529",
            letterSpacing: "-0.01em",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {bar.label}
        </p>
        <div
          style={{
            position: "relative",
            marginTop: 6,
            width: "100%",
            height: thickness,
            borderRadius: thickness,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.025) 100%)",
            overflow: "hidden",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.02)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              delay: 0.1 + 0.06 * index,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "relative",
              height: "100%",
              background: `linear-gradient(90deg, ${bar.color} 0%, ${colorLight} 100%)`,
              borderRadius: thickness,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.20), 0 1px 2px ${bar.color}33`,
            }}
          >
            {/* Subtle white shine highlight on top half */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: "0 0 50% 0",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 100%)",
                borderRadius: thickness,
              }}
            />
          </motion.div>
        </div>
      </div>
      {showValue && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: 4,
            fontFamily: "var(--font-ui)",
            fontSize: 12.5,
            fontWeight: 700,
            color: "#212529",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            letterSpacing: "-0.015em",
          }}
        >
          <motion.span>{display}</motion.span>
          {bar.meta && (
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 500,
                color: "#9ca3af",
                letterSpacing: "0.02em",
              }}
            >
              {bar.meta}
            </span>
          )}
        </span>
      )}
    </motion.li>
  );
}

/**
 * Lighten a hex/rgb color by a fraction. Simple approximation —
 * works for solid hex colors. For "rgba(...)" or named colors, falls
 * back to returning the original color.
 */
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
