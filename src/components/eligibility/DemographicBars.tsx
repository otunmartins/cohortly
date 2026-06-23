import type { DemographicItem } from "@/types/eligibility";

interface Props {
  demographics: DemographicItem[];
}

export function DemographicBars({ demographics }: Props) {
  const anyUnmet = demographics.some((d) => d.modelled < d.fdaTarget);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(45%_0.01_240)]">
          Demographic representation
        </span>
        <span className="text-[9px] text-[oklch(55%_0.01_240)]">vs FDA Diversity Plan</span>
      </div>

      {anyUnmet && (
        <div className="rounded border border-[oklch(88%_0.06_25)] bg-[oklch(98%_0.02_25)] px-2.5 py-1.5 text-[10px] text-[oklch(45%_0.15_25)]">
          {demographics.filter((d) => d.modelled < d.fdaTarget).length} group
          {demographics.filter((d) => d.modelled < d.fdaTarget).length > 1 ? "s" : ""} below FDA
          Diversity Plan threshold
        </div>
      )}

      <div className="flex flex-col gap-2">
        {demographics.map((d) => {
          const met = d.modelled >= d.fdaTarget;
          return (
            <div key={d.group} className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[oklch(30%_0.01_240)]">{d.group}</span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    met
                      ? "text-[oklch(42%_0.14_145)]"
                      : "text-[oklch(48%_0.18_25)]"
                  }`}
                >
                  {d.modelled}%
                </span>
              </div>
              {/* Stacked bar */}
              <div className="relative h-2 rounded-full bg-paper-200 overflow-hidden">
                {/* FDA target marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-[oklch(50%_0.01_240)] z-10"
                  style={{ left: `${d.fdaTarget}%` }}
                  aria-hidden="true"
                />
                {/* Modelled bar */}
                <div
                  className={`h-full rounded-full transition-all ${met ? "bg-success" : "bg-danger"}`}
                  style={{ width: `${d.modelled}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-[9px] text-[oklch(60%_0.01_240)]">
                  target {d.fdaTarget}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
