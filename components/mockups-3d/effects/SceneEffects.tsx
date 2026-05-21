"use client";

import { EffectComposer, Vignette } from "@react-three/postprocessing";

/**
 * Post-processing kept very light: a soft vignette to focus the eye on the
 * interface. No bloom — it washed out the white UI inside the device screen.
 */
export function SceneEffects() {
  return (
    <EffectComposer>
      <Vignette offset={0.32} darkness={0.32} />
    </EffectComposer>
  );
}
