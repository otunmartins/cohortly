"use client";

import { useState } from "react";
import { Upload, FileText, Link } from "lucide-react";

type ImportMode = "file" | "nct";

export function ImportTab() {
  const [mode, setMode] = useState<ImportMode>("file");
  const [nctId, setNctId] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      {/* Sub-mode switcher */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-paper-200 w-fit">
        <button
          type="button"
          onClick={() => setMode("file")}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
            mode === "file"
              ? "bg-white text-[oklch(15%_0.01_240)] shadow-sm"
              : "text-[oklch(45%_0.01_240)] hover:text-[oklch(20%_0.01_240)]",
          ].join(" ")}
        >
          <FileText size={11} aria-hidden="true" />
          .docx / .pdf
        </button>
        <button
          type="button"
          onClick={() => setMode("nct")}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors",
            mode === "nct"
              ? "bg-white text-[oklch(15%_0.01_240)] shadow-sm"
              : "text-[oklch(45%_0.01_240)] hover:text-[oklch(20%_0.01_240)]",
          ].join(" ")}
        >
          <Link size={11} aria-hidden="true" />
          NCT ID
        </button>
      </div>

      {mode === "file" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          className={[
            "flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed transition-colors",
            isDragging
              ? "border-brand-500 bg-brand-50"
              : "border-paper-300 bg-paper-50 hover:border-brand-500 hover:bg-brand-50",
          ].join(" ")}
        >
          <Upload
            size={24}
            className={isDragging ? "text-brand-500" : "text-[oklch(55%_0.01_240)]"}
            aria-hidden="true"
          />
          <div className="text-center">
            <p className="text-[12px] font-semibold text-[oklch(20%_0.01_240)]">
              Drop your protocol document here
            </p>
            <p className="text-[11px] text-[oklch(50%_0.01_240)] mt-0.5">
              .docx or .pdf · max 50 MB
            </p>
          </div>
          <label className="px-3 py-1.5 rounded-lg border border-paper-200 bg-white text-[11px] font-medium text-[oklch(30%_0.01_240)] hover:bg-paper-100 transition-colors cursor-pointer">
            Browse files
            <input type="file" className="sr-only" accept=".docx,.pdf" />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <label
            htmlFor="nct-id"
            className="block text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-1.5"
          >
            ClinicalTrials.gov identifier
          </label>
          <div className="flex gap-2">
            <input
              id="nct-id"
              type="text"
              value={nctId}
              onChange={(e) => setNctId(e.target.value.toUpperCase())}
              placeholder="NCT00000000"
              className="flex-1 px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] font-mono text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            <button
              type="button"
              disabled={!nctId.match(/^NCT\d{8}$/)}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-[11px] font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              Import
            </button>
          </div>
          <p className="text-[10px] text-[oklch(55%_0.01_240)]">
            Cohortly will pull the study record from ClinicalTrials.gov and pre-populate the guided form.
          </p>
        </div>
      )}

      <p className="text-[10px] text-[oklch(55%_0.01_240)] flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-warn" aria-hidden="true" />
        Full import parsing available in the next release. Review and confirm extracted fields before generating.
      </p>
    </div>
  );
}
