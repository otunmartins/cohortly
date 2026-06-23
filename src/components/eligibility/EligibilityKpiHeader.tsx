import type { EligibilitySummary } from "@/types/eligibility";

interface Props {
  summary: EligibilitySummary;
  modelledPoolPct: number;
}

export function EligibilityKpiHeader({ summary, modelledPoolPct }: Props) {
  const deltaSign = summary.timeToEnrolDelta < 0 ? "" : "+";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-paper-200 border border-paper-200 rounded-lg overflow-hidden shrink-0">
      {/* Combined feasibility */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Combined feasibility
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {modelledPoolPct.toFixed(1)}%
          </span>
          <span className="text-[11px] font-medium text-[oklch(60%_0.18_25)] bg-[oklch(97%_0.03_25)] px-1.5 py-0.5 rounded">
            {summary.poolLabel}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">of UK NASH pool</span>
      </div>

      {/* Projected screen failure */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Projected screen failure
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {summary.screenFailurePct}%
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">
          benchmark {summary.screenFailureBenchmarkLow}–{summary.screenFailureBenchmarkHigh}%
        </span>
      </div>

      {/* Time to enrol */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Time to enrol
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {summary.timeToEnrolMonths} mo
          </span>
          <span
            className={`text-[11px] font-mono font-medium tabular-nums ${
              summary.timeToEnrolDelta <= 0
                ? "text-[oklch(42%_0.14_145)]"
                : "text-[oklch(60%_0.18_25)]"
            }`}
          >
            {deltaSign}{summary.timeToEnrolDelta} vs default
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">
          data as of {summary.dataAsOf}
        </span>
      </div>

      {/* Comparator trials */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Active NASH trials
        </span>
        <div className="flex flex-col gap-0.5 mt-0.5">
          {summary.comparatorTrials.map((t) => (
            <div key={t.nct} className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-[oklch(40%_0.01_240)]">{t.nct}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1 rounded-full bg-paper-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-[oklch(40%_0.01_240)] w-6 text-right">
                  {t.pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
