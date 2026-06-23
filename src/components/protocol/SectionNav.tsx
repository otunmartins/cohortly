"use client";

import type { ProtocolSection } from "@/types/protocol";
import { AlertTriangle, CheckCircle2, Circle, FileText } from "lucide-react";

interface Props {
  sections: ProtocolSection[];
  activeSectionId: string;
  onSelect: (id: string) => void;
}

const STATUS_ICON = {
  complete: <CheckCircle2 size={10} className="text-[oklch(52%_0.14_145)] shrink-0" aria-hidden="true" />,
  flagged: <AlertTriangle size={10} className="text-[oklch(62%_0.13_75)] shrink-0" aria-hidden="true" />,
  draft: <FileText size={10} className="text-[oklch(55%_0.01_240)] shrink-0" aria-hidden="true" />,
  empty: <Circle size={10} className="text-[oklch(70%_0.01_240)] shrink-0" aria-hidden="true" />,
};

export function SectionNav({ sections, activeSectionId, onSelect }: Props) {
  return (
    <section aria-label="Protocol sections">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[oklch(55%_0.01_240)] mb-2">
        Protocol sections
      </p>
      <nav>
        <ul className="space-y-0.5">
          {sections.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => onSelect(sec.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`w-full text-left px-2 py-1.5 rounded-md transition-colors group ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-[oklch(30%_0.01_240)] hover:bg-paper-200"
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="mt-px">{STATUS_ICON[sec.status]}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-medium leading-tight truncate ${isActive ? "text-brand-700" : ""}`}>
                        {sec.number}. {sec.heading}
                      </p>
                      {(sec.sourceCount > 0 || sec.flaggedCount > 0 || sec.gapCount > 0) && (
                        <div className="flex flex-wrap gap-x-1 gap-y-0.5 mt-0.5">
                          {sec.sourceCount > 0 && (
                            <span className="text-[9px] font-mono text-[oklch(55%_0.01_240)]">
                              {sec.sourceCount} src
                            </span>
                          )}
                          {sec.flaggedCount > 0 && (
                            <span className="text-[9px] font-mono text-[oklch(58%_0.13_75)]">
                              · {sec.flaggedCount} flagged
                            </span>
                          )}
                          {sec.gapCount > 0 && (
                            <span className="text-[9px] font-mono text-[oklch(50%_0.18_25)]">
                              · {sec.gapCount} gap
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
