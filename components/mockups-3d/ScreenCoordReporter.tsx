"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface ScreenBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Props {
  /** World-space center of the device's screen plane */
  center: readonly [number, number, number];
  /** Screen width in world units */
  width: number;
  /** Screen height in world units */
  height: number;
  /** Called with pixel bounds whenever camera/canvas changes */
  onUpdate: (bounds: ScreenBounds) => void;
}

const v = new THREE.Vector3();

/**
 * Projects the device's screen plane corners from world space to canvas
 * pixel coordinates, so an HTML overlay can sit pixel-perfectly on top.
 *
 * Lives inside the R3F Canvas (uses useThree) but renders no geometry.
 */
export function ScreenCoordReporter({
  center,
  width,
  height,
  onUpdate,
}: Props) {
  const { camera, size } = useThree();

  useEffect(() => {
    const project = (x: number, y: number, z: number) => {
      v.set(x, y, z).project(camera);
      return {
        x: ((v.x + 1) / 2) * size.width,
        y: ((1 - v.y) / 2) * size.height,
      };
    };

    const halfW = width / 2;
    const halfH = height / 2;

    const tl = project(center[0] - halfW, center[1] + halfH, center[2]);
    const tr = project(center[0] + halfW, center[1] + halfH, center[2]);
    const bl = project(center[0] - halfW, center[1] - halfH, center[2]);
    const br = project(center[0] + halfW, center[1] - halfH, center[2]);

    const xs = [tl.x, tr.x, bl.x, br.x];
    const ys = [tl.y, tr.y, bl.y, br.y];
    const left = Math.min(...xs);
    const top = Math.min(...ys);

    onUpdate({
      left,
      top,
      width: Math.max(...xs) - left,
      height: Math.max(...ys) - top,
    });
  }, [center, width, height, camera, size, onUpdate]);

  return null;
}
