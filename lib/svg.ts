/**
 * SVG path helpers shared by chart primitives. Centralizes the
 * `polylinePath` + `bezierPath` (Catmull-Rom) implementations that were
 * duplicated across `AreaChart`, `LineChart` and `Sparkline`.
 */

export interface SvgPoint {
  x: number;
  y: number;
}

/** Straight polyline `M x y L x y …`. */
export function polylinePath(pts: SvgPoint[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}

/**
 * Smooth Catmull-Rom-like path. `tension` controls the curvature of the
 * bezier handles (0 = straight lines, 0.5 = strongly rounded). Default
 * `0.18` matches the value used historically across the charts.
 */
export function bezierPath(pts: SvgPoint[], tension = 0.18): string {
  if (pts.length < 2) return "";
  if (pts.length === 2)
    return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}
