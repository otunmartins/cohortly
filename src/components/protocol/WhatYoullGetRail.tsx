import { CheckCircle2, BookOpen, Wifi } from "lucide-react";

const SPIRIT_SECTIONS = [
  "Background & rationale",
  "Objectives & endpoints",
  "Study design & schema",
  "Eligibility criteria",
  "Interventions",
  "Outcomes & analysis",
  "Sample size justification",
  "Data management",
  "Ethics & regulatory",
  "Governance & oversight",
];

const SOURCES = [
  { label: "SPIRIT 2013", authority: "Guideline" },
  { label: "ICH E6(R3)", authority: "ICH" },
  { label: "MHRA guidance", authority: "MHRA" },
  { label: "FDA NASH 2023", authority: "FDA" },
  { label: "Internal SOPs", authority: "Internal" },
  { label: "EU CTR 2014/536", authority: "EMA" },
];

export function WhatYoullGetRail() {
  return (
    <aside className="w-[220px] xl:w-[240px] shrink-0 space-y-4">
      {/* What you'll get */}
      <div className="rounded-lg border border-paper-200 bg-paper-50 p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <BookOpen size={12} className="text-brand-500" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(40%_0.01_240)]">
            What you&apos;ll get
          </span>
        </div>

        <p className="text-[11px] font-semibold text-[oklch(15%_0.01_240)] mb-0.5">
          SPIRIT-compliant protocol draft
        </p>
        <p className="text-[10px] text-[oklch(50%_0.01_240)] mb-3">
          ~38–46 pages · 10 sections
        </p>

        <ul className="space-y-1.5">
          {SPIRIT_SECTIONS.map((section, i) => (
            <li key={section} className="flex items-start gap-1.5">
              <CheckCircle2
                size={10}
                className="text-brand-500 mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span className="text-[10px] text-[oklch(35%_0.01_240)]">
                <span className="font-mono text-[9px] text-[oklch(55%_0.01_240)] mr-1">
                  {i + 1}.
                </span>
                {section}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Will reference */}
      <div className="rounded-lg border border-paper-200 bg-paper-50 p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Wifi size={12} className="text-success" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(40%_0.01_240)]">
            Will reference
          </span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-[oklch(93%_0.06_145)] text-[oklch(40%_0.10_145)] font-semibold">
            Live
          </span>
        </div>

        <ul className="space-y-1.5">
          {SOURCES.map(({ label, authority }) => (
            <li key={label} className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-[oklch(25%_0.01_240)] truncate">{label}</span>
              <span className="text-[9px] font-mono text-[oklch(50%_0.01_240)] shrink-0">
                {authority}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
