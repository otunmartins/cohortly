import type { IntelKpis } from "@/types/intel";

interface Props {
  kpis: IntelKpis;
}

export function IntelKpiHeader({ kpis }: Props) {
  const {
    activeTrials,
    activeTrialsDelta,
    newApproval,
    poolOverlapPct,
    poolOverlapLabel,
    siteCollisions,
    totalSites,
    regMilestones,
  } = kpis;

  const deltaSign = activeTrialsDelta > 0 ? "+" : "";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-paper-200 border border-paper-200 rounded-lg overflow-hidden shrink-0">
      {/* Active trials */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Active trials
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {activeTrials}
          </span>
          <span className="text-[11px] font-mono font-medium tabular-nums text-[oklch(60%_0.18_25)]">
            {deltaSign}{activeTrialsDelta}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">recruiting globally</span>
      </div>

      {/* New approval */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          New approval
        </span>
        <div className="mt-0.5">
          <span className="text-[12px] font-semibold text-[oklch(20%_0.01_240)] leading-tight">
            {newApproval}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">most recent</span>
      </div>

      {/* Patient pool overlap */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Pool overlap
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {poolOverlapPct}%
          </span>
          <span className="text-[11px] font-medium text-[oklch(60%_0.18_25)] bg-[oklch(97%_0.03_25)] px-1.5 py-0.5 rounded">
            {poolOverlapLabel}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">with UK recruiting trials</span>
      </div>

      {/* Site collisions */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Site collisions
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {siteCollisions}
          </span>
          <span className="text-[11px] text-[oklch(55%_0.01_240)]">
            / {totalSites} sites
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">shared with competing trials</span>
      </div>

      {/* Reg milestones */}
      <div className="bg-paper-50 px-4 py-3 flex flex-col gap-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Reg. milestones
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-display text-[oklch(20%_0.01_240)] tabular-nums leading-none">
            {regMilestones}
          </span>
        </div>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">next 6 months</span>
      </div>
    </div>
  );
}
