"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface MobileFrameProps {
  children?: ReactNode;
  height: number;
}

const ASPECT = 9 / 19.5;

export function MobileFrame({ children, height }: MobileFrameProps) {
  const width = height * ASPECT;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #eaecf0 0%, #e2e5ea 100%)",
        borderRadius: 44,
        padding: "14px 10px",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.10), 0 40px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 80,
          width: 3,
          height: 22,
          background: "#cdd0d8",
          borderRadius: "0 2px 2px 0",
          boxShadow: "inset -1px 0 2px rgba(0,0,0,0.1)",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 116,
          width: 3,
          height: 40,
          background: "#cdd0d8",
          borderRadius: "0 2px 2px 0",
          boxShadow: "inset -1px 0 2px rgba(0,0,0,0.1)",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          top: 168,
          width: 3,
          height: 40,
          background: "#cdd0d8",
          borderRadius: "0 2px 2px 0",
          boxShadow: "inset -1px 0 2px rgba(0,0,0,0.1)",
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: -2,
          top: 110,
          width: 3,
          height: 56,
          background: "#cdd0d8",
          borderRadius: "2px 0 0 2px",
          boxShadow: "inset 1px 0 2px rgba(0,0,0,0.1)",
        }}
      />

      <div
        style={{
          flex: 1,
          background: "#fff",
          borderRadius: 34,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 26,
            background: "#1a1a1a",
            borderRadius: 16,
            zIndex: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        />

        <div
          style={{
            flex: 1,
            paddingTop: 46,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {children}
        </div>

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
              width: 120,
              height: 4,
              borderRadius: 3,
              background: "#1a1a1a",
              opacity: 0.15,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
