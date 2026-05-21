"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface DesktopFrameProps {
  children?: ReactNode;
  width: number;
  url?: string;
}

const ASPECT_INVERSE = 10 / 16;

export function DesktopFrame({
  children,
  width,
  url = "teknisa.com.br/app",
}: DesktopFrameProps) {
  const screenHeight = width * ASPECT_INVERSE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width,
          background: "linear-gradient(180deg, #e8eaed 0%, #dde0e5 100%)",
          borderRadius: "16px 16px 4px 4px",
          padding: "14px 14px 10px",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.6)",
          position: "relative",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#b8bcc6",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />

        <div
          style={{
            width: "100%",
            height: screenHeight,
            background: "#fff",
            borderRadius: 6,
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 32,
              background: "#f5f6f8",
              borderBottom: "1px solid #e8eaed",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 8,
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
                background: "#eceef1",
                borderRadius: 4,
                marginLeft: 8,
                display: "flex",
                alignItems: "center",
                paddingLeft: 8,
                fontSize: 11,
                fontFamily: "var(--font-ui)",
                color: "#6c757d",
              }}
            >
              {url}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            {children}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          width: 44,
          height: 28,
          background: "linear-gradient(180deg, #d4d7de 0%, #c8cad2 100%)",
          clipPath: "polygon(30% 0%, 70% 0%, 80% 100%, 20% 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          width: 220,
          height: 10,
          background: "linear-gradient(180deg, #d0d3da 0%, #c4c7ce 100%)",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
  };
}
