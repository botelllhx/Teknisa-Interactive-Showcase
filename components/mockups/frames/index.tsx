"use client";

import { type ReactNode } from "react";
import type { SolutionDevice } from "@/data/solutions";
import { DesktopFrame } from "./DesktopFrame";
import { MobileFrame } from "./MobileFrame";
import { TabletFrame } from "./TabletFrame";
import { POSTerminalFrame } from "./POSTerminalFrame";
import { KioskFrame } from "./KioskFrame";
import { SmartPOSDeviceFrame } from "./SmartPOSDeviceFrame";

export {
  DesktopFrame,
  MobileFrame,
  TabletFrame,
  POSTerminalFrame,
  KioskFrame,
  SmartPOSDeviceFrame,
};

interface SolutionFrameProps {
  device: SolutionDevice;
  containerWidth: number;
  containerHeight: number;
  children?: ReactNode;
}

/**
 * Renders the device frame at a CANONICAL FIXED logical size per device, then
 * scales it via CSS transform to fit the actual container. This keeps the
 * simulated "screen" of the device (desktop/mobile/tablet/etc.) at a fixed
 * layout size regardless of viewport / zoom — so a dashboard authored against
 * a 1500×937 desktop screen never collapses or overflows when the surrounding
 * page shrinks.
 *
 * The header, companions, and the rest of the demo page stay responsive — only
 * the device-screen content is locked to a fixed canvas.
 */
// v13.20 — sizes ajustadas pra ULTRAREVIEW da responsividade.
// Portrait devices (mobile/tablet/kiosk/smartpos) ficavam visualmente
// menores que landscape (desktop/POS) por conta do aspect ratio. Subi
// os canonicals dos portraits pra terem PRESENÇA visual equiparável.
const CANONICAL: Record<
  SolutionDevice,
  { outerW: number; outerH: number; frame: "desktop" | "mobile" | "tablet" | "kiosk" | "smartpos" | "pos-terminal"; value: number }
> = {
  // DesktopFrame(width=W): screen W×W*10/16, monitor body width=W,
  // height=W*10/16 + 30 padding. Plus neck (30) + base (12) below.
  desktop: { outerW: 1500, outerH: 1500 * (10 / 16) + 30 + 30 + 12, frame: "desktop", value: 1500 },
  // MobileFrame(height=H): width = H * 9/19.5
  // v13.20: 820 → 940 (bigger presence pra portrait)
  mobile: { outerW: 940 * (9 / 19.5), outerH: 940, frame: "mobile", value: 940 },
  // TabletFrame(height=H): width = H * 3/4 (portrait)
  // v13.20: 920 → 980
  tablet: { outerW: 980 * (3 / 4), outerH: 980, frame: "tablet", value: 980 },
  // KioskFrame(height=H): width = H * 9/16
  // v13.20: 960 → 1000
  kiosk: { outerW: 1000 * (9 / 16), outerH: 1000, frame: "kiosk", value: 1000 },
  // SmartPOSDeviceFrame(height=H): screen 9/17 + 12px side padding * 2.
  // v13.20: 880 → 980
  smartpos: {
    outerW: (980 - 136) * (9 / 17) + 24,
    outerH: 980,
    frame: "smartpos",
    value: 980,
  },
  // POSTerminalFrame(height=H): width = (H*0.70*16/10) + 28
  // v13.20: 800 → 860 ; v13.25: SCREEN_RATIO 0.55→0.70 → outerW recalculado
  "pos-terminal": {
    outerW: 860 * 0.70 * (16 / 10) + 28,
    outerH: 860,
    frame: "pos-terminal",
    value: 860,
  },
};

export function SolutionFrame({
  device,
  containerWidth,
  containerHeight,
  children,
}: SolutionFrameProps) {
  if (containerWidth === 0 || containerHeight === 0) return null;

  // Mockup content is zoomed up for TV touch legibility. The wrapping div
  // applies CSS scale so text sizes designed for phone-sized devices scale
  // up to be readable from 2m on a 55" TV.
  const ZoomedChildren = (
    <div className="mockup-zoom h-full w-full">{children}</div>
  );

  const canon = CANONICAL[device];
  const scale = Math.min(
    containerWidth / canon.outerW,
    containerHeight / canon.outerH,
  );

  let frame: ReactNode;
  switch (canon.frame) {
    case "smartpos":
      frame = <SmartPOSDeviceFrame height={canon.value}>{ZoomedChildren}</SmartPOSDeviceFrame>;
      break;
    case "kiosk":
      frame = <KioskFrame height={canon.value}>{ZoomedChildren}</KioskFrame>;
      break;
    case "mobile":
      frame = <MobileFrame height={canon.value}>{ZoomedChildren}</MobileFrame>;
      break;
    case "tablet":
      frame = <TabletFrame height={canon.value}>{ZoomedChildren}</TabletFrame>;
      break;
    case "pos-terminal":
      frame = <POSTerminalFrame height={canon.value}>{ZoomedChildren}</POSTerminalFrame>;
      break;
    case "desktop":
    default:
      frame = <DesktopFrame width={canon.value}>{ZoomedChildren}</DesktopFrame>;
      break;
  }

  // Outer box has the SCALED dimensions so it claims the right amount of
  // space in the parent flex/grid; inner box is at canonical size and is
  // scaled via transform from its top-left corner. Both boxes line up exactly
  // because the frame's natural CSS size === canonical size, so we can use
  // getBoundingClientRect on the target / data-tour-frame and trust the
  // returned (visual) coords for the spotlight + tooltip positioning.
  return (
    <div
      style={{
        width: canon.outerW * scale,
        height: canon.outerH * scale,
        position: "relative",
        flex: "none",
      }}
    >
      <div
        style={{
          width: canon.outerW,
          height: canon.outerH,
          position: "absolute",
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {frame}
      </div>
    </div>
  );
}
