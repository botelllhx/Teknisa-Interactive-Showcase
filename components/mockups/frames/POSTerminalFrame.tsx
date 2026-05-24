"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface POSTerminalFrameProps {
  children?: ReactNode;
  height: number;
}

// v13.25 — bump screen ratio 0.55 → 0.70 (POS Novo é touch-first, keypad
// fica residual). Cliente reportou que o PDV ficava muito menor que RI:
// só 55% do canonical era tela, o resto era keypad/base, então a área
// útil do mockup ficava 2.4× menor que RI. Com 0.70, a tela cresce ~60%.
// Numeric keypad removido — substituído por strip de status + card reader
// bay + 2 botoes hardware (CANCELAR/CONFIRMAR), look moderno.
const SCREEN_RATIO = 0.70;

// Canon light-grey gradient (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

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

      {/* Bottom hardware strip — modern touch-first POS:
           status row + card reader bay + CANCELAR/CONFIRMAR botoes */}
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
        {/* Status row: LED + label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 4,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 30% 30%, #4ade80, #16a34a 70%)",
                boxShadow: "0 0 6px rgba(22,163,74,0.45)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: "#6b7280",
              }}
            >
              EM USO
            </span>
          </div>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 7.5,
              fontWeight: 600,
              letterSpacing: 0.8,
              color: "#9ca3af",
              textTransform: "uppercase",
            }}
          >
            TEKNISA POS · v4
          </span>
        </div>

        {/* Card reader bay */}
        <div
          aria-hidden
          style={{
            background:
              "linear-gradient(180deg, #c5c9d2 0%, #b6bac4 100%)",
            borderRadius: 6,
            height: 14,
            position: "relative",
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.20), inset 0 -1px 0 rgba(255,255,255,0.30)",
            display: "flex",
            alignItems: "center",
            paddingInline: 10,
          }}
        >
          <span
            style={{
              width: "100%",
              height: 1.5,
              borderRadius: 1,
              background: "rgba(0,0,0,0.18)",
            }}
          />
        </div>

        {/* CANCELAR / CONFIRMAR botoes hardware */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            style={{
              background:
                "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
              borderRadius: 10,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.6,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(220,38,38,0.30), 0 1px 3px rgba(0,0,0,0.15)",
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
              borderRadius: 10,
              border: "none",
              color: "white",
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.6,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 6px rgba(22,163,74,0.30), 0 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </motion.div>
  );
}
