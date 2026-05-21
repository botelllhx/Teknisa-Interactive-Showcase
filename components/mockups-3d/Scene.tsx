"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, type ReactNode } from "react";
import { SceneEffects } from "./effects/SceneEffects";

interface SceneProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  floorY?: number;
}

/**
 * Static R3F scene tuned for a software showcase:
 *  - No Float, no drag-rotate: the interface is the protagonist, the device
 *    is a still 3D frame. Stable elements → reliable TourOverlay measurement
 *    and accurate touch targets.
 *  - Cinematic lighting (key + cool fill + brand rim) communicates depth
 *    without any motion.
 */
export function Scene({
  children,
  cameraPosition = [0, 0, 5],
  floorY = -1.85,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      shadows
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <Suspense fallback={null}>
        {/* Ambient fill — keeps shadows readable */}
        <ambientLight intensity={0.55} />

        {/* Key light — upper front-right */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={20}
        />

        {/* Fill light — upper back-left, cool tint */}
        <directionalLight
          position={[-4, 2, -2]}
          intensity={0.32}
          color="#dde4f6"
        />

        {/* Rim light — behind device, brand blue glow */}
        <pointLight position={[0, 0, -5]} intensity={0.65} color="#020788" />

        {/* Environment map for subtle material reflections */}
        <Environment preset="city" />

        {/* Soft contact shadow on the floor plane */}
        <ContactShadows
          position={[0, floorY, 0]}
          opacity={0.38}
          scale={14}
          blur={2.6}
          far={5}
          color="#1a1a3a"
        />

        {children}

        <SceneEffects />
      </Suspense>
    </Canvas>
  );
}
