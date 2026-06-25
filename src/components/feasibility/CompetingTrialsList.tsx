import type { FeasibilityCompetingTrial } from "@/types/feasibility";

interface Props {
  trials: FeasibilityCompetingTrial[];
}

function ThreatBadge({ pct }: { pct: number }) {
  if (pct >= 70) {
    return (
      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(97%_0.03_25)] text-[oklch(48%_0.18_25)]">
        High
      </span>
    );
  }
  if (pct >= 40) {
    return (
      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(98%_0.02_75)] text-[oklch(55%_0.13_75)]">
        Med
      </span>
    );
  }
  return (
    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(97%_0.01_185)] text-[oklch(42%_0.09_185)]">
      Low
    </span>
  );
}

export function CompetingTrialsList({ trials }: Props) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
          Competing trials
        </span>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">
          recruiting NASH F2–F3
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-left border-b border-paper-200">
              <th className="text-[9px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide pb-1.5 pr-2">NCT</th>
              <th className="text-[9px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide pb-1.5 pr-2">Sponsor</th>
              <th className="text-[9px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide pb-1.5 pr-2 text-right">N</th>
              <th className="text-[9px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide pb-1.5 pr-2">Enrolled</th>
              <th className="text-[9px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide pb-1.5">Threat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100">
            {trials.map((trial) => (
              <tr key={trial.nct} className="group hover:bg-paper-50 transition-colors">
                <td className="py-2 pr-2">
                  <span className="font-mono text-[10px] text-brand-700">
                    {trial.nct}
                  </span>
                </td>
                <td className="py-2 pr-2 text-[oklch(25%_0.01_240)] font-medium max-w-[8rem] truncate">
                  {trial.sponsor}
                </td>
                <td className="py-2 pr-2 font-mono tabular-nums text-right text-[oklch(30%_0.01_240)]">
                  {trial.n.toLocaleString()}
                </td>
                <td className="py-2 pr-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-paper-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${trial.enrolledPct}%` }}
                      />
                    </div>
                    <span className="font-mono tabular-nums text-[10px] text-[oklch(30%_0.01_240)] w-7">
                      {trial.enrolledPct}%
                    </span>
                  </div>
                </td>
                <td className="py-2">
                  <ThreatBadge pct={trial.enrolledPct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 text-[9px] text-[oklch(60%_0.01_240)] font-mono">
          Data as of {trials[0]?.dataAsOf ?? "—"} · AACT snapshot
        </div>
      </div>
    </div>
  );
}
