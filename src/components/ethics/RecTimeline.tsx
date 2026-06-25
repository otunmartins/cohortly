import type { RecMilestone, MilestoneStatus } from "@/types/ethics";
import { CheckCircle2, Circle, Dot } from "lucide-react";

interface Props {
  milestones: RecMilestone[];
}

function milestoneIcon(status: MilestoneStatus) {
  switch (status) {
    case "done":
      return <CheckCircle2 size={12} className="text-green-600 shrink-0" aria-hidden="true" />;
    case "current":
      return <Dot size={16} className="text-brand-500 shrink-0 -mx-0.5" aria-hidden="true" />;
    case "upcoming":
      return <Circle size={12} className="text-[oklch(70%_0.01_240)] shrink-0" aria-hidden="true" />;
  }
}

export function RecTimeline({ milestones }: Props) {
  return (
    <section aria-label="REC review timeline">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] mb-3">
        REC review timeline
      </p>
      <ol className="relative">
        {milestones.map((ms, i) => {
          const isLast = i === milestones.length - 1;
          return (
            <li key={ms.id} className="flex gap-2">
              {/* Connector column */}
              <div className="flex flex-col items-center">
                {milestoneIcon(ms.status)}
                {!isLast && (
                  <div
                    className="w-px flex-1 mt-0.5 mb-0.5"
                    style={{
                      background: ms.status === "done"
                        ? "oklch(50% 0.12 145)"
                        : "oklch(85% 0.01 240)",
                      minHeight: "16px",
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Content */}
              <div className={["pb-3", isLast ? "" : ""].join(" ")}>
                <p className={[
                  "text-[11px] leading-tight",
                  ms.status === "done"
                    ? "text-green-700 font-medium"
                    : ms.status === "current"
                    ? "text-brand-700 font-semibold"
                    : "text-[oklch(35%_0.01_240)]",
                ].join(" ")}>
                  {ms.label}
                </p>
                <p className="text-[10px] text-[oklch(55%_0.01_240)] font-mono mt-0.5">
                  {ms.date}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
