"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface KioskFrameProps {
  children?: ReactNode;
  height: number;
}

const ASPECT = 9 / 16;

export function KioskFrame({ children, height }: KioskFrameProps) {
  const width = height * ASPECT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background:
          "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)",
        borderRadius: 28,
        padding: "20px 16px 16px",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.06), 0 40px 100px rgba(0,0,0,0.18), 0 12px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top bezel: sensor + camera */}
      <div
        aria-hidden
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          height: 16,
          marginBottom: 10,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 28,
            height: 4,
            borderRadius: 2,
            background: "#b8bcc6",
          }}
        />
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#b0b5bf",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Screen area (children fill this) */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        {children}
      </div>

      {/* Bottom bezel: printer slot + card reader slot */}
      <div
        aria-hidden
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          paddingTop: 14,
          flexShrink: 0,
        }}
      >
        <span
          title="Slot de impressão"
          style={{
            width: "55%",
            height: 5,
            borderRadius: 3,
            background: "#c0c4ce",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
        <span
          title="Leitor de cartão"
          style={{
            width: "30%",
            height: 7,
            borderRadius: 4,
            background: "#b0b5bf",
            border: "1px solid #a4a8b3",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </motion.div>
  );
}
