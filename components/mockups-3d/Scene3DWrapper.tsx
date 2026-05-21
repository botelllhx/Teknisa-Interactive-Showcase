"use client";

import { Scene } from "./Scene";
import { KioskDevice, KIOSK_SCREEN_WORLD } from "./devices/KioskDevice";
import {
  POSTerminalDevice,
  POS_SCREEN_WORLD,
} from "./devices/POSTerminalDevice";
import { TabletDevice, TABLET_SCREEN_WORLD } from "./devices/TabletDevice";
import { MobileDevice, MOBILE_SCREEN_WORLD } from "./devices/MobileDevice";
import { DesktopDevice, DESKTOP_SCREEN_WORLD } from "./devices/DesktopDevice";
import { ScreenCoordReporter, type ScreenBounds } from "./ScreenCoordReporter";
import type { SolutionDevice } from "@/data/solutions";

// Camera positions tuned per device for ~88-92% viewport fill
const CAMERA_POSITIONS: Record<SolutionDevice, [number, number, number]> = {
  kiosk: [0, 0.0, 5.2],
  "pos-terminal": [0, 0.0, 3.6],
  mobile: [0, 0, 3.6],
  tablet: [0, 0.0, 3.0],
  desktop: [0, 0.0, 3.8],
};

const FLOOR_Y: Record<SolutionDevice, number> = {
  kiosk: -1.78,
  "pos-terminal": -1.10,
  mobile: -1.18,
  tablet: -0.95,
  desktop: -1.30,
};

const SCREEN_WORLD: Record<
  SolutionDevice,
  {
    center: readonly [number, number, number];
    width: number;
    height: number;
  }
> = {
  kiosk: KIOSK_SCREEN_WORLD,
  "pos-terminal": POS_SCREEN_WORLD,
  mobile: MOBILE_SCREEN_WORLD,
  tablet: TABLET_SCREEN_WORLD,
  desktop: DESKTOP_SCREEN_WORLD,
};

interface Scene3DWrapperProps {
  device: SolutionDevice;
  onScreenBounds: (b: ScreenBounds) => void;
}

export function Scene3DWrapper({
  device,
  onScreenBounds,
}: Scene3DWrapperProps) {
  const cameraPos = CAMERA_POSITIONS[device] ?? [0, 0, 5.0];
  const floorY = FLOOR_Y[device] ?? -1.85;
  const screen = SCREEN_WORLD[device];

  return (
    <Scene cameraPosition={cameraPos} floorY={floorY}>
      {device === "kiosk" && <KioskDevice />}
      {device === "pos-terminal" && <POSTerminalDevice />}
      {device === "tablet" && <TabletDevice />}
      {device === "mobile" && <MobileDevice />}
      {device === "desktop" && <DesktopDevice />}

      {screen && (
        <ScreenCoordReporter
          center={screen.center}
          width={screen.width}
          height={screen.height}
          onUpdate={onScreenBounds}
        />
      )}
    </Scene>
  );
}
