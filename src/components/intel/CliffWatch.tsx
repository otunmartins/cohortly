import { AlertTriangle } from "lucide-react";
import type { CliffWatchItem } from "@/types/intel";

interface Props {
  items: CliffWatchItem[];
}

export function CliffWatch({ items }: Props) {
  const sorted = [...items].sort((a, b) => a.daysUntil - b.daysUntil);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
        Patent & exclusivity cliff watch
      </h3>
      <div className="flex flex-col divide-y divide-paper-100">
        {sorted.map((item) => {
          const urgent = item.daysUntil < 180;
          return (
            <div key={item.id} className="py-2 flex items-start gap-1.5">
              {urgent ? (
                <AlertTriangle
                  size={11}
                  className="text-[oklch(55%_0.13_75)] mt-0.5 shrink-0"
                  aria-label="Urgent"
                />
              ) : (
                <span className="w-[11px] shrink-0" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-[oklch(20%_0.01_240)] truncate">
                  {item.drug}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                      item.kind === "patent"
                        ? "bg-[oklch(96%_0.02_260)] text-[oklch(38%_0.12_260)]"
                        : "bg-paper-200 text-[oklch(40%_0.01_240)]"
                    }`}
                  >
                    {item.kind === "patent" ? "Patent" : "Exclusivity"}
                  </span>
                  <span className="font-mono text-[9px] text-[oklch(55%_0.01_240)]">
                    {item.date}
                  </span>
                  <span
                    className={`font-mono text-[9px] ${
                      urgent
                        ? "text-[oklch(55%_0.13_75)] font-semibold"
                        : "text-[oklch(55%_0.01_240)]"
                    }`}
                  >
                    {item.daysUntil}d
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
