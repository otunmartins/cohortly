import type { ComplianceMeter } from "@/types/protocol";

interface Props {
  meters: ComplianceMeter[];
}

export function ComplianceMeters({ meters }: Props) {
  return (
    <section aria-label="Compliance coverage">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[oklch(55%_0.01_240)] mb-2">
        Compliance
      </p>
      <div className="space-y-2">
        {meters.map((m) => {
          const pct = Math.round((m.completed / m.total) * 100);
          const color =
            pct >= 90
              ? "bg-[oklch(58%_0.14_145)]"
              : pct >= 70
              ? "bg-[oklch(72%_0.13_75)]"
              : "bg-[oklch(55%_0.18_25)]";

          return (
            <div key={m.framework}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-medium text-[oklch(30%_0.01_240)] truncate max-w-[100px]">
                  {m.framework}
                </span>
                <span className="text-[10px] font-mono tabular-nums text-[oklch(40%_0.01_240)]">
                  {m.completed}/{m.total}
                </span>
              </div>
              <div
                className="h-1 rounded-full bg-paper-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${m.framework} ${pct}% complete`}
              >
                <div
                  className={`h-full rounded-full transition-all ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
