"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  AreaChart as RcAreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

interface RechartsAreaProps {
  data: { x: string; y: number }[];
  color?: string;
  yMin?: number;
  yMax?: number;
  formatY?: (v: number) => string;
  referenceY?: number;
  referenceLabel?: string;
  showXLabels?: boolean;
  showYLabels?: boolean;
  /** Number of Y ticks. Default 4. */
  yTicks?: number;
  /** Optional unit label (e.g. "refeições", "%"). Shown in tooltip. */
  unit?: string;
}

/**
 * v13.25 — Recharts-based brand area chart. Built specifically for the
 * places where rich hover tooltips add real value (forecast, CMV dashboard).
 * Mirrors the visual language of the custom AreaChart (gradient fill,
 * brand stroke, rounded values, optional reference line) but routes the
 * rendering through Recharts so hover interaction and resize handling
 * come for free.
 *
 * Use this for MAIN dashboard charts where the user wants to inspect
 * values. For sparklines/KPI strips, prefer the lightweight custom
 * AreaChart — Recharts adds bundle weight that's wasted on tiny charts.
 */
export function RechartsArea({
  data,
  color = "#7c3aed",
  yMin,
  yMax,
  formatY = (v) => v.toLocaleString("pt-BR"),
  referenceY,
  referenceLabel,
  showXLabels = true,
  showYLabels = false,
  yTicks = 4,
  unit,
}: RechartsAreaProps) {
  const uid = useId().replace(/:/g, "");
  const gid = `rc-area-${uid}`;

  // Compute Y domain. If yMin/yMax not provided, let Recharts auto-fit.
  const domain: [number | "auto", number | "auto"] = [
    yMin ?? "auto",
    yMax ?? "auto",
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RcAreaChart
        data={data}
        margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.30} />
            <stop offset="55%" stopColor={color} stopOpacity={0.10} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="rgba(0,0,0,0.05)"
          strokeDasharray="3 3"
          vertical={false}
        />

        {showXLabels ? (
          <XAxis
            dataKey="x"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{
              fontSize: 10.5,
              fill: "#9ca3af",
              fontFamily: "var(--font-ui)",
            }}
            tickMargin={6}
          />
        ) : (
          <XAxis dataKey="x" hide />
        )}

        {showYLabels ? (
          <YAxis
            domain={domain}
            axisLine={false}
            tickLine={false}
            tickCount={yTicks}
            tick={{
              fontSize: 10,
              fill: "#9ca3af",
              fontFamily: "var(--font-ui)",
            }}
            tickFormatter={formatY}
            width={42}
          />
        ) : (
          <YAxis domain={domain} hide />
        )}

        {referenceY !== undefined && (
          <ReferenceLine
            y={referenceY}
            stroke="rgba(2,7,136,0.35)"
            strokeDasharray="4 4"
            strokeWidth={1.25}
            label={
              referenceLabel
                ? {
                    value: referenceLabel,
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#020788",
                    fontFamily: "var(--font-ui)",
                    fontWeight: 700,
                  }
                : undefined
            }
          />
        )}

        <Tooltip
          content={(props) => (
            <BrandTooltip
              active={props.active ?? false}
              payload={
                Array.isArray(props.payload)
                  ? (props.payload as { value?: unknown }[])
                  : []
              }
              label={props.label as string | number | undefined}
              formatY={formatY}
              color={color}
              unit={unit}
            />
          )}
          cursor={{
            stroke: color,
            strokeWidth: 1.25,
            strokeDasharray: "3 3",
          }}
        />

        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          strokeWidth={2.25}
          fill={`url(#${gid})`}
          activeDot={{
            r: 5,
            strokeWidth: 2,
            stroke: "white",
            fill: color,
          }}
          isAnimationActive={true}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </RcAreaChart>
    </ResponsiveContainer>
  );
}

interface BrandTooltipProps {
  active: boolean;
  payload: { value?: unknown }[];
  label?: string | number;
  formatY: (v: number) => string;
  color: string;
  unit?: string;
}

function BrandTooltip({ active, payload, label, formatY, color, unit }: BrandTooltipProps) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  if (typeof v !== "number") return null;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(8px)",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow:
          "0 6px 20px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
        fontFamily: "var(--font-ui)",
        minWidth: 90,
      }}
    >
      <p
        style={{
          fontSize: 9.5,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: "#9ca3af",
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        style={{
          marginTop: 2,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: color,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatY(v)}
      </p>
      {unit && (
        <p
          style={{
            marginTop: 1,
            fontSize: 10,
            fontWeight: 500,
            color: "#9ca3af",
            letterSpacing: "-0.005em",
          }}
        >
          {unit}
        </p>
      )}
    </div>
  );
}
