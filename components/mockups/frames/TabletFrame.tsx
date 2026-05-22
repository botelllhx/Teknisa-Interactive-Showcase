"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface TabletFrameProps {
  children?: ReactNode;
  height: number;
  orientation?: "portrait" | "landscape";
}

export function TabletFrame({
  children,
  height,
  orientation = "portrait",
}: TabletFrameProps) {
  const ratio = orientation === "portrait" ? 3 / 4 : 4 / 3;
  const width = height * ratio;

  return (
    <motion.div data-tour-frame="true" initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #e8eaed 0%, #dde0e5 100%)",
        borderRadius: 24,
        padding: 14,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -2,
          top: 80,
          width: 3,
          height: 60,
          background: "#cdd0d8",
          borderRadius: "2px 0 0 2px",
        }}
      />
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          position: "relative",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            ...(orientation === "portrait"
              ? { top: 6, left: "50%", transform: "translateX(-50%)" }
              : { left: 6, top: "50%", transform: "translateY(-50%)" }),
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#c0c4ce",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}
