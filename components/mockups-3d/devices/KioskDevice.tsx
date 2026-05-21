"use client";

import { RoundedBox } from "@react-three/drei";

// ─── Palette ────────────────────────────────────────────────────────────────
const GRAY_BODY = "#e2e5ea";
const GRAY_MID = "#d4d7de";
const GRAY_DARK = "#c8cdd6";
const GRAY_DEEP = "#b8bcc8";
const BRAND = "#020788";
const SCREEN_BEZEL = "#0a0a14";

// ─── Geometry — designed to look like a real food-service self-order TAA ────
//
// References: McDonald's / Burger King / KFC self-order kiosks.
// Key visual cues:
//   - Substantial body (not slim like a TV)
//   - Distinct top "crown" with branding
//   - Visible HARDWARE SHELF below the screen that protrudes forward,
//     containing the card reader and receipt printer
//   - Wide, heavy pedestal base
//
const W = 1.85; // body width
const H = 3.18; // body height
const D = 0.26; // body depth (chunkier than TV)

const SW = 1.50; // screen width
const SH = 2.667; // screen height (9:16)

// Layout (body centered at Y=0, top = +H/2 = +1.59)
const BRAND_Y = 1.525; // top crown stripe
const SENSOR_Y = 1.43; // sensor zone
const SCREEN_TOP = 1.395;
const SCREEN_Y = SCREEN_TOP - SH / 2; // ≈ +0.0615
const SCREEN_Z = D / 2 + 0.001;

// Lower body / shelf section
const SHELF_TOP = -1.275; // just below screen
const CARD_Y = -1.36;
const RECEIPT_Y = -1.49;
const BASE_Y = -(H / 2) - 0.085;

// Export for the projection-based overlay alignment
export const KIOSK_SCREEN_WORLD = {
  center: [0, SCREEN_Y, SCREEN_Z] as const,
  width: SW,
  height: SH,
};

