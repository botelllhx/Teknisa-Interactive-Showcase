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
const CANONICAL: Record<
  SolutionDevice,
  { outerW: number; outerH: number; frame: "desktop" | "mobile" | "tablet" | "kiosk" | "smartpos" | "pos-terminal"; value: number }
> = {
  // DesktopFrame(width=W): screen W×W*10/16, monitor body width=W,
  // height=W*10/16 + 30 padding. Plus neck (30) + base (12) below.
  desktop: { outerW: 1500, outerH: 1500 * (10 / 16) + 30 + 30 + 12, frame: "desktop", value: 1500 },
  // MobileFrame(height=H): width = H * 9/19.5
  mobile: { outerW: 820 * (9 / 19.5), outerH: 820, frame: "mobile", value: 820 },
  // TabletFrame(height=H): width = H * 3/4 (portrait)
  tablet: { outerW: 920 * (3 / 4), outerH: 920, frame: "tablet", value: 920 },
  // KioskFrame(height=H): width = H * 9/16
  kiosk: { outerW: 960 * (9 / 16), outerH: 960, frame: "kiosk", value: 960 },
  // SmartPOSDeviceFrame(height=H): screen 9/17 + 12px side padding * 2.
  // For H=880: verticalChrome=136 → screenH=744 → screenW=744*9/17=393.88
  // → outerW = screenW + 24 ≈ 418.
  smartpos: {
    outerW: (880 - 136) * (9 / 17) + 24,
    outerH: 880,
    frame: "smartpos",
    value: 880,
  },
  // POSTerminalFrame(height=H): width = (H*0.55*16/10) + 28
  "pos-terminal": {
    outerW: 800 * 0.55 * (16 / 10) + 28,
    outerH: 800,
    frame: "pos-terminal",
    value: 800,
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
