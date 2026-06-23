"use client";

import { useState } from "react";
import type { KbPassage, KbSortOrder } from "@/types/knowledge";
import { SourcePassageCard } from "./SourcePassageCard";

const SORTS: { key: KbSortOrder; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "recency",   label: "Recency" },
  { key: "authority", label: "Authority" },
];

function sortPassages(passages: KbPassage[], order: KbSortOrder): KbPassage[] {
  const copy = [...passages];
  switch (order) {
    case "recency":
      return copy.sort((a, b) => b.date.localeCompare(a.date));
    case "authority":
      return copy.sort((a, b) => a.authority.localeCompare(b.authority));
    default:
      return copy.sort((a, b) => b.score - a.score);
  }
}

interface Props {
  passages: KbPassage[];
}

export function SourcePassageList({ passages }: Props) {
  const [sort, setSort] = useState<KbSortOrder>("relevance");
  const sorted = sortPassages(passages, sort);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(50%_0.01_240)]">
          Source Passages · Ranked
        </h3>
        <div
          className="flex items-center gap-0.5"
          role="tablist"
          aria-label="Sort passages by"
        >
          {SORTS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={sort === key}
              onClick={() => setSort(key)}
              className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                sort === key
                  ? "bg-brand-500 text-white"
                  : "text-[oklch(45%_0.01_240)] hover:bg-paper-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-[12px] text-[oklch(55%_0.01_240)] py-8 text-center">
          No sources matched — broaden filters.
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((p) => (
            <SourcePassageCard key={p.id} passage={p} />
          ))}
        </div>
      )}
    </div>
  );
}
