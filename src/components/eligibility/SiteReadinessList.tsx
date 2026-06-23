import type { EligibilitySite } from "@/types/eligibility";

interface Props {
  sites: EligibilitySite[];
}

export function SiteReadinessList({ sites }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(45%_0.01_240)]">
          Site readiness
        </span>
        <span className="text-[9px] text-[oklch(55%_0.01_240)]">top {sites.length}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {sites.map((site, i) => {
          const barColor =
            site.readiness >= 85
              ? "bg-success"
              : site.readiness >= 70
              ? "bg-warn"
              : "bg-danger";

          const scoreColor =
            site.readiness >= 85
              ? "text-[oklch(42%_0.14_145)]"
              : site.readiness >= 70
              ? "text-[oklch(52%_0.13_75)]"
              : "text-[oklch(48%_0.18_25)]";

          return (
            <div key={site.id} className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-[oklch(65%_0.01_240)] w-3 shrink-0 tabular-nums">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] text-[oklch(20%_0.01_240)] truncate">{site.name}</span>
                  <span className={`text-[10px] font-mono font-semibold tabular-nums shrink-0 ${scoreColor}`}>
                    {site.readiness}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-paper-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${site.readiness}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-[oklch(60%_0.01_240)] shrink-0 w-16 truncate">
                    {site.city}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
