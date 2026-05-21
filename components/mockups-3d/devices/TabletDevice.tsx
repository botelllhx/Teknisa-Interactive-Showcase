"use client";

import { RoundedBox } from "@react-three/drei";

const GRAY_BODY = "#e2e5ea";
const GRAY_DARK = "#c8cdd6";
const GRAY_DEEP = "#b8bcc8";
const BRAND = "#020788";
const SCREEN_BEZEL = "#0a0a14";

const TW = 2.60;
const TH = 1.70;
const TD = 0.06;

const SW = 2.40;
const SH = parseFloat((SW * (10 / 16)).toFixed(4)); // 1.5

export const TABLET_SCREEN_WORLD = {
  center: [0, 0, TD / 2 + 0.001] as const,
  width: SW,
  height: SH,
};

export function TabletDevice() {
  return (
    <group>
      {/* ── Body ── */}
      <RoundedBox
        args={[TW, TH, TD]}
        radius={0.045}
        smoothness={4}
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

      {/* Camera — right bezel in landscape */}
      <mesh position={[TW / 2 - 0.035, 0, TD / 2 + 0.006]}>
        <circleGeometry args={[0.016, 24]} />
        <meshStandardMaterial color={SCREEN_BEZEL} metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[TW / 2 - 0.035, 0, TD / 2 + 0.004]}>
        <ringGeometry args={[0.018, 0.024, 24]} />
        <meshStandardMaterial color={GRAY_DEEP} roughness={0.6} />
      </mesh>

      {/* Home indicator — left bezel */}
      <mesh position={[-(TW / 2) + 0.035, 0, TD / 2 + 0.005]}>
        <circleGeometry args={[0.024, 32]} />
        <meshStandardMaterial color={GRAY_DARK} metalness={0.2} roughness={0.55} />
      </mesh>
      <mesh position={[-(TW / 2) + 0.035, 0, TD / 2 + 0.0065]}>
        <circleGeometry args={[0.016, 32]} />
        <meshStandardMaterial color={GRAY_DEEP} roughness={0.5} />
      </mesh>

      {/* Screen recess */}
      <mesh position={[0, 0, TD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.015, SH + 0.015]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.3} />
      </mesh>

      {/* Volume buttons — top edge */}
      {[-0.14, 0.04].map((dx) => (
        <mesh key={dx} position={[dx, TH / 2 + 0.002, 0]}>
          <boxGeometry args={[0.12, 0.008, TD * 0.5]} />
          <meshStandardMaterial color={GRAY_DARK} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}

      {/* Power button — right edge */}
      <mesh position={[TW / 2 + 0.002, 0.18, 0]}>
        <boxGeometry args={[0.008, 0.14, TD * 0.5]} />
        <meshStandardMaterial color={GRAY_DARK} metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Brand accent on bottom bezel */}
      <mesh position={[0.18, -(TH / 2) + 0.022, TD / 2 + 0.004]}>
        <planeGeometry args={[0.10, 0.008]} />
        <meshStandardMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.22}
        />
      </mesh>
    </group>
  );
}
