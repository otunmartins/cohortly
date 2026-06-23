"use client";

import type { AuthorityFilter } from "@/types/knowledge";

const AUTHORITIES: AuthorityFilter[] = [
  "FDA", "EMA", "MHRA", "ICH", "Internal", "CT.gov", "PubMed",
];

interface Props {
  selected: AuthorityFilter[];
  onChange: (next: AuthorityFilter[]) => void;
}

export function SourceFilters({ selected, onChange }: Props) {
  function toggle(auth: AuthorityFilter) {
    if (selected.includes(auth)) {
      onChange(selected.filter((a) => a !== auth));
    } else {
      onChange([...selected, auth]);
    }
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] text-[oklch(55%_0.01_240)] font-medium shrink-0">Filters</span>
      {AUTHORITIES.map((auth) => {
        const active = selected.includes(auth);
        return (
          <button
            key={auth}
            type="button"
            onClick={() => toggle(auth)}
            aria-pressed={active}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
              active
                ? "bg-brand-500 text-white"
                : "bg-paper-100 text-[oklch(40%_0.01_240)] hover:bg-paper-200"
            }`}
          >
            {auth}
          </button>
        );
      })}
    </div>
  );
}
