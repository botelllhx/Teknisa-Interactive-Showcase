import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
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
        },
        frame: {
          body: "#e2e5ea",
          screen: "#d0d4db",
          bezel: "#c8cdd6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Sora", "sans-serif"],
        ui: ["var(--font-ui)", "Roboto", "sans-serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem", { lineHeight: "1.05", fontWeight: "700" }],
        "display-xl": ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        "display-lg": ["2.5rem", { lineHeight: "1.15", fontWeight: "600" }],
        "heading-xl": ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        "heading-lg": ["1.375rem", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.55", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.55", fontWeight: "400" }],
        "label-sm": ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      boxShadow: {
        frame: "0 20px 60px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)",
        card: "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 28px rgba(2,7,136,0.12)",
        brand: "0 4px 20px rgba(2,7,136,0.25)",
      },
      borderRadius: {
        frame: "20px",
        "frame-inner": "14px",
        device: "28px",
      },
      screens: {
        tv: "1920px",
      },
    },
  },
  plugins: [],
};
export default config;
