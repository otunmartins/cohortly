import type { KpiMetric } from "@/types/dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const positive = metric.delta > 0;
  const neutral = metric.delta === 0;

  return (
    <div className="bg-paper-50 border border-paper-200 rounded-lg p-3.5 flex flex-col gap-1.5">
      <span className="text-[10px] text-[oklch(50%_0.01_240)] uppercase tracking-wide font-medium">
        {metric.label}
      </span>

      <div className="flex items-end gap-2">
        <span className="font-display text-[28px] leading-none text-[oklch(15%_0.01_240)] tabular-nums">
          {metric.value}
        </span>
        {!neutral && (
          <div
            className={`flex items-center gap-0.5 mb-0.5 ${
              positive ? "text-success" : "text-danger"
            }`}
          >
            {positive ? (
              <TrendingUp size={11} aria-hidden="true" />
            ) : (
              <TrendingDown size={11} aria-hidden="true" />
            )}
            <span className="text-[10px] font-mono font-semibold tabular-nums">
              {positive ? "+" : ""}
              {metric.delta}
            </span>
          </div>
        )}
      </div>

      <span className="text-[10px] text-[oklch(50%_0.01_240)]">{metric.subtext}</span>
    </div>
  );
}
