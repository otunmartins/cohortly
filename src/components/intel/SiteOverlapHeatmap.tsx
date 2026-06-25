"use client";

import { useState } from "react";
import type { SiteOverlapData } from "@/types/intel";

function cellStyle(count: number): string {
  if (count === 0) return "bg-paper-100 text-[oklch(60%_0.01_240)]";
  if (count === 1) return "bg-[oklch(96%_0.04_25)] text-[oklch(55%_0.18_25)]";
  if (count === 2) return "bg-[oklch(93%_0.07_25)] text-[oklch(50%_0.18_25)]";
  return "bg-[oklch(88%_0.10_25)] text-[oklch(42%_0.18_25)]";
}

const LEGEND = [
  { count: 0, label: "None"   },
  { count: 1, label: "Low"    },
  { count: 2, label: "Medium" },
  { count: 3, label: "High"   },
] as const;

interface Props {
  data: SiteOverlapData;
}

export function SiteOverlapHeatmap({ data }: Props) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null);
  const { yourSites, competitorNames, cells, atRiskCount } = data;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
            Site overlap analysis (UK)
          </h3>
          <p className="text-[10px] text-[oklch(55%_0.01_240)] mt-0.5">
            Your {yourSites.length} sites vs competing trials · cells show enrolled patient overlap risk
          </p>
        </div>
        {atRiskCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[oklch(97%_0.03_25)] border border-[oklch(92%_0.07_25)] rounded-md">
            <span className="text-[10px] font-semibold text-[oklch(48%_0.18_25)]">
              {atRiskCount} sites at risk
            </span>
          </div>
        )}
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr>
              <th className="text-left px-3 py-1.5 text-[9px] font-semibold text-[oklch(50%_0.01_240)] uppercase tracking-wide w-44">
                Competitor
              </th>
              {yourSites.map((site) => (
                <th
                  key={site}
                  className="text-center px-2 py-1.5 text-[9px] font-semibold text-[oklch(50%_0.01_240)] uppercase tracking-wide min-w-[88px]"
                >
                  {site}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100">
            {competitorNames.map((name, ri) => (
              <tr key={name}>
                <td className="px-3 py-2 text-[11px] font-medium text-[oklch(25%_0.01_240)] max-w-[11rem] truncate">
                  {name}
                </td>
                {cells[ri].map((count, ci) => {
                  const isHovered = hovered?.row === ri && hovered?.col === ci;
                  return (
                    <td key={ci} className="px-2 py-1.5 text-center">
                      <button
                        onClick={() => {
                          /* stub: navigate to trial/site detail */
                        }}
                        onMouseEnter={() => setHovered({ row: ri, col: ci })}
                        onMouseLeave={() => setHovered(null)}
                        aria-label={`${name} × ${yourSites[ci]}: overlap score ${count}`}
                        className={`w-10 h-8 rounded font-mono text-[11px] font-semibold tabular-nums transition-all ${cellStyle(count)} ${
                          isHovered ? "ring-2 ring-brand-500 ring-offset-1 scale-105" : ""
                        }`}
                      >
                        {count}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] text-[oklch(55%_0.01_240)]">Overlap risk:</span>
        {LEGEND.map(({ count, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-mono font-semibold ${cellStyle(count)}`}
            >
              {count}
            </div>
            <span className="text-[9px] text-[oklch(55%_0.01_240)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
