"use client";

import type { SafetyPageData } from "@/types/safety";
import { CaseDataPanel } from "@/components/safety/CaseDataPanel";
import { NarrativeEditor } from "@/components/safety/NarrativeEditor";
import { NarrativeQueue } from "@/components/safety/NarrativeQueue";
import { SignalDetectionCard } from "@/components/safety/SignalDetectionCard";
import { CumulativeSafetyCard } from "@/components/safety/CumulativeSafetyCard";

interface Props {
  data: SafetyPageData;
}

export function SafetyClient({ data }: Props) {
  const { safetyCase, narrative, narrativeQueue, signals, cumulative } = data;

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>
      {/* ── Left rail — structured case ───────────────────────────────────── */}
      <aside
        className="w-52 shrink-0 border-r border-paper-200 bg-paper-50 hidden md:block"
        aria-label="Structured case data"
      >
        <CaseDataPanel safetyCase={safetyCase} />
      </aside>

      {/* ── Center — narrative ────────────────────────────────────────────── */}
      <NarrativeEditor narrative={narrative} subjectRef={safetyCase.subjectRef} />

      {/* ── Right rail ────────────────────────────────────────────────────── */}
      <aside
        className="w-60 shrink-0 border-l border-paper-200 bg-paper-50 overflow-y-auto p-3 space-y-5 hidden lg:block"
        aria-label="Narrative queue and safety signals"
      >
        <NarrativeQueue queue={narrativeQueue} activeSaeId={safetyCase.id} />
        <div className="border-t border-paper-200" />
        <SignalDetectionCard signals={signals} />
        <div className="border-t border-paper-200" />
        <CumulativeSafetyCard cumulative={cumulative} />
      </aside>
    </div>
  );
}
