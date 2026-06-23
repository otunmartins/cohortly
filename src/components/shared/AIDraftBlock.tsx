"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, Check, X, ChevronRight } from "lucide-react";
import { Confidence } from "@/components/shared/Confidence";

interface Props {
  text: string;
  confidence: number;
  sourceCount: number;
  modelVersion: string;
  precedentCount?: number;
  tag?: string;
  status?: "pending" | "confirmed" | "dismissed";
  onAccept?: () => void;
  onReject?: () => void;
  onRegenerate?: () => void;
  onShowPrecedents?: () => void;
}

export function AIDraftBlock({
  text,
  confidence,
  sourceCount,
  modelVersion,
  precedentCount,
  tag,
  status = "pending",
  onAccept,
  onReject,
  onRegenerate,
  onShowPrecedents,
}: Props) {
  const [localStatus, setLocalStatus] = useState(status);

  if (localStatus === "dismissed") return null;

  function handleAccept() {
    setLocalStatus("confirmed");
    onAccept?.();
  }

  function handleReject() {
    setLocalStatus("dismissed");
    onReject?.();
  }

  return (
    <div className="rounded-lg border border-[oklch(88%_0.06_75)] bg-[oklch(98%_0.015_75)] p-3 space-y-2.5 my-3">
      {/* Header row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} className="text-[oklch(58%_0.13_75)]" aria-hidden="true" />
          <span className="text-[10px] font-semibold text-[oklch(42%_0.08_75)] uppercase tracking-wide">
            Recommendation
            {tag && ` · ${tag}`}
          </span>
        </div>
        {localStatus === "confirmed" && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[oklch(92%_0.08_145)] text-[oklch(35%_0.12_145)] text-[9px] font-semibold">
            <Check size={8} aria-hidden="true" />
            Confirmed
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Confidence value={confidence} />
          <span className="text-[9px] font-mono text-[oklch(55%_0.01_240)]">{modelVersion}</span>
        </div>
      </div>

      {/* Body */}
      <p className="text-[12px] text-[oklch(20%_0.01_240)] leading-relaxed">{text}</p>

      {/* Footer: source count + actions */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] font-mono">
          {sourceCount} source{sourceCount !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-1.5">
          {precedentCount !== undefined && (
            <button
              type="button"
              onClick={onShowPrecedents}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.08_75)] border border-[oklch(85%_0.06_75)] rounded hover:bg-[oklch(95%_0.02_75)] transition-colors"
            >
              Show {precedentCount} precedents
              <ChevronRight size={9} aria-hidden="true" />
            </button>
          )}
          {localStatus !== "confirmed" && (
            <>
              <button
                type="button"
                onClick={onRegenerate}
                aria-label="Regenerate suggestion"
                className="p-1 rounded text-[oklch(50%_0.01_240)] hover:bg-paper-200 transition-colors"
              >
                <RotateCcw size={11} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleReject}
                aria-label="Dismiss suggestion"
                className="p-1 rounded text-[oklch(50%_0.01_240)] hover:bg-paper-200 transition-colors"
              >
                <X size={11} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold text-white rounded transition-colors"
                style={{ backgroundColor: "oklch(58% 0.10 185)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
              >
                <Check size={9} aria-hidden="true" />
                Insert paragraph
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
