"use client";

import {
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import type { ForecastPoint, MonteCarloSeed } from "@/types/feasibility";
import { RefreshCw } from "lucide-react";

interface Props {
  forecast: ForecastPoint[];
  seed: MonteCarloSeed;
  targetN: number;
  isSimulating: boolean;
  onResimulate: () => void;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-paper-200 rounded-lg shadow-sm px-3 py-2 text-[11px]">
      <div className="font-semibold text-[oklch(30%_0.01_240)] mb-1">Month {label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-[oklch(50%_0.01_240)]">{p.name}:</span>
          <span className="font-mono font-medium text-[oklch(20%_0.01_240)]">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function EnrolmentForecastChart({
  forecast,
  seed,
  targetN,
  isSimulating,
  onResimulate,
}: Props) {
  return (
    <div className="flex flex-col gap-2 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
            Enrolment forecast
          </span>
          <span className="text-[10px] font-mono text-[oklch(55%_0.01_240)] bg-paper-100 border border-paper-200 px-1.5 py-0.5 rounded">
            Seed: {seed.runs.toLocaleString()} Monte Carlo runs
          </span>
        </div>
        <button
          onClick={onResimulate}
          disabled={isSimulating}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw size={11} className={isSimulating ? "animate-spin" : ""} aria-hidden="true" />
          {isSimulating ? "Simulating…" : "Re-simulate"}
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-brand-500 rounded" />
          <span className="text-[10px] text-[oklch(50%_0.01_240)]">P50 (median)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-1 rounded" style={{ background: "oklch(58% 0.10 185 / 0.15)" }} />
          <span className="text-[10px] text-[oklch(50%_0.01_240)]">P10–P90</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 border-t-2 border-dashed border-[oklch(60%_0.13_75)]" />
          <span className="text-[10px] text-[oklch(50%_0.01_240)]">Sponsor plan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 border-t-2 border-dashed border-[oklch(55%_0.01_240)]" />
          <span className="text-[10px] text-[oklch(50%_0.01_240)]">Target</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecast}
            margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(90% 0.005 240)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "oklch(55% 0.01 240)" }}
              tickLine={false}
              axisLine={false}
              label={{ value: "Month", position: "insideBottom", offset: -2, fontSize: 10, fill: "oklch(55% 0.01 240)" }}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: "oklch(55% 0.01 240)" }}
              tickLine={false}
              axisLine={false}
              width={30}
              domain={[0, targetN]}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* 95% CI band */}
            <Area
              type="monotone"
              dataKey="ciHigh"
              stroke="none"
              fill="oklch(58% 0.10 185 / 0.08)"
              legendType="none"
              name="95% CI high"
            />
            <Area
              type="monotone"
              dataKey="ciLow"
              stroke="none"
              fill="white"
              legendType="none"
              name="95% CI low"
            />

            {/* P10–P90 band */}
            <Area
              type="monotone"
              dataKey="p90"
              stroke="oklch(58% 0.10 185 / 0.4)"
              strokeWidth={1}
              fill="oklch(58% 0.10 185 / 0.12)"
              legendType="none"
              name="P90"
            />
            <Area
              type="monotone"
              dataKey="p10"
              stroke="oklch(58% 0.10 185 / 0.4)"
              strokeWidth={1}
              fill="white"
              legendType="none"
              name="P10"
            />

            {/* Sponsor plan */}
            <Line
              type="monotone"
              dataKey="sponsorPlan"
              stroke="oklch(60% 0.13 75)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              name="Sponsor plan"
            />

            {/* Target line */}
            <Line
              type="monotone"
              dataKey="target"
              stroke="oklch(55% 0.01 240)"
              strokeWidth={1.5}
              strokeDasharray="2 4"
              dot={false}
              name="Target"
            />

            {/* P50 median */}
            <Line
              type="monotone"
              dataKey="p50"
              stroke="oklch(58% 0.10 185)"
              strokeWidth={2}
              dot={false}
              name="P50"
            />

            {/* Target N reference line */}
            <ReferenceLine
              y={targetN}
              stroke="oklch(55% 0.01 240)"
              strokeDasharray="2 4"
              strokeWidth={1}
              label={{
                value: `N=${targetN}`,
                position: "right",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "oklch(50% 0.01 240)",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
