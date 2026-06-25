"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { CompetingTrial, ThreatLevel } from "@/types/intel";

type Tab = "all" | "phase3" | "phase2" | "uk";

function ThreatBadge({ threat }: { threat: ThreatLevel }) {
  const configs: Record<ThreatLevel, { bg: string; dot: string; text: string; label: string }> = {
    high:   { bg: "bg-[oklch(97%_0.03_25)]",  dot: "bg-[oklch(48%_0.18_25)]",  text: "text-[oklch(48%_0.18_25)]",  label: "High" },
    medium: { bg: "bg-[oklch(98%_0.02_75)]",  dot: "bg-[oklch(55%_0.13_75)]",  text: "text-[oklch(55%_0.13_75)]",  label: "Med"  },
    low:    { bg: "bg-[oklch(97%_0.01_185)]", dot: "bg-[oklch(42%_0.09_185)]", text: "text-[oklch(42%_0.09_185)]", label: "Low"  },
  };
  const c = configs[threat];
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${c.dot}`} aria-hidden="true" />
      {c.label}
    </span>
  );
}

interface Props {
  trials: CompetingTrial[];
}

export function CompetingTrialsTable({ trials }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");

  const byPhase3  = trials.filter((t) => t.phase === "Phase III");
  const byPhase2  = trials.filter((t) => t.phase === "Phase II");
  const byUk      = trials.filter((t) => t.ukOverlap);

  const tabFiltered =
    activeTab === "phase3" ? byPhase3 :
    activeTab === "phase2" ? byPhase2 :
    activeTab === "uk"     ? byUk     :
    trials;

  const lq = query.trim().toLowerCase();
  const filtered = lq
    ? tabFiltered.filter(
        (t) =>
          t.name.toLowerCase().includes(lq) ||
          t.sponsor.toLowerCase().includes(lq) ||
          t.nct.toLowerCase().includes(lq),
      )
    : tabFiltered;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all",    label: "All",        count: trials.length    },
    { key: "phase3", label: "Phase III",  count: byPhase3.length  },
    { key: "phase2", label: "Phase II",   count: byPhase2.length  },
    { key: "uk",     label: "UK overlap", count: byUk.length      },
  ];

  const dataAsOf = trials[0]?.dataAsOf ?? "—";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tabs + filter */}
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-0" role="tablist" aria-label="Filter trials by phase">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(20%_0.01_240)]"
              }`}
            >
              {t.label}
              <span
                className={`ml-1.5 text-[9px] font-semibold px-1 py-0.5 rounded ${
                  activeTab === t.key
                    ? "bg-brand-100 text-brand-700"
                    : "bg-paper-200 text-[oklch(50%_0.01_240)]"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-40 shrink-0">
          <Search
            size={11}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[oklch(55%_0.01_240)] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter trials…"
            aria-label="Filter trials"
            className="w-full pl-6 pr-2 py-1 text-[11px] bg-paper-100 border border-paper-200 rounded-md placeholder:text-[oklch(60%_0.01_240)] text-[oklch(20%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto border border-paper-200 rounded-lg bg-white">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-[11px] text-[oklch(55%_0.01_240)]">
            No trials match this filter.
          </div>
        ) : (
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-paper-200 bg-paper-50 sticky top-0 z-10">
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-28">NCT ID</th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)]">Trial / Sponsor</th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-20">Phase</th>
                <th className="px-3 py-1.5 text-right text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-16">N</th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-40">Enrolled</th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-16">Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-100">
              {filtered.map((trial) => (
                <tr key={trial.nct} className="hover:bg-paper-50 transition-colors">
                  <td className="px-3 py-2">
                    <span className="font-mono text-[10px] text-brand-700">{trial.nct}</span>
                  </td>
                  <td className="px-3 py-2 max-w-[14rem]">
                    <div className="font-medium text-[oklch(20%_0.01_240)] truncate">{trial.name}</div>
                    <div className="text-[10px] text-[oklch(50%_0.01_240)] truncate">{trial.sponsor}</div>
                  </td>
                  <td className="px-3 py-2 text-[oklch(40%_0.01_240)]">{trial.phase}</td>
                  <td className="px-3 py-2 font-mono tabular-nums text-right text-[oklch(30%_0.01_240)]">
                    {trial.n.toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-16 h-1.5 bg-paper-200 rounded-full overflow-hidden shrink-0"
                        role="progressbar"
                        aria-valuenow={trial.enrolledPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${trial.enrolledPct}% enrolled`}
                      >
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${trial.enrolledPct}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-[10px] text-[oklch(30%_0.01_240)]">
                        {trial.enrolledPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <ThreatBadge threat={trial.threat} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="px-3 py-2 text-[9px] font-mono text-[oklch(60%_0.01_240)] border-t border-paper-100">
          Data as of {dataAsOf} · AACT snapshot (read-only)
        </div>
      </div>
    </div>
  );
}
