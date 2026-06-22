"use client";

import { useState } from "react";
import type { ReviewItem } from "@/types/dashboard";
import { ReviewQueueRow } from "./ReviewQueueRow";

type Tab = "all" | "protocol" | "reg_writing" | "safety";

const TABS: { value: Tab; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "protocol",    label: "Protocols" },
  { value: "reg_writing", label: "Reg. writing" },
  { value: "safety",      label: "Safety" },
];

export function ReviewQueue({ items }: { items: ReviewItem[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = tab === "all" ? items : items.filter((i) => i.type === tab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-paper-200 mb-1" role="tablist">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`px-3 py-2 text-[11px] font-medium border-b-2 -mb-px transition-colors ${
              tab === value
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(30%_0.01_240)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-[11px] text-[oklch(55%_0.01_240)]">
          Your queue is clear
        </p>
      ) : (
        <div role="tabpanel">
          {filtered.map((item) => (
            <ReviewQueueRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
