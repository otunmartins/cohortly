"use client";

import { useState } from "react";
import type { SafetyNarrative, NarrativeTab, CrfHighlight } from "@/types/safety";
import { AIDraftBlock } from "@/components/shared/AIDraftBlock";
import { Confidence } from "@/components/shared/Confidence";
import { acceptNarrativeSuggestion, rejectNarrativeSuggestion } from "@/actions/safety";

interface Props {
  narrative: SafetyNarrative;
  subjectRef: string;
}

function HighlightedText({
  text,
  highlights,
}: {
  text: string;
  highlights: CrfHighlight[];
}) {
  if (highlights.length === 0) {
    return <span>{text}</span>;
  }

  type Segment = { text: string; highlight?: CrfHighlight };
  const segments: Segment[] = [];
  let remaining = text;
  let cursor = 0;

  const sorted = [...highlights].sort((a, b) => {
    const ia = text.indexOf(a.text, cursor);
    const ib = text.indexOf(b.text, cursor);
    return ia - ib;
  });

  for (const hl of sorted) {
    const idx = remaining.indexOf(hl.text);
    if (idx === -1) continue;
    if (idx > 0) segments.push({ text: remaining.slice(0, idx) });
    segments.push({ text: hl.text, highlight: hl });
    remaining = remaining.slice(idx + hl.text.length);
    cursor += idx + hl.text.length;
  }
  if (remaining) segments.push({ text: remaining });

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark
            key={i}
            title={`CRF field: ${seg.highlight.field}`}
            className="rounded bg-[oklch(92%_0.10_75)] text-[oklch(30%_0.12_75)] px-0.5 not-italic"
            aria-label={`CRF field: ${seg.highlight.field}`}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}

const TABS: { id: NarrativeTab; label: string }[] = [
  { id: "narrative", label: "Narrative" },
  { id: "timeline", label: "Timeline" },
  { id: "labs", label: "Labs" },
];

export function NarrativeEditor({ narrative, subjectRef }: Props) {
  const [activeTab, setActiveTab] = useState<NarrativeTab>("narrative");
  const [showAiBlock, setShowAiBlock] = useState(true);

  async function handleAccept() {
    await acceptNarrativeSuggestion(narrative.id);
    setShowAiBlock(false);
  }

  async function handleReject() {
    await rejectNarrativeSuggestion(narrative.id);
    setShowAiBlock(false);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      {/* Narrative meta bar */}
      <div className="shrink-0 border-b border-paper-200 bg-white px-5 py-2">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div>
            <h1 className="text-[14px] font-semibold text-[oklch(12%_0.01_240)]">
              SAE Narrative · Subject {subjectRef}
            </h1>
            <p className="text-[10px] text-[oklch(55%_0.01_240)]">
              Sponsor template · regulatory style guide · {narrative.sourceFieldCount} source fields · template v{narrative.templateVersion}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Confidence value={narrative.confidence} />
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[oklch(94%_0.06_75)] text-[oklch(42%_0.12_75)] text-[9px] font-semibold">
              AI-drafted
            </span>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex gap-0" role="tablist" aria-label="Narrative sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`narrative-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-[11px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(25%_0.01_240)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab panels */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Narrative tab */}
        <div
          id="narrative-panel-narrative"
          role="tabpanel"
          aria-label="Narrative"
          hidden={activeTab !== "narrative"}
        >
          {activeTab === "narrative" && (
            <div className="px-8 py-6 space-y-4 max-w-3xl">
              {narrative.paragraphs.map((para) => (
                <p key={para.id} className="text-[13px] leading-relaxed text-[oklch(12%_0.01_240)]">
                  <HighlightedText text={para.text} highlights={para.highlights} />
                </p>
              ))}

              {/* AI accept/reject block */}
              {showAiBlock && (
                <AIDraftBlock
                  text="Medical sign-off is required before this narrative can be filed. Review each highlighted CRF field for accuracy and completeness before approving."
                  confidence={narrative.confidence}
                  sourceCount={narrative.sourceFieldCount}
                  modelVersion={narrative.modelVersion}
                  tag="Sign-off reminder"
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              )}
            </div>
          )}
        </div>

        {/* Timeline tab */}
        <div
          id="narrative-panel-timeline"
          role="tabpanel"
          aria-label="Timeline"
          hidden={activeTab !== "timeline"}
        >
          {activeTab === "timeline" && (
            <div className="px-8 py-6">
              <ol className="relative border-l-2 border-paper-200 space-y-6 ml-3">
                {narrative.timelineEntries.map((entry, i) => (
                  <li key={i} className="pl-5 relative">
                    <span
                      className={`absolute -left-2.5 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                        entry.flagged ? "bg-[oklch(55%_0.20_25)]" : "bg-brand-500"
                      }`}
                      aria-hidden="true"
                    />
                    <p className="text-[10px] font-mono text-[oklch(50%_0.01_240)] mb-0.5">{entry.date}</p>
                    <p className="text-[12px] font-semibold text-[oklch(15%_0.01_240)]">{entry.event}</p>
                    {entry.detail && (
                      <p className="text-[11px] text-[oklch(40%_0.01_240)] leading-snug mt-0.5">{entry.detail}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Labs tab */}
        <div
          id="narrative-panel-labs"
          role="tabpanel"
          aria-label="Labs"
          hidden={activeTab !== "labs"}
        >
          {activeTab === "labs" && (
            <div className="px-6 py-5 overflow-x-auto">
              <table className="w-full text-[11px] border-collapse" aria-label="Laboratory results">
                <thead>
                  <tr className="border-b border-paper-200">
                    <th className="text-left py-2 pr-4 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
                      Test
                    </th>
                    <th className="text-right py-2 px-3 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
                      Baseline
                    </th>
                    <th className="text-right py-2 px-3 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
                      Day 14
                    </th>
                    <th className="text-right py-2 px-3 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
                      Day 28
                    </th>
                    <th className="text-right py-2 px-3 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
                      Day 41
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {narrative.labRows.map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-paper-100 ${row.flagged ? "bg-[oklch(98%_0.015_25)]" : "hover:bg-paper-50"}`}
                    >
                      <td className="py-2 pr-4 text-[oklch(15%_0.01_240)] font-medium">
                        {row.test}
                        {row.flagged && (
                          <span className="ml-1.5 text-[oklch(42%_0.22_25)]" aria-label="Flagged">▲</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-[oklch(30%_0.01_240)]">
                        {row.baseline}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-[oklch(30%_0.01_240)]">
                        {row.day14}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-[oklch(30%_0.01_240)]">
                        {row.day28}
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-mono tabular-nums font-semibold ${
                          row.flagged ? "text-[oklch(42%_0.22_25)]" : "text-[oklch(30%_0.01_240)]"
                        }`}
                      >
                        {row.day41}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer metrics */}
      <div className="shrink-0 border-t border-paper-200 bg-paper-50 px-5 py-2">
        <div className="flex items-center gap-6 flex-wrap">
          {narrative.footerMetrics.map((metric) => (
            <div key={metric.label} className="flex items-baseline gap-1.5">
              <span className="text-[9px] text-[oklch(55%_0.01_240)]">{metric.label}</span>
              <span className="text-[11px] font-semibold font-mono text-[oklch(20%_0.01_240)]">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
