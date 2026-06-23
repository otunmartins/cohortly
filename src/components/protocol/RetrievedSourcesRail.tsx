"use client";

import type { RetrievedSource, TaEvidence } from "@/types/protocol";
import { ExternalLink, Copy, Pin } from "lucide-react";

const AUTHORITY_COLOR: Record<string, string> = {
  FDA: "bg-[oklch(92%_0.06_25)] text-[oklch(42%_0.12_25)]",
  EMA: "bg-[oklch(91%_0.05_260)] text-[oklch(40%_0.12_260)]",
  ICH: "bg-[oklch(91%_0.05_145)] text-[oklch(38%_0.12_145)]",
  SPIRIT: "bg-[oklch(92%_0.05_185)] text-[oklch(40%_0.10_185)]",
  Sponsor: "bg-paper-200 text-[oklch(35%_0.01_240)]",
  Internal: "bg-paper-200 text-[oklch(35%_0.01_240)]",
  MHRA: "bg-[oklch(93%_0.05_210)] text-[oklch(38%_0.10_210)]",
};

function authorityBadge(authority: string) {
  const cls = AUTHORITY_COLOR[authority] ?? "bg-paper-200 text-[oklch(35%_0.01_240)]";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${cls}`}>
      {authority}
    </span>
  );
}

interface Props {
  sources: RetrievedSource[];
  taEvidence: TaEvidence;
}

export function RetrievedSourcesRail({ sources, taEvidence }: Props) {
  const topSources = sources.slice(0, 4);
  const rest = sources.slice(4);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(55%_0.01_240)]">
          Retrieved sources
        </h2>
        <span className="text-[10px] font-mono text-[oklch(55%_0.01_240)] bg-paper-200 px-1.5 py-0.5 rounded">
          {sources.length}
        </span>
      </div>

      {/* Top-ranked inline chips */}
      <div className="flex flex-wrap gap-1">
        {topSources.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-50 text-[9px] font-mono text-brand-700"
            title={s.title}
          >
            [{s.n}] {s.authority} · {s.relevanceScore}
          </span>
        ))}
        {rest.length > 0 && (
          <span className="text-[9px] text-[oklch(55%_0.01_240)] px-1 py-0.5">
            +{rest.length} more
          </span>
        )}
      </div>

      {/* Source cards */}
      <div className="space-y-2">
        {sources.slice(0, 6).map((s) => (
          <div key={s.id} className="rounded-md border border-paper-200 bg-white p-2 space-y-1.5 group">
            <div className="flex items-start gap-1.5">
              {authorityBadge(s.authority)}
              <p className="text-[11px] font-medium text-[oklch(20%_0.01_240)] leading-tight flex-1 min-w-0">
                {s.title}
              </p>
            </div>

            {/* Relevance score bar */}
            <div className="flex items-center gap-1.5">
              <div
                className="flex-1 h-1 rounded-full bg-paper-200 overflow-hidden"
                role="progressbar"
                aria-valuenow={s.relevanceScore}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Relevance ${s.relevanceScore}`}
              >
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${s.relevanceScore}%` }}
                />
              </div>
              <span className="text-[9px] font-mono tabular-nums text-[oklch(45%_0.01_240)]">
                {s.relevanceScore}
              </span>
            </div>

            {s.snippet && (
              <p className="text-[10px] text-[oklch(45%_0.01_240)] leading-relaxed line-clamp-2">
                {s.snippet}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                aria-label="Open source"
                className="p-1 rounded hover:bg-paper-200 text-[oklch(55%_0.01_240)] transition-colors"
              >
                <ExternalLink size={10} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Copy citation"
                className="p-1 rounded hover:bg-paper-200 text-[oklch(55%_0.01_240)] transition-colors"
              >
                <Copy size={10} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Pin source"
                className="p-1 rounded hover:bg-paper-200 text-[oklch(55%_0.01_240)] transition-colors"
              >
                <Pin size={10} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* TA Evidence */}
      <div className="rounded-md border border-paper-200 bg-paper-50 p-2.5 space-y-2">
        <p className="text-[10px] font-semibold text-[oklch(30%_0.01_240)]">
          Therapeutic area · NASH
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">Precedent protocols</p>
            <p className="text-[13px] font-semibold font-mono tabular-nums text-[oklch(20%_0.01_240)]">
              {taEvidence.precedentProtocols}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">Similar trials</p>
            <p className="text-[13px] font-semibold font-mono tabular-nums text-[oklch(20%_0.01_240)]">
              {taEvidence.similarTrials}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">Sponsors</p>
            <p className="text-[11px] font-medium text-[oklch(30%_0.01_240)] truncate">
              {taEvidence.sponsors.slice(0, 3).join(" · ")}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">Confidence</p>
            <p className="text-[13px] font-semibold font-mono tabular-nums text-[oklch(20%_0.01_240)]">
              {taEvidence.confidence}%
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[9px] text-[oklch(55%_0.01_240)] mb-0.5">Recruitment</p>
            <div
              className="h-1.5 rounded-full bg-paper-200 overflow-hidden"
              role="progressbar"
              aria-valuenow={taEvidence.recruitment}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Recruitment ${taEvidence.recruitment}%`}
            >
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${taEvidence.recruitment}%` }}
              />
            </div>
            <p className="text-[9px] font-mono text-[oklch(55%_0.01_240)] mt-0.5">
              {taEvidence.recruitment}% median enrolment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
