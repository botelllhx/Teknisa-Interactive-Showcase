"use client";

import { motion } from "framer-motion";

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
  className?: string;
}

/**
 * Compact horizontal bar list — reference: AI dashboard "Campaign Performance"
 * with rows per category. Each row: small id chip + label + bar + value.
 */
export function HorizontalBars({
  bars,
  max,
  showValue = true,
  thickness = 6,
  className,
}: HorizontalBarsProps) {
  const ceiling = max ?? Math.max(...bars.map((b) => b.value), 1);
  return (
    <ul className={className} style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {bars.map((b, i) => {
        const pct = (b.value / ceiling) * 100;
        return (
          <motion.li
            key={b.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.28 }}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr auto",
              alignItems: "center",
              gap: 10,
              paddingTop: 8,
              paddingBottom: 8,
              borderTop: i > 0 ? "1px solid rgba(0,0,0,0.04)" : "none",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                fontWeight: 700,
                color: "#9ca3af",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#212529",
                  letterSpacing: "-0.005em",
                  margin: 0,
                }}
              >
                {b.label}
              </p>
              <div
                style={{
                  marginTop: 5,
                  width: "100%",
                  height: thickness,
                  borderRadius: thickness,
                  background: "rgba(0,0,0,0.04)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    delay: 0.1 + 0.06 * i,
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    height: "100%",
                    background: b.color,
                    borderRadius: thickness,
                  }}
                />
              </div>
            </div>
            {showValue && (
              <span
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#212529",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {b.value.toLocaleString("pt-BR")}
                {b.meta && (
                  <span
                    style={{
                      marginLeft: 4,
                      fontSize: 9,
                      fontWeight: 500,
                      color: "#9ca3af",
                    }}
                  >
                    {b.meta}
                  </span>
                )}
              </span>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
