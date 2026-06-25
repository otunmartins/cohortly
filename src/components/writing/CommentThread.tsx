"use client";

import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { Confidence } from "@/components/shared/Confidence";
import { addWritingComment } from "@/actions/writing";
import type { RegWritingComment } from "@/types/writing";

interface Props {
  comments: RegWritingComment[];
  docId: string;
}

export function CommentThread({ comments, docId }: Props) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    await addWritingComment(docId, body.trim());
    setBody("");
    setSubmitting(false);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pb-2">
        {comments.map((c) => (
          <div
            key={c.id}
            className={`rounded-lg p-2.5 text-[11px] border ${
              c.resolved
                ? "opacity-50 border-paper-200 bg-paper-50"
                : c.kind === "ai"
                ? "border-[oklch(88%_0.06_75)] bg-[oklch(98%_0.015_75)]"
                : "border-paper-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 ${
                  c.kind === "ai" ? "bg-[oklch(65%_0.13_75)]" : "bg-brand-500"
                }`}
                aria-hidden="true"
              >
                {c.kind === "ai" ? <Bot size={9} /> : c.authorInitials}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[oklch(20%_0.01_240)] truncate">{c.author}</span>
                <span className="text-[oklch(55%_0.01_240)]"> · {c.role}</span>
              </div>
              {c.kind === "ai" && c.confidence !== undefined && (
                <Confidence value={c.confidence} />
              )}
            </div>
            <p className="text-[oklch(25%_0.01_240)] leading-relaxed">{c.body}</p>
            <p className="text-[9px] text-[oklch(60%_0.01_240)] font-mono mt-1.5">{c.timestamp}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-[11px] text-[oklch(60%_0.01_240)] text-center py-6">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-paper-200 pt-2 mt-2 flex gap-2">
        <label htmlFor="comment-input" className="sr-only">Add a comment</label>
        <input
          id="comment-input"
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          disabled={submitting}
          className="flex-1 px-2.5 py-1.5 text-[11px] bg-paper-100 border border-paper-200 rounded-md placeholder:text-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!body.trim() || submitting}
          aria-label="Send comment"
          className="px-2 py-1.5 rounded-md text-white transition-colors disabled:opacity-40"
          style={{ backgroundColor: "oklch(58% 0.10 185)" }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
        >
          <Send size={12} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
