import { ShieldCheck } from "lucide-react";
import type { DocHealthMetric } from "@/types/writing";

interface Props {
  metrics: DocHealthMetric[];
  contentHash: string;
}

function meterColor(value: number, target: number): string {
  const ratio = value / target;
  if (ratio >= 1) return "oklch(55% 0.12 145)";
  if (ratio >= 0.85) return "oklch(65% 0.13 75)";
  return "oklch(55% 0.18 25)";
}

function meterBg(value: number, target: number): string {
  const ratio = value / target;
  if (ratio >= 1) return "oklch(92% 0.06 145)";
  if (ratio >= 0.85) return "oklch(94% 0.06 75)";
  return "oklch(94% 0.04 25)";
}

export function DocHealthRail({ metrics, contentHash }: Props) {
  return (
    <div className="space-y-4">
      {/* Document health meters */}
      <div>
        <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide mb-2">
          Document Health
        </p>
        <div className="space-y-2.5">
          {metrics.map((m) => {
            const bar = Math.min(100, m.value);
            const color = meterColor(m.value, m.target);
            const bg = meterBg(m.value, m.target);
            return (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-[oklch(30%_0.01_240)]">{m.label}</span>
                  <span className="text-[11px] font-semibold font-mono tabular-nums" style={{ color }}>
                    {m.value}{m.unit ? ` ${m.unit}` : "%"}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: bg }}
                  role="progressbar"
                  aria-valuenow={m.value}
                  aria-valuemin={0}
                  aria-valuemax={m.unit ? 100 : 100}
                  aria-label={`${m.label}: ${m.value}${m.unit ? ` ${m.unit}` : "%"}`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${bar}%`, backgroundColor: color }}
                  />
                </div>
                <p className="text-[9px] text-[oklch(60%_0.01_240)] mt-0.5 text-right">
                  target {m.target}{m.unit ? ` ${m.unit}` : "%"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provenance */}
      <div className="border-t border-paper-200 pt-3">
        <div className="flex items-center gap-1.5 mb-2">
          <ShieldCheck size={11} className="text-brand-500" aria-hidden="true" />
          <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
            Provenance
          </p>
        </div>
        <div className="space-y-1.5 text-[10px] text-[oklch(35%_0.01_240)]">
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 shrink-0" aria-hidden="true" />
            <span>21 CFR Part 11 — every edit logged to immutable audit trail</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 shrink-0" aria-hidden="true" />
            <span>Every statement linked to retrieved source</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1 shrink-0" aria-hidden="true" />
            <span>AI outputs require human sign-off before lock</span>
          </div>
        </div>
        <div className="mt-3 p-2 rounded bg-paper-100 border border-paper-200">
          <p className="text-[9px] font-semibold text-[oklch(45%_0.01_240)] mb-0.5">Content hash</p>
          <p
            className="text-[9px] font-mono text-[oklch(35%_0.01_240)] break-all leading-relaxed"
            title={contentHash}
          >
            {contentHash.slice(0, 12)}…{contentHash.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}
