"use client";

import { useState } from "react";
import type { IntakeMode } from "@/types/protocol";
import { IntakeGuidedForm } from "./IntakeGuidedForm";
import { FreeformTab } from "./FreeformTab";
import { ImportTab } from "./ImportTab";

const TABS: { id: IntakeMode; label: string }[] = [
  { id: "guided", label: "Guided form" },
  { id: "freeform", label: "Freeform prompt" },
  { id: "import", label: "Import existing" },
];

export function IntakeClient() {
  const [mode, setMode] = useState<IntakeMode>("guided");

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main panel */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="mb-5">
          <h1 className="font-display text-[22px] md:text-[26px] text-[oklch(12%_0.01_240)] leading-tight">
            Describe the trial you want to design.
          </h1>
          <p className="mt-1 text-[11px] text-[oklch(50%_0.01_240)]">
            Cohortly generates a SPIRIT-compliant protocol draft grounded in FDA, MHRA, EMA, and ICH guidance retrieved from the Knowledge Base.
          </p>
        </div>

        {/* Mode tabs */}
        <div
          role="tablist"
          aria-label="Protocol intake mode"
          className="flex gap-0 border-b border-paper-200 mb-5"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={mode === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setMode(tab.id)}
              className={[
                "px-4 py-2 text-[11px] font-medium border-b-2 transition-colors -mb-px",
                mode === tab.id
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-[oklch(45%_0.01_240)] hover:text-[oklch(20%_0.01_240)] hover:border-paper-300",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div
          role="tabpanel"
          id={`panel-${mode}`}
          aria-labelledby={`tab-${mode}`}
        >
          {mode === "guided" && <IntakeGuidedForm />}
          {mode === "freeform" && <FreeformTab />}
          {mode === "import" && <ImportTab />}
        </div>
      </div>
    </div>
  );
}
