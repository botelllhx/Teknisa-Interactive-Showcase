"use client";

import { type ReactNode } from "react";
import type { SolutionDevice } from "@/data/solutions";
import { DesktopFrame } from "./DesktopFrame";
import { MobileFrame } from "./MobileFrame";
import { TabletFrame } from "./TabletFrame";
import { POSTerminalFrame } from "./POSTerminalFrame";
import { KioskFrame } from "./KioskFrame";

export { DesktopFrame, MobileFrame, TabletFrame, POSTerminalFrame, KioskFrame };

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

  switch (device) {
    case "kiosk": {
      const aspect = 9 / 16;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <KioskFrame height={finalHeight}>{children}</KioskFrame>;
    }
    case "mobile": {
      const aspect = 9 / 19.5;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <MobileFrame height={finalHeight}>{children}</MobileFrame>;
    }
    case "tablet": {
      // Portrait 3:4
      const aspect = 3 / 4;
      const heightLimit = containerHeight;
      const widthLimit = containerWidth / aspect;
      const finalHeight = Math.min(heightLimit, widthLimit);
      return <TabletFrame height={finalHeight}>{children}</TabletFrame>;
    }
    case "pos-terminal": {
      // Approximated: full height; width derived inside the component
      // Cap to 50% of container width to avoid overflow on wide screens.
      const heightLimit = containerHeight;
      const widthCap = containerWidth * 0.5;
      const heightFromWidth = (widthCap / 16) * 10 / 0.55;
      const finalHeight = Math.min(heightLimit, heightFromWidth);
      return <POSTerminalFrame height={finalHeight}>{children}</POSTerminalFrame>;
    }
    case "desktop":
    default: {
      // Desktop: width-driven (16:10)
      const aspect = 16 / 10;
      const widthLimit = containerWidth;
      const heightLimit = containerHeight;
      const widthFromHeight = heightLimit * aspect;
      const finalWidth = Math.min(widthLimit, widthFromHeight);
      return <DesktopFrame width={finalWidth}>{children}</DesktopFrame>;
    }
  }
}
