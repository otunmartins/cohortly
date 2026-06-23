"use client";

import { useState } from "react";
import { Paperclip, Sparkles, BookOpen, Send } from "lucide-react";

interface Props {
  studyCode: string;
}

export function ReplyComposer({ studyCode }: Props) {
  const [value, setValue] = useState("");

  return (
    <div className="border-t border-paper-200 px-4 py-3 bg-paper-50">
      <textarea
        className="w-full resize-none rounded-md border border-paper-200 bg-white px-3 py-2 text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
        rows={3}
        placeholder={`Reply to ${studyCode} thread…`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Reply message"
      />
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-1">
          {/* Attach */}
          <button
            type="button"
            aria-label="Attach file"
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[oklch(45%_0.01_240)] hover:bg-paper-200 transition-colors"
          >
            <Paperclip size={12} aria-hidden="true" />
            <span>Attach</span>
          </button>

          {/* Cite source — stub */}
          <button
            type="button"
            aria-label="Cite a source"
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-[oklch(45%_0.01_240)] hover:bg-paper-200 transition-colors"
          >
            <BookOpen size={12} aria-hidden="true" />
            <span>Cite source</span>
          </button>

          {/* Draft with Cohortly — stub */}
          <button
            type="button"
            aria-label="Draft reply with Cohortly AI (coming soon)"
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-accent-700 bg-accent-50 hover:bg-accent-100 transition-colors"
          >
            <Sparkles size={12} aria-hidden="true" />
            <span>Draft with Cohortly</span>
          </button>
        </div>

        <button
          type="button"
          disabled={value.trim().length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-500 text-white text-[11px] font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={11} aria-hidden="true" />
          Send
        </button>
      </div>
    </div>
  );
}
