"use client";

import { RoundedBox } from "@react-three/drei";

const GRAY_BODY = "#e2e5ea";
const GRAY_MID = "#d4d7de";
const GRAY_DARK = "#c8cdd6";
const GRAY_DEEP = "#b8bcc8";
const SCREEN_BEZEL = "#0a0a14";

const MW = 1.00;
const MH = 2.16;
const MD = 0.10;

const SW = 0.88;
const SH = 1.92;

const DI_Y = MH / 2 - 0.085;
const DI_W = 0.30;
const DI_H = 0.075;

export const MOBILE_SCREEN_WORLD = {
  center: [0, 0, MD / 2 + 0.001] as const,
  width: SW,
  height: SH,
};

export function MobileDevice() {
  return (
    <group>
      {/* ── Body ── */}
      <RoundedBox
        args={[MW, MH, MD]}
        radius={0.13}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={GRAY_BODY}
          metalness={0.22}
          roughness={0.55}
          envMapIntensity={1.05}
        />
      </RoundedBox>

      {/* Screen recess */}
      <mesh position={[0, 0, MD / 2 + 0.001]}>
        <planeGeometry args={[SW + 0.012, SH + 0.012]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.3} />
      </mesh>

      {/* Dynamic Island — sits above the HTML overlay's notch area */}
      <RoundedBox
        args={[DI_W, DI_H, 0.008]}
        radius={DI_H / 2}
        smoothness={4}
        position={[0, DI_Y, MD / 2 + 0.014]}
      >
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.25} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0.115, DI_Y, MD / 2 + 0.018]}>
        <circleGeometry args={[0.012, 16]} />
        <meshStandardMaterial color="#1a2244" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Volume buttons */}
      {[-0.30, -0.05].map((dy) => (
        <mesh key={dy} position={[-(MW / 2) - 0.002, dy, 0]}>
          <boxGeometry args={[0.008, 0.18, MD * 0.45]} />
          <meshStandardMaterial color={GRAY_DARK} metalness={0.25} roughness={0.55} />
        </mesh>
      ))}

      {/* Power button */}
      <mesh position={[MW / 2 + 0.002, 0.12, 0]}>
        <boxGeometry args={[0.008, 0.22, MD * 0.45]} />
        <meshStandardMaterial color={GRAY_DARK} metalness={0.25} roughness={0.55} />
      </mesh>

      {/* Speaker grille */}
      {[-0.16, -0.08, 0, 0.08, 0.16].map((dx) => (
        <mesh key={dx} position={[dx, -(MH / 2) - 0.002, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.008, 12]} />
          <meshStandardMaterial color={GRAY_DEEP} roughness={0.7} />
        </mesh>
      ))}

      {/* Rear camera cluster */}
      <mesh position={[-0.16, MH / 2 - 0.42, -(MD / 2) - 0.004]}>
        <boxGeometry args={[0.27, 0.27, 0.012]} />
        <meshStandardMaterial color={GRAY_MID} roughness={0.5} metalness={0.3} />
      </mesh>
      {[
        [-0.07, 0.07],
        [0.07, 0.07],
        [-0.07, -0.07],
      ].map(([cx, cy], i) => (
        <mesh
          key={i}
          position={[-0.16 + cx, MH / 2 - 0.42 + cy, -(MD / 2) - 0.012]}
        >
          <circleGeometry args={[0.040, 24]} />
          <meshStandardMaterial color={SCREEN_BEZEL} metalness={0.7} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}
