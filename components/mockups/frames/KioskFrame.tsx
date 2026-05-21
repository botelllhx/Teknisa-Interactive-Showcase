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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #e8eaed 0%, #dde0e5 100%)",
        borderRadius: 24,
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.08), 0 40px 100px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 36,
          background: "#020788",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          TEKNISA
        </span>
      </div>

      <div
        style={{
          height: 18,
          background: "#d4d7de",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#b0b5bf",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
        <span
          style={{
            width: 32,
            height: 4,
            borderRadius: 2,
            background: "#b8bcc6",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          background: "#fff",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>

      <div
        style={{
          height: 22,
          background: "#d4d7de",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "60%",
            height: 4,
            borderRadius: 2,
            background: "#c0c4ce",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      <div
        style={{
          height: 28,
          background: "#cdd0d8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: "40%",
            height: 6,
            borderRadius: 3,
            background: "#b8bcc8",
            border: "1px solid #adb2bc",
          }}
        />
      </div>

      <div
        style={{
          height: 40,
          background: "linear-gradient(180deg, #d4d7de 0%, #c8cbd4 100%)",
          flexShrink: 0,
        }}
      />
    </motion.div>
  );
}
