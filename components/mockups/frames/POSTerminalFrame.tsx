"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface POSTerminalFrameProps {
  children?: ReactNode;
  height: number;
}

// The terminal is taller than its display screen because of the keypad below.
// We allocate ~55% of height to the screen (16:10 aspect) and the rest to the
// keypad + base.
const SCREEN_RATIO = 0.55;

// Canon light-grey gradient (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

const KEYPAD: { label: string; sub?: string }[] = [
  { label: "1", sub: "" },
  { label: "2", sub: "ABC" },
  { label: "3", sub: "DEF" },
  { label: "4", sub: "GHI" },
  { label: "5", sub: "JKL" },
  { label: "6", sub: "MNO" },
  { label: "7", sub: "PQRS" },
  { label: "8", sub: "TUV" },
  { label: "9", sub: "WXYZ" },
  { label: "*" },
  { label: "0" },
  { label: "#" },
];

export function POSTerminalFrame({ children, height }: POSTerminalFrameProps) {
  const screenHeight = height * SCREEN_RATIO;
  const width = (screenHeight * 16) / 10 + 28; // 28px padding from the body

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: HARDWARE_GRADIENT,
        borderRadius: 22,
        padding: 14,
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.07)",
          "0 36px 88px rgba(0,0,0,0.14)",
          "0 10px 28px rgba(0,0,0,0.07)",
          "inset 0 1.5px 0 rgba(255,255,255,0.7)",
          "inset 0 -1px 0 rgba(0,0,0,0.04)",
        ].join(", "),
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
      }}
    >
      {/* Top sensor strip */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 6,
          marginBottom: -4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 20,
            height: 3,
            borderRadius: 2,
            background: "rgba(0,0,0,0.10)",
          }}
        />
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #a4a8b3 0%, #80848e 70%, #5e6168 100%)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)",
          }}
        />
      </div>

      {/* Display bezel */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #cdd1d9 0%, #c0c4cc 100%)",
          borderRadius: 14,
          padding: 4,
          flexShrink: 0,
          boxShadow:
            "inset 0 1px 2px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            overflow: "hidden",
            position: "relative",
            height: screenHeight - 8,
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,0.05), inset 0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          {children}
        </div>
      </div>

      {/* Keypad area */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(180deg, #e3e6ea 0%, #d8dbe2 100%)",
          borderRadius: 14,
          padding: 10,
          boxShadow:
            "inset 0 1px 2px rgba(0,0,0,0.05), inset 0 -1px 0 rgba(255,255,255,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
            flex: 1,
          }}
        >
          {KEYPAD.map((k) => (
            <button
              key={k.label}
              type="button"
              tabIndex={-1}
              aria-hidden
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #f1f3f6 100%)",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.04)",
                fontFamily: "var(--font-display)",
                color: "#495057",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.08), 0 -1px 0 rgba(0,0,0,0.04) inset",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1.05,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700 }}>{k.label}</span>
              {k.sub && (
                <span
                  style={{
                    fontSize: 6,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    color: "#8a909c",
                    marginTop: 1,
                  }}
                >
                  {k.sub}
                </span>
              )}
            </button>
          ))}
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            CANCELAR
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            CONFIRMAR
          </button>
        </div>
      </div>

      {/* Bottom magstripe/card slot decorative */}
      <div
        aria-hidden
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginTop: -4,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "55%",
            height: 3,
            borderRadius: 2,
            background: "rgba(0,0,0,0.08)",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.10)",
          }}
        />
      </div>
    </motion.div>
  );
}
