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
  children?: ReactNode;
  className?: string;
}

export function SolutionFrame({ device, children, className }: SolutionFrameProps) {
  switch (device) {
    case "desktop":
      return <DesktopFrame className={className}>{children}</DesktopFrame>;
    case "mobile":
      return <MobileFrame className={className}>{children}</MobileFrame>;
    case "tablet":
      return <TabletFrame className={className}>{children}</TabletFrame>;
    case "pos-terminal":
      return <POSTerminalFrame className={className}>{children}</POSTerminalFrame>;
    case "kiosk":
      return <KioskFrame className={className}>{children}</KioskFrame>;
    default:
      return <DesktopFrame className={className}>{children}</DesktopFrame>;
  }
}

export function frameMaxWidth(device: SolutionDevice): string {
  switch (device) {
    case "desktop":
      return "max-w-4xl";
    case "mobile":
      return "max-w-[280px]";
    case "tablet":
      return "max-w-md";
    case "pos-terminal":
      return "max-w-lg";
    case "kiosk":
      return "max-w-[360px]";
    default:
      return "max-w-3xl";
  }
}
