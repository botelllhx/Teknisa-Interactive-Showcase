"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface MobileFrameProps {
  children?: ReactNode;
  height: number;
}

const ASPECT = 9 / 19.5;

// Canon light-grey gradient for all hardware (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(155deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

export function MobileFrame({ children, height }: MobileFrameProps) {
  const width = height * ASPECT;

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: HARDWARE_GRADIENT,
        borderRadius: 46,
        padding: "14px 11px",
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.10)",
          "0 44px 90px rgba(0,0,0,0.20)",
          "0 12px 32px rgba(0,0,0,0.10)",
          "inset 0 1.5px 0 rgba(255,255,255,0.78)",
          "inset 0 -1px 0 rgba(0,0,0,0.06)",
          "inset 1.5px 0 0 rgba(255,255,255,0.45)",
          "inset -1.5px 0 0 rgba(0,0,0,0.04)",
        ].join(", "),
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Silent switch (left edge) */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 78,
          width: 4,
          height: 24,
          background: "linear-gradient(90deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "0 2px 2px 0",
          boxShadow:
            "inset -1px 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      />
      {/* Volume up */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 118,
          width: 4,
          height: 44,
          background: "linear-gradient(90deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "0 2px 2px 0",
          boxShadow:
            "inset -1px 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      />
      {/* Volume down */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 172,
          width: 4,
          height: 44,
          background: "linear-gradient(90deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "0 2px 2px 0",
          boxShadow:
            "inset -1px 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      />
      {/* Power */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -2,
          top: 116,
          width: 4,
          height: 60,
          background: "linear-gradient(270deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "2px 0 0 2px",
          boxShadow:
            "inset 1px 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      />

      {/* Screen */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 34,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Dynamic island */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 94,
            height: 28,
            background:
              "linear-gradient(180deg, #131418 0%, #1a1a1d 60%, #0f1014 100%)",
            borderRadius: 18,
            zIndex: 10,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 9,
          }}
        >
          {/* Camera punch detail */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #444a55 0%, #1a1d24 70%, #000 100%)",
              boxShadow: "inset 0 0 1px rgba(80,90,110,0.55)",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            paddingTop: 48,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </div>

        {/* Home indicator */}
        <div
          style={{
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 124,
              height: 4,
              borderRadius: 3,
              background: "#1a1a1a",
              opacity: 0.18,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
