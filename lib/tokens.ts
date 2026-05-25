/**
 * Runtime tokens lidos pelo TypeScript. Cores, spacing e fontes vivem em
 * `tailwind.config.ts` — esse arquivo só guarda o que precisa ser lido
 * em JS (timings, z-index, hardware gradients).
 */

export const timing = {
  micro: 200,
  transition: 400,
  scene: 700,
  idleTimeout: 90_000,
  idleOverlayGrace: 5_000,
} as const;

// Single source of truth for stacking order. Anything that overlays the
// scene must read from here so the hierarchy stays consistent across
// the whole app. Spec lives in CLAUDE.md §14.
export const Z_INDEX = {
  frame: 0,
  companion: 10,
  notification: 20,
  presentationToggle: 9997,
  completion: 9998,
  idle: 9998,
  tour: 9999,
} as const;

// Light-grey "hardware" gradient used on every physical device surface
// (device frames + companion equipment shells). See CLAUDE.md §21.5.
export const HARDWARE_GRADIENT =
  "linear-gradient(180deg, #ebedf1 0%, #dde0e5 60%, #d4d7de 100%)";

export const HARDWARE_SHADOW =
  "0 0 0 1px rgba(0,0,0,0.06), 0 18px 44px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)";
