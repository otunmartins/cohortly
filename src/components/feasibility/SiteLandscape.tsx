"use client";

import { useState } from "react";
import type { FeasibilitySite } from "@/types/feasibility";

type Region = "UK" | "EU" | "US";

const REGION_TABS: { id: Region; label: string }[] = [
  { id: "UK", label: "UK" },
  { id: "EU", label: "EU" },
  { id: "US", label: "US" },
];

interface Props {
  sites: FeasibilitySite[];
}

export function SiteLandscape({ sites }: Props) {
  const [activeRegion, setActiveRegion] = useState<Region>("UK");

  const filtered = sites
    .filter((s) => s.region === activeRegion)
    .slice(0, 12);

  const maxRate = Math.max(...filtered.map((s) => s.projectedPerMonth), 0.1);

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
          Site landscape
        </span>
        <span className="text-[10px] text-[oklch(55%_0.01_240)]">proj. subjects / mo</span>
      </div>

      {/* Region tabs */}
      <div
        role="tablist"
        aria-label="Region"
        className="flex gap-1 bg-paper-100 border border-paper-200 rounded-md p-0.5 shrink-0 self-start"
      >
        {REGION_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeRegion === tab.id}
            onClick={() => setActiveRegion(tab.id)}
            className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors ${
              activeRegion === tab.id
                ? "bg-white text-[oklch(20%_0.01_240)] shadow-sm"
                : "text-[oklch(55%_0.01_240)] hover:text-[oklch(30%_0.01_240)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Site bars */}
      <div className="flex flex-col gap-1.5 overflow-y-auto flex-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-[11px] text-[oklch(55%_0.01_240)]">
            No sites in {activeRegion}
          </div>
        ) : (
          filtered.map((site) => (
            <div key={site.id} className="flex items-center gap-2">
              <div className="w-36 shrink-0">
                <div className="text-[10px] font-medium text-[oklch(25%_0.01_240)] truncate leading-tight">
                  {site.name}
                </div>
                <div className="text-[9px] text-[oklch(55%_0.01_240)]">
                  {site.city}
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-4 bg-paper-100 rounded overflow-hidden">
                  <div
                    className="h-full rounded bg-brand-500 transition-all duration-300"
                    style={{ width: `${(site.projectedPerMonth / maxRate) * 100}%` }}
                    role="meter"
                    aria-valuenow={site.projectedPerMonth}
                    aria-valuemin={0}
                    aria-valuemax={maxRate}
                    aria-label={`${site.name}: ${site.projectedPerMonth} subjects per month`}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-[oklch(30%_0.01_240)] w-7 text-right shrink-0">
                  {site.projectedPerMonth.toFixed(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
