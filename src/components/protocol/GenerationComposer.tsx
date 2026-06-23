"use client";

import { useState } from "react";
import { Paperclip, BookOpen, LayoutTemplate, Zap } from "lucide-react";

interface Props {
  therapeuticArea: string;
  phase: string;
  ragChunks?: number;
  onGenerate?: () => void;
}

export function GenerationComposer({
  therapeuticArea,
  phase,
  ragChunks = 46000,
  onGenerate,
}: Props) {
  const [citeAll, setCiteAll] = useState(true);

  return (
    <div className="border-t border-paper-200 bg-paper-50 px-4 py-2.5">
      <div className="flex items-center gap-3 flex-wrap">
        {/* RAG context indicator */}
        <div className="flex items-center gap-1.5 text-[10px] text-[oklch(45%_0.01_240)]">
          <span className="font-mono font-semibold text-brand-700">
            #{(ragChunks / 1000).toFixed(0)}k
          </span>
          <span>RAG chunks</span>
        </div>

        {/* Context chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-paper-200 text-[10px] font-medium text-[oklch(30%_0.01_240)]">
            <span className="text-[oklch(55%_0.01_240)] text-[9px]">TA</span>
            {therapeuticArea}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-paper-200 text-[10px] font-medium text-[oklch(30%_0.01_240)]">
            <span className="text-[oklch(55%_0.01_240)] text-[9px]">Phase</span>
            {phase}
          </span>
        </div>

        {/* Cite-all toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <button
            type="button"
            role="switch"
            aria-checked={citeAll}
            onClick={() => setCiteAll((v) => !v)}
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${
              citeAll ? "bg-brand-500" : "bg-paper-300"
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                citeAll ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-[10px] text-[oklch(40%_0.01_240)]">Cite all generated text</span>
        </label>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Toolbar actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] hover:bg-paper-200 rounded transition-colors"
          >
            <Paperclip size={10} aria-hidden="true" />
            Attach
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] hover:bg-paper-200 rounded transition-colors"
          >
            <BookOpen size={10} aria-hidden="true" />
            Sources
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] hover:bg-paper-200 rounded transition-colors"
          >
            <LayoutTemplate size={10} aria-hidden="true" />
            Templates
          </button>
        </div>

        {/* Generate */}
        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded-md transition-colors"
          style={{ backgroundColor: "oklch(58% 0.10 185)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
        >
          <Zap size={11} aria-hidden="true" />
          Generate
        </button>
      </div>
    </div>
  );
}