export function KioskDevice() {
  return (
    <group>
      {/* ── Main body ── */}
      <RoundedBox
        args={[W, H, D]}
        radius={0.045}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={GRAY_BODY}
          metalness={0.18}
          roughness={0.62}
          envMapIntensity={1.0}
        />
      </RoundedBox>

      {/* ── Top crown / brand strip ── */}
      <mesh position={[0, BRAND_Y, D / 2 + 0.001]}>
        <planeGeometry args={[W - 0.06, 0.08]} />
        <meshStandardMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.22}
          roughness={0.4}
        />
      </mesh>
      {/* Wordmark accent */}
      <mesh position={[0, BRAND_Y, D / 2 + 0.003]}>
        <planeGeometry args={[0.55, 0.014]} />
        <meshStandardMaterial color="#ffffff" opacity={0.7} transparent />
      </mesh>

      {/* ── Sensor cluster (camera + IR) ── */}
      <mesh position={[0, SENSOR_Y, D / 2 + 0.003]}>
        <ringGeometry args={[0.024, 0.030, 32]} />
        <meshStandardMaterial color={GRAY_DEEP} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, SENSOR_Y, D / 2 + 0.006]}>
        <circleGeometry args={[0.020, 32]} />
        <meshStandardMaterial color={SCREEN_BEZEL} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0.006, SENSOR_Y + 0.006, D / 2 + 0.007]}>
        <circleGeometry args={[0.004, 16]} />
        <meshStandardMaterial
          color="#4466cc"
          emissive="#4466cc"
          emissiveIntensity={0.7}
        />
      </mesh>
      {[-0.085, 0.085].map((dx) => (
        <mesh key={dx} position={[dx, SENSOR_Y, D / 2 + 0.003]}>
          <circleGeometry args={[0.006, 16]} />
          <meshStandardMaterial color="#2a2a44" roughness={0.5} />
        </mesh>
      ))}

      {/* ── Screen recess (dark plane; HTML overlay covers this) ── */}
      <mesh position={[0, SCREEN_Y, SCREEN_Z]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.28} metalness={0.18} />
      </mesh>

      {/* ── Horizontal separator below screen ── */}
      <mesh position={[0, SHELF_TOP + 0.002, D / 2 + 0.002]}>
        <planeGeometry args={[W - 0.04, 0.004]} />
        <meshStandardMaterial color={GRAY_DARK} roughness={0.6} />
      </mesh>

      {/* ── HARDWARE SHELF — protrudes forward, contains reader + slot ── */}
      <RoundedBox
        args={[W - 0.06, 0.32, 0.12]}
        radius={0.025}
        smoothness={4}
        position={[0, -1.43, D / 2 + 0.06]}
        castShadow
      >
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.16}
          roughness={0.65}
        />
      </RoundedBox>

      {/* Card reader (raised housing on the shelf) */}
      <RoundedBox
        args={[0.42, 0.10, 0.07]}
        radius={0.012}
        smoothness={3}
        position={[-0.36, CARD_Y, D / 2 + 0.13]}
      >
        <meshStandardMaterial
          color={GRAY_DEEP}
          metalness={0.25}
          roughness={0.55}
        />
      </RoundedBox>
      {/* Card slot opening */}
      <mesh position={[-0.36, CARD_Y, D / 2 + 0.167]}>
        <planeGeometry args={[0.32, 0.012]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.9} />
      </mesh>
      {/* NFC icon arcs (concentric, indicating contactless) */}
      {[0.018, 0.028, 0.038].map((r, i) => (
        <mesh
          key={i}
          position={[-0.16, CARD_Y, D / 2 + 0.166]}
          rotation={[0, 0, -Math.PI / 2]}
        >
          <ringGeometry
            args={[r, r + 0.003, 32, 1, Math.PI * 0.35, Math.PI * 0.30]}
          />
          <meshStandardMaterial
            color={BRAND}
            emissive={BRAND}
            emissiveIntensity={0.3}
            opacity={0.7 - i * 0.18}
            transparent
          />
        </mesh>
      ))}

      {/* Receipt printer outlet — raised slot on right side of shelf */}
      <RoundedBox
        args={[0.38, 0.08, 0.06]}
        radius={0.010}
        smoothness={3}
        position={[0.38, CARD_Y + 0.005, D / 2 + 0.125]}
      >
        <meshStandardMaterial
          color={GRAY_DEEP}
          metalness={0.18}
          roughness={0.65}
        />
      </RoundedBox>
      {/* Receipt slot opening */}
      <mesh position={[0.38, CARD_Y + 0.005, D / 2 + 0.157]}>
        <planeGeometry args={[0.30, 0.010]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.9} />
      </mesh>
      {/* "RECEIPT" sub-label accent */}
      <mesh position={[0.38, CARD_Y - 0.030, D / 2 + 0.158]}>
        <planeGeometry args={[0.12, 0.006]} />
        <meshStandardMaterial color={GRAY_DARK} opacity={0.6} transparent />
      </mesh>

      {/* Receipt slot on lower shelf (paper output) */}
      <mesh position={[0, RECEIPT_Y, D / 2 + 0.122]}>
        <planeGeometry args={[0.55, 0.025]} />
        <meshStandardMaterial color={SCREEN_BEZEL} roughness={0.85} />
      </mesh>

      {/* ── Wide, heavy pedestal base ── */}
      <mesh position={[0, BASE_Y, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.58, 0.78, 0.17, 56, 1]} />
        <meshStandardMaterial
          color={GRAY_MID}
          metalness={0.22}
          roughness={0.6}
          envMapIntensity={0.85}
        />
      </mesh>
      {/* Base top ring */}
      <mesh position={[0, BASE_Y + 0.088, 0]}>
        <cylinderGeometry args={[0.59, 0.59, 0.008, 56, 1]} />
        <meshStandardMaterial color={GRAY_DARK} roughness={0.55} />
      </mesh>
      {/* Brand accent ring on base */}
      <mesh position={[0, BASE_Y + 0.045, 0]}>
        <cylinderGeometry args={[0.701, 0.701, 0.006, 56, 1]} />
        <meshStandardMaterial
          color={BRAND}
          emissive={BRAND}
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}
