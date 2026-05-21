"use client";

import { RoundedBox } from "@react-three/drei";

const GRAY_BODY = "#e2e5ea";
const GRAY_MID = "#d4d7de";
const GRAY_DARK = "#c8cdd6";
const GRAY_DEEP = "#b8bcc8";
const BRAND = "#020788";
const SCREEN_BEZEL = "#0a0a14";

const MW = 2.85;
const MH = 1.80;
const MD = 0.08;

const SW = 2.62;
const SH = parseFloat((SW * (10 / 16)).toFixed(4)); // 1.6375

const MONITOR_Y = 0.45;
const NECK_H = 0.45;
const NECK_Y = MONITOR_Y - MH / 2 - NECK_H / 2;
const BASE_Y = NECK_Y - NECK_H / 2 - 0.04;

export const DESKTOP_SCREEN_WORLD = {
  center: [0, MONITOR_Y, MD / 2 + 0.001] as const,
  width: SW,
  height: SH,
};

export function DesktopDevice() {
  return (
    <group>
      {/* ── Monitor panel ── */}
      <RoundedBox
        args={[MW, MH, MD]}
        radius={0.032}
        smoothness={4}
        position={[0, MONITOR_Y, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={GRAY_BODY}
          metalness={0.16}
          roughness={0.62}
          envMapIntensity={1.0}
        />
      </RoundedBox>

      {/* Webcam */}
      <mesh position={[0, MONITOR_Y + MH / 2 - 0.026, MD / 2 + 0.006]}>
        <circleGeometry args={[0.014, 24]} />
        <meshStandardMaterial color={SCREEN_BEZEL} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, MONITOR_Y + MH / 2 - 0.026, MD / 2 + 0.004]}>
        <ringGeometry args={[0.016, 0.022, 24]} />
        <meshStandardMaterial color={GRAY_DEEP} roughness={0.5} />
      </mesh>
      <mesh position={[0.030, MONITOR_Y + MH / 2 - 0.026, MD / 2 + 0.006]}>
        <circleGeometry args={[0.004, 12]} />
        <meshStandardMaterial
          color="#22dd66"
          emissive="#22dd66"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Screen recess */}
      <mesh position={[0, MONITOR_Y, MD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.015, SH + 0.015]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.3} />
      </mesh>

      {/* Brand accent on bottom bezel */}
      <mesh position={[0, MONITOR_Y - MH / 2 + 0.022, MD / 2 + 0.003]}>
        <planeGeometry args={[0.50, 0.010]} />
        <meshStandardMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Power LED */}
      <mesh position={[MW / 2 - 0.08, MONITOR_Y - MH / 2 + 0.022, MD / 2 + 0.005]}>
        <circleGeometry args={[0.006, 16]} />
        <meshStandardMaterial
          color="#22dd66"
          emissive="#22dd66"
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* ── Neck / stand ── */}
      <RoundedBox
        args={[0.085, NECK_H, 0.075]}
        radius={0.020}
        smoothness={4}
        position={[0, NECK_Y, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.22}
          roughness={0.62}
        />
      </RoundedBox>

      {/* ── Elliptical base ── */}
      <mesh position={[0, BASE_Y, -0.07]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.88, 0.05, 48, 1]} />
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.20}
          roughness={0.62}
          envMapIntensity={0.75}
        />
      </mesh>
      <mesh position={[0, BASE_Y + 0.026, -0.07]}>
        <cylinderGeometry args={[0.755, 0.755, 0.005, 48, 1]} />
        <meshStandardMaterial color={GRAY_DARK} roughness={0.6} />
      </mesh>
    </group>
  );
}
