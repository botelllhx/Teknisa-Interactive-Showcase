"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface KioskFrameProps {
  children?: ReactNode;
  height: number;
}

const ASPECT = 9 / 16;

// Canon light-grey gradient (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(180deg, #ebedf1 0%, #dde0e5 55%, #d4d7de 100%)";

export function KioskFrame({ children, height }: KioskFrameProps) {
  const width = height * ASPECT;

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: HARDWARE_GRADIENT,
        borderRadius: 30,
        padding: "18px 16px 18px",
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.06)",
          "0 44px 110px rgba(0,0,0,0.20)",
          "0 16px 36px rgba(0,0,0,0.10)",
          "inset 0 1.5px 0 rgba(255,255,255,0.68)",
          "inset 0 -1.5px 0 rgba(0,0,0,0.05)",
        ].join(", "),
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top: brand stripe + camera/sensor band */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          height: 18,
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        {/* Speaker grille */}
        <span
          style={{
            width: 32,
            height: 4,
            borderRadius: 2,
            background:
              "repeating-linear-gradient(90deg, #b0b5bf 0 1.5px, transparent 1.5px 3px)",
            opacity: 0.55,
          }}
        />
        {/* Camera lens */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #a4a8b3 0%, #6e7280 70%, #43474f 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.30), 0 0 0 2px rgba(0,0,0,0.04)",
          }}
        />
        {/* Status LED */}
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#16a34a",
            boxShadow: "0 0 4px rgba(22,163,74,0.65)",
          }}
        />
      </div>

      {/* Screen area */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 3px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>

      {/* Bottom panel: printer slot + card reader + NFC dot */}
      <div
        aria-hidden
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          paddingTop: 14,
          flexShrink: 0,
        }}
      >
        {/* Printer slot — thin recessed line */}
        <div
          style={{
            width: "62%",
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: 7,
              borderRadius: 4,
              background:
                "linear-gradient(180deg, #b0b5bf 0%, #9ea4b0 100%)",
              boxShadow:
                "inset 0 1px 2px rgba(0,0,0,0.30), inset 0 -1px 0 rgba(255,255,255,0.20)",
            }}
          />
          {/* Tiny paper edge highlight */}
          <span
            style={{
              position: "absolute",
              left: "12%",
              right: "12%",
              top: 2,
              height: 1,
              background: "rgba(255,255,255,0.45)",
              borderRadius: 1,
            }}
          />
        </div>

        {/* Reader + NFC row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            width: "100%",
          }}
        >
          {/* NFC contactless dot */}
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background:
                "linear-gradient(180deg, #c8ccd5 0%, #b8bcc6 100%)",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -1px 1px rgba(0,0,0,0.10)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#020788",
                opacity: 0.55,
              }}
            />
          </span>
          {/* Card insert slot */}
          <span
            style={{
              width: "32%",
              height: 9,
              borderRadius: 5,
              background:
                "linear-gradient(180deg, #9ea4b0 0%, #8a909c 100%)",
              border: "1px solid #80848e",
              boxShadow:
                "inset 0 1px 2px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.45)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
