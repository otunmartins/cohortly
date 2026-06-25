import type { FeasibilityKpis } from "@/types/feasibility";

function fmtDelta(value: number, prefix = "", suffix = "") {
  const sign = value > 0 ? "+" : "";
  return `${sign}${prefix}${value}${suffix}`;
}

function fmtCost(gbp: number) {
  if (gbp >= 1_000_000) return `£${(gbp / 1_000_000).toFixed(1)}M`;
  if (gbp >= 1_000) return `£${(gbp / 1_000).toFixed(0)}k`;
  return `£${gbp}`;
}

function fmtCostDelta(delta: number) {
  const abs = Math.abs(delta);
  const sign = delta > 0 ? "+" : "−";
  if (abs >= 1_000_000) return `${sign}£${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}£${(abs / 1_000).toFixed(0)}k`;
  return `${sign}£${abs}`;
}

interface Props {
  kpis: FeasibilityKpis;
}

export function FeasibilityKpiHeader({ kpis }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-paper-200 border border-paper-200 rounded-lg overflow-hidden shrink-0">
      {/* Time to N */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Time to N={kpis.targetN}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {kpis.timeToN} mo
          </span>
          <span
            className={`text-[11px] font-mono font-medium tabular-nums ${
              kpis.timeToNDelta <= 0
                ? "text-[oklch(42%_0.14_145)]"
                : "text-[oklch(60%_0.18_25)]"
            }`}
          >
            {fmtDelta(kpis.timeToNDelta, "", " mo")}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">vs sponsor plan</span>
      </div>

      {/* Eligible pool */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Eligible pool
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {kpis.eligiblePoolPct}%
          </span>
          <span className="text-[11px] font-medium text-[oklch(60%_0.18_25)] bg-[oklch(97%_0.03_25)] px-1.5 py-0.5 rounded">
            {kpis.eligiblePoolLabel}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">of screened population</span>
      </div>

      {/* Activation cost */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Activation cost
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {fmtCost(kpis.activationCostGbp)}
          </span>
          <span
            className={`text-[11px] font-mono font-medium tabular-nums ${
              kpis.activationCostDelta <= 0
                ? "text-[oklch(42%_0.14_145)]"
                : "text-[oklch(60%_0.18_25)]"
            }`}
          >
            {fmtCostDelta(kpis.activationCostDelta)}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">estimated total</span>
      </div>

      {/* Probability of success */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Prob. of success
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {kpis.probabilityOfSuccessPct}%
          </span>
          <span
            className={`text-[11px] font-mono font-medium tabular-nums ${
              kpis.probabilityOfSuccessDelta >= 0
                ? "text-[oklch(42%_0.14_145)]"
                : "text-[oklch(60%_0.18_25)]"
            }`}
          >
            {fmtDelta(kpis.probabilityOfSuccessDelta, "", "pp")}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">Monte Carlo estimate</span>
      </div>

      {/* Critical path */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Critical path
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {kpis.criticalPathDays}d
          </span>
          <span
            className={`text-[11px] font-mono font-medium tabular-nums ${
              kpis.criticalPathDelta <= 0
                ? "text-[oklch(42%_0.14_145)]"
                : "text-[oklch(60%_0.18_25)]"
            }`}
          >
            {fmtDelta(kpis.criticalPathDelta, "", "d")}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[oklch(55%_0.01_240)]">
          {kpis.criticalPathLabel}
        </span>
      </div>
    </div>
  );
}
