import { AlertCircle, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ConsistencyIssue, ConsistencySeverity } from "@/types/writing";

interface Props {
  issues: ConsistencyIssue[];
}

function severityIcon(severity: ConsistencySeverity) {
  switch (severity) {
    case "error":
      return <AlertCircle size={11} className="text-[oklch(50%_0.18_25)] shrink-0" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle size={11} className="text-[oklch(65%_0.13_75)] shrink-0" aria-hidden="true" />;
    default:
      return <CheckCircle2 size={11} className="text-[oklch(55%_0.12_145)] shrink-0" aria-hidden="true" />;
  }
}

const KIND_LABELS: Record<string, string> = {
  "cross-module": "Cross-module",
  "terminology": "Terminology / MedDRA",
  "reference": "References",
  "numbering": "Numbering",
};

export function ConsistencyCheck({ issues }: Props) {
  const [expanded, setExpanded] = useState<string | null>("ci1");

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;

  return (
    <div>
      <div className="flex items-center justify-between px-2 mb-1.5">
        <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
          Consistency
        </p>
        <div className="flex items-center gap-1.5">
          {errors > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold bg-[oklch(95%_0.04_25)] text-[oklch(45%_0.18_25)]">
              {errors} error{errors > 1 ? "s" : ""}
            </span>
          )}
          {warnings > 0 && (
            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-semibold bg-[oklch(96%_0.05_75)] text-[oklch(50%_0.12_75)]">
              {warnings} warn
            </span>
          )}
        </div>
      </div>
      <div className="space-y-0.5">
        {issues.map((issue) => (
          <div key={issue.id} className="rounded border border-paper-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded(expanded === issue.id ? null : issue.id)}
              aria-expanded={expanded === issue.id}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 bg-paper-50 hover:bg-paper-100 transition-colors text-left"
            >
              {severityIcon(issue.severity)}
              <span className="text-[10px] font-medium text-[oklch(25%_0.01_240)] flex-1 truncate">
                {issue.label}
              </span>
              <span className="text-[9px] text-[oklch(55%_0.01_240)] font-mono truncate hidden sm:block">
                {KIND_LABELS[issue.kind] ?? issue.kind}
              </span>
              <ChevronDown
                size={10}
                aria-hidden="true"
                className={`shrink-0 text-[oklch(55%_0.01_240)] transition-transform ${expanded === issue.id ? "rotate-180" : ""}`}
              />
            </button>
            {expanded === issue.id && issue.detail && (
              <p className="px-2.5 py-2 text-[10px] text-[oklch(35%_0.01_240)] leading-relaxed border-t border-paper-200 bg-white">
                {issue.detail}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
