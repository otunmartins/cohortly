import type { HraCheck, HraCheckStatus, HraGap } from "@/types/ethics";
import { CheckCircle2, AlertTriangle, Minus, Zap } from "lucide-react";

interface Props {
  checks: HraCheck[];
  gap: HraGap;
  onGenerateFromProtocol: () => void;
}

function statusIcon(status: HraCheckStatus) {
  switch (status) {
    case "pass":
      return <CheckCircle2 size={11} className="text-green-600 shrink-0 mt-0.5" aria-hidden="true" />;
    case "warn":
      return <AlertTriangle size={11} className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />;
    case "n-a":
      return <Minus size={11} className="text-[oklch(60%_0.01_240)] shrink-0 mt-0.5" aria-hidden="true" />;
  }
}

function statusLabel(status: HraCheckStatus) {
  switch (status) {
    case "pass": return "Pass";
    case "warn": return "Warn";
    case "n-a":  return "N/A";
  }
}

export function HraComplianceRail({ checks, gap, onGenerateFromProtocol }: Props) {
  return (
    <section aria-label="HRA compliance check">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] mb-2">
        HRA compliance check
      </p>
      <ul className="space-y-2">
        {checks.map((c) => (
          <li key={c.id} className="flex items-start gap-1.5">
            {statusIcon(c.status)}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-[oklch(25%_0.01_240)] leading-snug">{c.framework}</p>
              {c.note && (
                <p className="text-[10px] text-amber-700 mt-0.5 leading-snug">{c.note}</p>
              )}
            </div>
            <span className={[
              "text-[9px] font-medium px-1 py-0.5 rounded shrink-0",
              c.status === "pass"
                ? "bg-green-50 text-green-700"
                : c.status === "warn"
                ? "bg-amber-50 text-amber-700"
                : "bg-paper-100 text-[oklch(55%_0.01_240)]",
            ].join(" ")}>
              {statusLabel(c.status)}
            </span>
          </li>
        ))}
      </ul>

      {/* Gap callout */}
      <div className="mt-3 p-2 rounded-md border border-amber-200 bg-amber-50">
        <p className="text-[11px] text-amber-800 leading-snug">{gap.message}</p>
        <button
          onClick={onGenerateFromProtocol}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-500 transition-colors"
        >
          <Zap size={10} aria-hidden="true" />
          {gap.action}
        </button>
      </div>
    </section>
  );
}
