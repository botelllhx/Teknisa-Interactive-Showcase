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
 * Renders the right frame for a solution, sized to fill the available container.
 * Portrait/tall frames (mobile, kiosk, tablet) size by height.
 * Wide frames (desktop) size by width.
 * POS terminal sizes by height (mixed display + keypad).
 */
export function SolutionFrame({
  device,
  containerWidth,
  containerHeight,
  children,
}: SolutionFrameProps) {
  if (containerWidth === 0 || containerHeight === 0) return null;

  // Mockup content is zoomed up for TV touch legibility. The wrapping
  // div applies CSS zoom so text sizes designed for phone-sized devices
  // scale up to be readable from 2m on a 55" TV. zoom preserves layout
  // (no overflow) and getBoundingClientRect returns the zoomed positions
  // so the tour spotlight aligns correctly.
  const ZoomedChildren = (
    <div className="mockup-zoom h-full w-full">{children}</div>
  );

  switch (device) {
    case "smartpos": {
      // SmartPOS device: chunkier than a phone (NFC reader + nav bar add ~108px
      // to vertical chrome). Size by height like the other portrait devices.
      const aspect = 9 / 17;
      const heightLimit = containerHeight;
      // The screen part of the device. Width derives from screen area;
      // the frame adds its own chrome on top of that.
      const screenHeight = heightLimit - 28 - 64 - 44; // padding + nfc bay + nav bar
      const widthLimit = containerWidth;
      const screenWidth = Math.min(screenHeight * aspect, widthLimit - 24);
      // We pass the TOTAL height; the frame internally computes its own screen.
      const finalHeight = Math.min(heightLimit, screenWidth / aspect + 136);
      return (
        <SmartPOSDeviceFrame height={finalHeight}>
          {ZoomedChildren}
        </SmartPOSDeviceFrame>
      );
    }
    case "kiosk": {
      const aspect = 9 / 16;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <KioskFrame height={finalHeight}>{ZoomedChildren}</KioskFrame>;
    }
    case "mobile": {
      const aspect = 9 / 19.5;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <MobileFrame height={finalHeight}>{ZoomedChildren}</MobileFrame>;
    }
    case "tablet": {
      const aspect = 3 / 4;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <TabletFrame height={finalHeight}>{ZoomedChildren}</TabletFrame>;
    }
    case "pos-terminal": {
      const heightLimit = containerHeight;
      const widthCap = containerWidth * 0.5;
      const heightFromWidth = (widthCap / 16) * 10 / 0.55;
      const finalHeight = Math.min(heightLimit, heightFromWidth);
      return (
        <POSTerminalFrame height={finalHeight}>
          {ZoomedChildren}
        </POSTerminalFrame>
      );
    }
    case "desktop":
    default: {
      const aspect = 16 / 10;
      const widthLimit = containerWidth;
      const heightLimit = containerHeight;
      const widthFromHeight = heightLimit * aspect;
      const finalWidth = Math.min(widthLimit, widthFromHeight);
      return <DesktopFrame width={finalWidth}>{ZoomedChildren}</DesktopFrame>;
    }
  }
}
