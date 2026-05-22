"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface TabletFrameProps {
  children?: ReactNode;
  height: number;
  orientation?: "portrait" | "landscape";
}

// Canon light-grey gradient for all hardware (CLAUDE §21.5)
const HARDWARE_GRADIENT =
  "linear-gradient(160deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

export function TabletFrame({
  children,
  height,
  orientation = "portrait",
}: TabletFrameProps) {
  const ratio = orientation === "portrait" ? 3 / 4 : 4 / 3;
  const width = height * ratio;

  const cameraPosition =
    orientation === "portrait"
      ? {
          top: 7,
          left: "50%",
          transform: "translateX(-50%)",
        }
      : {
          left: 7,
          top: "50%",
          transform: "translateY(-50%)",
        };

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: HARDWARE_GRADIENT,
        borderRadius: 26,
        padding: 16,
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.08)",
          "0 36px 88px rgba(0,0,0,0.14)",
          "0 10px 28px rgba(0,0,0,0.07)",
          "inset 0 1.5px 0 rgba(255,255,255,0.7)",
          "inset 0 -1px 0 rgba(0,0,0,0.04)",
        ].join(", "),
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Power button on top-right edge */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: 60,
          top: -2,
          width: 36,
          height: 4,
          background: "linear-gradient(180deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "2px 2px 0 0",
          boxShadow:
            "inset 0 -1px 2px rgba(0,0,0,0.12), 0 -1px 2px rgba(0,0,0,0.06)",
        }}
      />
      {/* Volume buttons on right edge */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -2,
          top: 70,
          width: 4,
          height: 64,
          background: "linear-gradient(270deg, #b8bcc6 0%, #c8cbd2 100%)",
          borderRadius: "2px 0 0 2px",
          boxShadow:
            "inset 1px 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      />

      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Camera */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            ...cameraPosition,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #a4a8b3 0%, #80848e 70%, #5e6168 100%)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25)",
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
