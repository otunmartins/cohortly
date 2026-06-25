import { TrendingUp, ChevronRight } from "lucide-react";
import type { SafetySignal } from "@/types/safety";

interface Props {
  signals: SafetySignal[];
}

const ASSESSMENT_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  possible:   { bg: "bg-[oklch(94%_0.06_75)]",  text: "text-[oklch(42%_0.12_75)]",  dot: "bg-[oklch(65%_0.13_75)]" },
  probable:   { bg: "bg-[oklch(94%_0.10_25)]",  text: "text-[oklch(35%_0.18_25)]",  dot: "bg-[oklch(55%_0.20_25)]" },
  confirmed:  { bg: "bg-[oklch(92%_0.12_25)]",  text: "text-[oklch(30%_0.18_25)]",  dot: "bg-[oklch(42%_0.22_25)]" },
  refuted:    { bg: "bg-paper-100",              text: "text-[oklch(50%_0.01_240)]",  dot: "bg-[oklch(60%_0.01_240)]" },
};

export function SignalDetectionCard({ signals }: Props) {
  if (signals.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp size={11} className="text-[oklch(42%_0.22_25)]" aria-hidden="true" />
        <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
          Signal Detection
        </p>
      </div>
      <div className="space-y-2">
        {signals.map((signal) => {
          const style = ASSESSMENT_STYLES[signal.assessment] ?? ASSESSMENT_STYLES.possible;
          return (
            <div
              key={signal.id}
              className="rounded border border-paper-200 bg-white p-2 space-y-1.5"
              role="article"
              aria-label={`Safety signal: ${signal.term}`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${style.bg} ${style.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
                  {signal.assessment.charAt(0).toUpperCase() + signal.assessment.slice(1)}
                </span>
                <span className="text-[10px] font-semibold text-[oklch(20%_0.01_240)]">
                  {signal.term}
                </span>
              </div>

              <p className="text-[10px] text-[oklch(35%_0.01_240)] leading-snug">{signal.detail}</p>

              <div className="flex items-center gap-3 text-[9px] font-mono text-[oklch(50%_0.01_240)]">
                <span>PRR={signal.prr}</span>
                <span>χ²={signal.chiSquared}</span>
                <span>n={signal.observed} vs exp. ≤{signal.expected}</span>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-[10px] font-medium text-brand-700 hover:text-brand-500 transition-colors mt-0.5"
                aria-label={`Open signal assessment for ${signal.term}`}
              >
                Open assessment
                <ChevronRight size={10} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
