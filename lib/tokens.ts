export const colors = {
  brand: {
    DEFAULT: "#020788",
    light: "#1a1fa8",
    lighter: "#3b42c4",
    subtle: "#e8e9f8",
    ghost: "#f0f1fc",
  },
  neutral: {
    50: "#f8f9fa",
    100: "#f1f3f5",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#6c757d",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0284c7",
  surface: {
    base: "#ffffff",
    raised: "#f8f9fa",
    overlay: "rgba(255,255,255,0.92)",
  },
  frame: {
    body: "#e2e5ea",
    screen: "#d0d4db",
    shadow: "rgba(0,0,0,0.08)",
    bezel: "#c8cdd6",
  },
} as const;

export const spacing = {
  touchTarget: {
    sm: 48,
    md: 56,
    lg: 64,
  },
} as const;

export const timing = {
  micro: 200,
  transition: 400,
  scene: 700,
  idleTimeout: 90_000,
  idleOverlayGrace: 5_000,
} as const;

export const easings = {
  springLike: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

export const viewport = {
  width: 1920,
  height: 1080,
} as const;
