import { Copy, FileText, Share2 } from "lucide-react";
import type { KbAnswer } from "@/types/knowledge";
import { Confidence } from "@/components/shared/Confidence";
import { Citation } from "@/components/shared/Citation";

interface Props {
  answer: KbAnswer;
}

export function KbAnswerCard({ answer }: Props) {
  return (
    <div className="border border-brand-500/30 rounded-lg bg-white overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-50 border-b border-brand-500/20 flex-wrap">
        <span className="text-[10px] font-semibold text-brand-700 uppercase tracking-wide">
          Synthesised
        </span>
        <Confidence value={answer.confidence} />
        <span className="text-[10px] text-[oklch(50%_0.01_240)] ml-auto tabular-nums font-mono">
          {answer.sourceCount} sources · {answer.latencyMs}ms
        </span>
      </div>

      {/* Answer body */}
      <div className="px-4 py-3 text-[12px] text-[oklch(20%_0.01_240)] leading-relaxed">
        {answer.segments.map((seg, i) => {
          if (seg.type === "citation" && seg.citationRef) {
            return (
              <Citation
                key={i}
                n={seg.citationRef.n}
                label={seg.citationRef.label}
              />
            );
          }
          return <span key={i}>{seg.value}</span>;
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-t border-paper-200 bg-paper-50">
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[oklch(40%_0.01_240)] hover:bg-paper-200 transition-colors"
        >
          <Copy size={11} aria-hidden="true" />
          Copy with citations
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[oklch(40%_0.01_240)] hover:bg-paper-200 transition-colors"
        >
          <FileText size={11} aria-hidden="true" />
          Insert into Module 2.7
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[oklch(40%_0.01_240)] hover:bg-paper-200 transition-colors"
        >
          <Share2 size={11} aria-hidden="true" />
          Share answer
        </button>
      </div>
    </div>
  );
}
