"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface DesktopFrameProps {
  children?: ReactNode;
  width: number;
  url?: string;
}

const ASPECT_INVERSE = 10 / 16;

// Canon light-grey gradient for all hardware (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

export function DesktopFrame({
  children,
  width,
  url = "teknisa.com.br/app",
}: DesktopFrameProps) {
  const screenHeight = width * ASPECT_INVERSE;

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Monitor body */}
      <div
        style={{
          width,
          background: HARDWARE_GRADIENT,
          borderRadius: "18px 18px 6px 6px",
          padding: "16px 16px 14px",
          boxShadow: [
            "0 0 0 1px rgba(0,0,0,0.06)",
            "0 36px 88px rgba(0,0,0,0.16)",
            "0 12px 28px rgba(0,0,0,0.08)",
            "inset 0 1px 0 rgba(255,255,255,0.72)",
            "inset 0 -1px 0 rgba(0,0,0,0.04)",
          ].join(", "),
          position: "relative",
        }}
      >
        {/* Camera dot */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #a4a8b3 0%, #80848e 70%, #5e6168 100%)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)",
          }}
        />
        {/* Subtle ambient sensor line next to camera */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 9,
            left: "calc(50% + 14px)",
            width: 18,
            height: 2,
            borderRadius: 1,
            background: "rgba(0,0,0,0.06)",
          }}
        />

        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: screenHeight,
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            boxShadow:
              "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              height: 34,
              background:
                "linear-gradient(180deg, #f8f9fb 0%, #f1f3f6 100%)",
              borderBottom: "1px solid #e6e8ec",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <span style={dotStyle("#ff5f57")} />
              <span style={dotStyle("#febc2e")} />
              <span style={dotStyle("#28c840")} />
            </div>
            <div
              style={{
                flex: 1,
                height: 20,
                background: "#fff",
                border: "1px solid #e6e8ec",
                borderRadius: 6,
                marginLeft: 8,
                display: "flex",
                alignItems: "center",
                paddingLeft: 10,
                fontSize: 11,
                fontFamily: "var(--font-ui)",
                color: "#6c757d",
                boxShadow: "inset 0 1px 0 rgba(0,0,0,0.02)",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  marginRight: 6,
                  borderRadius: "50%",
                  background: "#16a34a",
                  boxShadow: "0 0 0 2px rgba(22,163,74,0.15)",
                }}
              />
              {url}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {children}
          </div>
        </div>
      </div>

      {/* Neck */}
      <div
        aria-hidden
        style={{
          width: 52,
          height: 30,
          background:
            "linear-gradient(180deg, #d4d7de 0%, #c8cbd2 60%, #bdc0c7 100%)",
          clipPath: "polygon(28% 0%, 72% 0%, 82% 100%, 18% 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      />

      {/* Base */}
      <div
        aria-hidden
        style={{
          width: 240,
          height: 12,
          background:
            "radial-gradient(ellipse at center, #d8dbe2 0%, #c4c7ce 100%)",
          borderRadius: 999,
          boxShadow:
            "0 3px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      />
    </motion.div>
  );
}

function dotStyle(color: string): React.CSSProperties {
  return {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.12)",
  };
}
