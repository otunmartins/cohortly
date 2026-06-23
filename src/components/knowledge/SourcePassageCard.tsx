import { ExternalLink, Copy, Pin } from "lucide-react";
import type { KbPassage } from "@/types/knowledge";

const AUTHORITY_COLORS: Record<string, string> = {
  FDA:      "bg-[oklch(94%_0.06_25)] text-[oklch(42%_0.18_25)]",
  EMA:      "bg-[oklch(94%_0.04_280)] text-[oklch(38%_0.12_280)]",
  MHRA:     "bg-brand-50 text-brand-700",
  ICH:      "bg-[oklch(94%_0.05_145)] text-[oklch(38%_0.14_145)]",
  Internal: "bg-accent-50 text-accent-700",
  "CT.gov": "bg-paper-200 text-[oklch(38%_0.01_240)]",
  PubMed:   "bg-paper-200 text-[oklch(38%_0.01_240)]",
};

interface Props {
  passage: KbPassage;
}

export function SourcePassageCard({ passage }: Props) {
  const scorePercent = Math.round(passage.score * 100);
  const authorityClass = AUTHORITY_COLORS[passage.authority] ?? "bg-paper-200 text-[oklch(38%_0.01_240)]";

  return (
    <div className="border border-paper-200 rounded-lg p-3 bg-white hover:border-brand-500/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[10px] font-bold text-[oklch(45%_0.01_240)]">
            {passage.n}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide ${authorityClass}`}>
            {passage.authority}
          </span>
          <span className="text-[10px] text-[oklch(50%_0.01_240)]">{passage.kind}</span>
          <span className="text-[10px] text-[oklch(55%_0.01_240)] font-mono">{passage.date}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1" aria-label={`Relevance score ${scorePercent}%`}>
            <div className="w-8 h-1 rounded-full bg-paper-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-[oklch(45%_0.01_240)] tabular-nums">
              {passage.score.toFixed(2)}
            </span>
          </div>
          <span className="text-[9px] text-[oklch(55%_0.01_240)]">
            ×{passage.citedCount} cited
          </span>
        </div>
      </div>

      <p className="text-[11px] text-[oklch(25%_0.01_240)] leading-relaxed mb-2.5 line-clamp-3">
        {passage.snippet}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Open source document"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[oklch(45%_0.01_240)] hover:bg-paper-100 transition-colors"
        >
          <ExternalLink size={10} aria-hidden="true" />
          Open source
        </button>
        <button
          type="button"
          aria-label="Copy citation"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[oklch(45%_0.01_240)] hover:bg-paper-100 transition-colors"
        >
          <Copy size={10} aria-hidden="true" />
          Copy citation
        </button>
        <button
          type="button"
          aria-label="Pin to project"
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-[oklch(45%_0.01_240)] hover:bg-paper-100 transition-colors"
        >
          <Pin size={10} aria-hidden="true" />
          Pin to project
        </button>
      </div>
    </div>
  );
}
