"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";
import type { SolutionDevice } from "@/data/solutions";
import type { ScreenBounds } from "./ScreenCoordReporter";

// ─── Dynamic import of the 3D scene (no SSR) ────────────────────────────────
const Scene3DWrapper = dynamic(
  () =>
    import("./Scene3DWrapper").then((m) => ({ default: m.Scene3DWrapper })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f0f1fc 0%, #e8e9f8 100%)",
        }}
      />
    ),
  },
);

// Border radius per device for the HTML overlay (matches each device's
// screen recess corner radius for a clean visual seam).
const OVERLAY_RADIUS: Record<SolutionDevice, number> = {
  kiosk: 6,
  "pos-terminal": 6,
  mobile: 38,
  tablet: 8,
  desktop: 6,
};

interface Device3DCanvasProps {
  device: SolutionDevice;
  children: ReactNode;
}

/**
 * Device3DCanvas — splits visual + interaction:
 *
 *  - Layer 1: 3D Canvas renders ONLY the device shell.
 *  - Layer 2: A ScreenCoordReporter inside the Canvas projects the device's
 *             screen plane corners from world space to canvas pixel coords.
 *  - Layer 3: An absolutely-positioned HTML overlay uses those pixel coords
 *             so the React interface sits exactly on the device's screen,
 *             with no math errors regardless of canvas size or camera.
 *
 * The interface renders as plain DOM, so getBoundingClientRect (used by the
 * TourOverlay) and native click events all work normally.
 */
export function Device3DCanvas({ device, children }: Device3DCanvasProps) {
  const [bounds, setBounds] = useState<ScreenBounds>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const handleBounds = useCallback((b: ScreenBounds) => {
    setBounds(b);
  }, []);

  const radius = OVERLAY_RADIUS[device] ?? 6;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Layer 1+2: 3D device shell + coord reporter inside Canvas ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Scene3DWrapper device={device} onScreenBounds={handleBounds} />
      </div>

      {/* ── Layer 3: Interface as crisp HTML overlay, pixel-aligned ── */}
      {bounds.width > 0 && (
        <div
          style={{
            position: "absolute",
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
            overflow: "hidden",
            borderRadius: radius,
            background: "#ffffff",
            zIndex: 10,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
