import type { DomainTag } from "@/types/inbox";

const CONFIG: Record<DomainTag, string> = {
  Protocol:    "bg-brand-50 text-brand-700",
  "Reg Writing": "bg-[oklch(95%_0.04_280)] text-[oklch(38%_0.12_280)]",
  Regulator:   "bg-accent-50 text-accent-700",
  Eligibility: "bg-brand-50 text-brand-700",
  Safety:      "bg-[oklch(95%_0.07_25)] text-[oklch(42%_0.18_25)]",
  Ethics:      "bg-[oklch(95%_0.05_145)] text-[oklch(38%_0.14_145)]",
};

export function DomainBadge({ tag }: { tag: DomainTag }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide whitespace-nowrap ${CONFIG[tag]}`}
    >
      {tag}
    </span>
  );
}
