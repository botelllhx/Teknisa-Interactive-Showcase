"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface POSTerminalFrameProps {
  children?: ReactNode;
  height: number;
}

// The terminal is taller than its display screen because of the keypad below.
// We allocate 60% of height to the screen (16:10 aspect) and 40% to the keypad.
const SCREEN_RATIO = 0.55;

const KEYPAD = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

export function POSTerminalFrame({ children, height }: POSTerminalFrameProps) {
  const screenHeight = height * SCREEN_RATIO;
  const width = (screenHeight * 16) / 10 + 24; // 24px padding from the body

  return (
    <motion.div data-tour-frame="true" initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #e8eaed 0%, #dde0e5 100%)",
        borderRadius: 20,
        padding: 12,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          background: "#d4d7de",
          borderRadius: 12,
          padding: 3,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
            height: screenHeight - 6,
          }}
        >
          {children}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(180deg, #e8ebef 0%, #dde0e5 100%)",
          borderRadius: 12,
          padding: 8,
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
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
          {KEYPAD.map((label) => (
            <button
              key={label}
              type="button"
              tabIndex={-1}
              aria-hidden
              style={{
                background: "#fff",
                borderRadius: 8,
                border: "none",
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 600,
                color: "#495057",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            style={{
              background: "#dc2626",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            CANCELAR
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            style={{
              background: "#16a34a",
              borderRadius: 8,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 11,
              fontWeight: 700,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </motion.div>
  );
}
