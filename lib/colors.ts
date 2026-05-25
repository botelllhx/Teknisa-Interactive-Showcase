/**
 * Color helpers reusable by the chart primitives and any other surface
 * that needs to derive a tint from a base color. Centralized to remove
 * the `lighten()` duplication between `HorizontalBars` and `StackedBars`.
 */

/**
 * Lighten a hex color by a fraction (0..1). For non-hex inputs
 * (`rgb(...)`, `rgba(...)`, named colors) returns the input untouched.
 */
export function lighten(color: string, amount: number): string {
  if (!color.startsWith("#")) return color;
  const hex = color.replace("#", "");
  const num = parseInt(
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex,
    16,
  );
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const clamp = Math.min(1, Math.max(0, amount));
  const mix = (v: number) => Math.round(v + (255 - v) * clamp);
  const rr = mix(r).toString(16).padStart(2, "0");
  const gg = mix(g).toString(16).padStart(2, "0");
  const bb = mix(b).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`;
}
