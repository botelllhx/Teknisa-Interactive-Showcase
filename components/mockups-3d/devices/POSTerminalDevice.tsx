"use client";

import { RoundedBox } from "@react-three/drei";

const GRAY_BODY = "#e2e5ea";
const GRAY_MID = "#d4d7de";
const GRAY_DARK = "#c8cdd6";
const GRAY_DEEP = "#b8bcc8";
const BRAND = "#020788";
const SCREEN_BEZEL = "#0a0a14";

const DW = 2.50;
const DH = 1.55;
const DD = 0.10;

const SW = 2.30;
const SH = parseFloat((SW * (10 / 16)).toFixed(4)); // 1.4375

const DISPLAY_Y = 0.42;
const SCREEN_Y = DISPLAY_Y;
const STAND_Y = DISPLAY_Y - DH / 2 - 0.16;
const BASE_Y = STAND_Y - 0.18;

export const POS_SCREEN_WORLD = {
  center: [0, SCREEN_Y, DD / 2 + 0.001] as const,
  width: SW,
  height: SH,
};

export function POSTerminalDevice() {
  return (
    <group>
      {/* ── Display panel ── */}
      <RoundedBox
        args={[DW, DH, DD]}
        radius={0.035}
        smoothness={4}
        position={[0, DISPLAY_Y, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={GRAY_BODY}
          metalness={0.16}
          roughness={0.62}
          envMapIntensity={0.95}
        />
      </RoundedBox>

      {/* Camera dot — top bezel */}
      <mesh position={[0, DISPLAY_Y + DH / 2 - 0.028, DD / 2 + 0.006]}>
        <circleGeometry args={[0.014, 24]} />
        <meshStandardMaterial color={SCREEN_BEZEL} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0, DISPLAY_Y + DH / 2 - 0.028, DD / 2 + 0.004]}>
        <ringGeometry args={[0.016, 0.022, 24]} />
        <meshStandardMaterial color={GRAY_DEEP} roughness={0.6} />
      </mesh>

      {/* Screen recess */}
      <mesh position={[0, SCREEN_Y, DD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.015, SH + 0.015]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.3} />
      </mesh>

      {/* Brand accent on bottom bezel */}
      <mesh position={[0, DISPLAY_Y - DH / 2 + 0.020, DD / 2 + 0.003]}>
        <planeGeometry args={[0.38, 0.010]} />
        <meshStandardMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* Power LED */}
      <mesh
        position={[DW / 2 - 0.05, DISPLAY_Y - DH / 2 + 0.020, DD / 2 + 0.005]}
      >
        <circleGeometry args={[0.006, 16]} />
        <meshStandardMaterial
          color="#22dd66"
          emissive="#22dd66"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* ── Stand column ── */}
      <RoundedBox
        args={[0.11, 0.34, 0.10]}
        radius={0.025}
        smoothness={4}
        position={[0, STAND_Y, 0]}
        castShadow
      >
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.20}
          roughness={0.62}
        />
      </RoundedBox>

      <mesh position={[0, STAND_Y, 0.051]}>
        <planeGeometry args={[0.022, 0.30]} />
        <meshStandardMaterial color={GRAY_DARK} roughness={0.8} />
      </mesh>

      {/* ── Base slab ── */}
      <RoundedBox
        args={[1.50, 0.08, 0.52]}
        radius={0.03}
        smoothness={4}
        position={[0, BASE_Y, -0.06]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.18}
          roughness={0.65}
          envMapIntensity={0.75}
        />
      </RoundedBox>

      <mesh position={[0, BASE_Y + 0.041, -0.06]}>
        <boxGeometry args={[1.52, 0.005, 0.54]} />
        <meshStandardMaterial color={GRAY_DARK} roughness={0.6} />
      </mesh>
    </group>
  );
}
