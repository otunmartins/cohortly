"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import type { AuthorityFilter, KbAnswer, KbIndexHealth } from "@/types/knowledge";
import { SourceFilters } from "./SourceFilters";
import { KbAnswerCard } from "./KbAnswerCard";
import { SourcePassageList } from "./SourcePassageList";
import { IndexHealthRail } from "./IndexHealthRail";

const ALL_AUTHORITIES: AuthorityFilter[] = [
  "FDA", "EMA", "MHRA", "ICH", "Internal", "CT.gov", "PubMed",
];

const EXAMPLE_QUERIES = [
  "When is a DSMB required for a Phase II NASH trial in the UK?",
  "What stopping rules does ICH E6(R3) require for oncology trials?",
  "EMA guidance on adaptive trial designs for rare diseases",
];

interface Props {
  answer: KbAnswer;
  health: KbIndexHealth;
}

export function KbClient({ answer, health }: Props) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<AuthorityFilter[]>(ALL_AUTHORITIES);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleAsk(q?: string) {
    const q2 = q ?? query;
    if (!q2.trim()) return;
    setQuery(q2);
    setIsLoading(true);
    // Simulate brief load then show mock answer
    setTimeout(() => {
      setIsLoading(false);
      setHasSearched(true);
    }, 600);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero + search area */}
      <div className="border-b border-paper-200 bg-paper-50 px-6 py-5 shrink-0">
        {!hasSearched && (
          <div className="text-center mb-5">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[oklch(50%_0.01_240)] mb-1">
              Cohortly Knowledge Base · {health.totalChunks.toLocaleString()} chunks indexed
            </p>
            <h1 className="font-display text-[22px] md:text-[28px] text-[oklch(12%_0.01_240)] leading-tight mb-2">
              Ask Cohortly anything across global regulations and your institutional memory.
            </h1>
            <p className="text-[11px] text-[oklch(50%_0.01_240)] max-w-xl mx-auto">
              Hybrid retrieval — dense + BM25 — with citation-grade provenance. Answers in plain English with every claim linked to source.
            </p>
          </div>
        )}

        {/* Query bar */}
        <div className="max-w-3xl mx-auto space-y-2.5">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(55%_0.01_240)]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask anything across global regulations and institutional memory…"
                aria-label="Knowledge base query"
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={!query.trim() || isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-500 text-white text-[12px] font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Sparkles size={12} aria-hidden="true" />
              Ask
            </button>
          </div>

          <SourceFilters selected={filters} onChange={setFilters} />

          {/* Example queries (idle only) */}
          {!hasSearched && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[9px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">Try:</span>
              {EXAMPLE_QUERIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAsk(q)}
                  className="text-[10px] text-brand-700 hover:underline"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="max-w-5xl mx-auto px-6 py-5 flex gap-5">
            <div className="flex-1 space-y-3 animate-pulse">
              <div className="h-28 rounded-lg bg-paper-200" />
              <div className="h-4 rounded bg-paper-200 w-1/3" />
              <div className="h-20 rounded-lg bg-paper-200" />
              <div className="h-20 rounded-lg bg-paper-200" />
            </div>
            <div className="hidden lg:block w-[220px] xl:w-[240px] space-y-2 animate-pulse shrink-0">
              <div className="h-48 rounded-lg bg-paper-200" />
              <div className="h-32 rounded-lg bg-paper-200" />
            </div>
          </div>
        ) : hasSearched ? (
          <div className="max-w-5xl mx-auto px-6 py-5 flex gap-5">
            <div className="flex-1 min-w-0 space-y-5">
              <KbAnswerCard answer={answer} />
              <SourcePassageList passages={answer.passages} />
            </div>
            <div className="hidden lg:block shrink-0">
              <IndexHealthRail health={health} />
            </div>
          </div>
        ) : (
          /* Idle state — show rail only */
          <div className="max-w-5xl mx-auto px-6 py-5 flex justify-end">
            <div className="hidden lg:block shrink-0">
              <IndexHealthRail health={health} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
