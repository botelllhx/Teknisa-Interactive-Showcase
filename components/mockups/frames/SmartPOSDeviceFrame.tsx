"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * SmartPOS device frame — represents a handheld POS terminal (genérico
 * tipo "maquininha"), NOT a phone. Anatomy:
 *
 *   ┌───────────────────────┐  ← contactless NFC reader pad
 *   │   ●  contactless      │     (top arc with antenna icon)
 *   ├───────────────────────┤
 *   │                       │
 *   │       SCREEN          │
 *   │       (9:16)          │
 *   │                       │
 *   ├───────────────────────┤
 *   │ ◀  ⬤  ☰  TEKNISA POS │  ← Android-style nav + device label
 *   └───────────────────────┘
 *
 * Reference: /public/FrenteDeLoja/Smart POS/* — real product shots show
 * a phone-shaped chassis with the Teknisa "RETAIL POS" brand at boot and
 * a card reader integrated at the top for tap-to-pay flows.
 */

interface SmartPOSDeviceFrameProps {
  children?: ReactNode;
  height: number;
}

// Aspect of the SCREEN area only (matches a mobile-ish ratio). The frame
// adds extra vertical height on top (NFC bay) and bottom (nav bar) so the
// device looks chunky like a real terminal, not slim like a phone.
const SCREEN_ASPECT = 9 / 17;
const NFC_BAY_HEIGHT = 64;
const NAV_BAR_HEIGHT = 44;
const SIDE_PADDING = 12;

const HARDWARE_GRADIENT =
  "linear-gradient(155deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

const NFC_PAD_GRADIENT =
  "linear-gradient(180deg, #d8dbe2 0%, #c8cbd3 100%)";

export function SmartPOSDeviceFrame({
  children,
  height,
}: SmartPOSDeviceFrameProps) {
  // Compute the screen width from the desired total height
  // (height = NFC_BAY + screen + NAV_BAR + vertical padding).
  const verticalChrome = NFC_BAY_HEIGHT + NAV_BAR_HEIGHT + 28;
  const screenHeight = Math.max(280, height - verticalChrome);
  const screenWidth = screenHeight * SCREEN_ASPECT;
  const deviceWidth = screenWidth + SIDE_PADDING * 2;

  return (
    <motion.div
      data-tour-frame="true"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: deviceWidth,
        background: HARDWARE_GRADIENT,
        borderRadius: 28,
        padding: `14px ${SIDE_PADDING}px 12px`,
        boxShadow: [
          "0 0 0 1px rgba(0,0,0,0.10)",
          "0 44px 90px rgba(0,0,0,0.22)",
          "0 14px 32px rgba(0,0,0,0.10)",
          "inset 0 1.5px 0 rgba(255,255,255,0.78)",
          "inset 0 -1px 0 rgba(0,0,0,0.06)",
        ].join(", "),
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
      }}
    >
      {/* NFC contactless reader bay — the top "extra" that makes a SmartPOS
          recognizable. Soft pill with a glowing tap zone and Wi-Fi style arcs. */}
      <div
        aria-hidden
        style={{
          height: NFC_BAY_HEIGHT,
          width: "100%",
          background: NFC_PAD_GRADIENT,
          borderRadius: 16,
          position: "relative",
          overflow: "hidden",
          boxShadow:
            "inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        {/* Tap zone indicator — a soft glowing circle with concentric arcs.
            Communicates "this is where you tap a card". */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: "#5e6168",
          }}
        >
          {/* NFC wave icon (3 arcs) on the left */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M5 12c0-3.87 3.13-7 7-7" opacity="0.35" />
            <path d="M7 12c0-2.76 2.24-5 5-5" opacity="0.6" />
            <path d="M9 12c0-1.66 1.34-3 3-3" />
            <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
          </svg>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#5e6168",
            }}
          >
            Aproxime o cartão
          </div>
          {/* Reverse waves on right */}
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" style={{ transform: "scaleX(-1)" }}>
            <path d="M5 12c0-3.87 3.13-7 7-7" opacity="0.35" />
            <path d="M7 12c0-2.76 2.24-5 5-5" opacity="0.6" />
            <path d="M9 12c0-1.66 1.34-3 3-3" />
          </svg>
        </div>
        {/* Subtle status LED top-right */}
        <span
          style={{
            position: "absolute",
            top: 6,
            right: 8,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#16a34a",
            boxShadow: "0 0 8px rgba(22,163,74,0.55)",
          }}
        />
      </div>

      {/* Screen area */}
      <div
        style={{
          width: "100%",
          height: screenHeight,
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 3px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>

      {/* Bottom nav strip — Android style back/home/menu (from /public POS refs)
          plus a small device label on the right. */}
      <div
        aria-hidden
        style={{
          height: NAV_BAR_HEIGHT,
          width: "100%",
          background: "#1a1c20",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 18,
          paddingRight: 14,
          color: "#cfd2d8",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Back ◁ */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {/* Home ○ */}
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "1.6px solid currentColor",
            }}
          />
          {/* Menu ☰ */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 2.5,
            color: "#8a8e96",
          }}
        >
          TEKNISA RETAIL POS
        </span>
      </div>
    </motion.div>
  );
}
