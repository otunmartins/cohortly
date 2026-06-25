"use client";

import { useState } from "react";
import type { EthicsPageData, FormSection } from "@/types/ethics";
import { IrasSectionNav } from "@/components/ethics/IrasSectionNav";
import { RequiredDocsChecklist } from "@/components/ethics/RequiredDocsChecklist";
import { HraComplianceRail } from "@/components/ethics/HraComplianceRail";
import { RecTimeline } from "@/components/ethics/RecTimeline";
import { NihrPortfolioCard } from "@/components/ethics/NihrPortfolioCard";
import { Confidence } from "@/components/shared/Confidence";
import { generateDocument } from "@/actions/ethics";
import { BookOpen, RefreshCw, Eye } from "lucide-react";

interface Props {
  data: EthicsPageData;
}

function sectionPct(s: FormSection): number {
  return s.totalCount === 0 ? 0 : Math.round((s.answeredCount / s.totalCount) * 100);
}

export function EthicsClient({ data }: Props) {
  const {
    application,
    sections,
    requiredDocs,
    hraChecks,
    hraGap,
    recTimeline,
    nihrPortfolio,
  } = data;

  const [activeSectionCode, setActiveSectionCode] = useState<string>(data.activeSection.code);
  const [pisPreviewOpen, setPisPreviewOpen] = useState(false);

  const activeSection = sections.find((s) => s.code === activeSectionCode) ?? sections[0];
  const totalAnswered = sections.reduce((sum, s) => sum + s.answeredCount, 0);
  const totalQuestions = sections.reduce((sum, s) => sum + s.totalCount, 0);
  const overallPct = totalQuestions === 0 ? 0 : Math.round((totalAnswered / totalQuestions) * 100);

  async function handleGenerateDpia() {
    await generateDocument(application.id, "DPIA");
  }

  async function handleAdopt() {
    // Stub
  }

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>
      {/* ── Left rail ───────────────────────────────────────────────────────── */}
      <aside
        className="w-52 shrink-0 border-r border-paper-200 bg-paper-50 overflow-y-auto hidden md:flex flex-col"
        aria-label="IRAS application navigation"
      >
        {/* Application identity */}
        <div className="p-3 border-b border-paper-200 space-y-0.5">
          <p className="text-[10px] font-semibold text-[oklch(55%_0.01_240)] uppercase tracking-wide">
            {application.jurisdiction} · {application.authority}
          </p>
          <p className="text-[11px] font-mono text-[oklch(35%_0.01_240)]">
            {application.irasId}
          </p>
          <p className="text-[11px] text-[oklch(35%_0.01_240)]">
            {application.projectCode} · {application.version}
          </p>
        </div>

        {/* Completion bar */}
        <div className="px-3 py-2.5 border-b border-paper-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-[oklch(50%_0.01_240)]">Completion</p>
            <p className="text-[11px] font-semibold tabular-nums text-[oklch(25%_0.01_240)]">
              {overallPct}%
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-paper-200 overflow-hidden" role="progressbar" aria-valuenow={overallPct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${overallPct}%`,
                background: overallPct >= 80
                  ? "oklch(50% 0.12 145)"
                  : overallPct >= 50
                  ? "oklch(58% 0.10 185)"
                  : "oklch(80% 0.13 75)",
              }}
            />
          </div>
        </div>

        {/* Section nav */}
        <div className="p-2 flex-1">
          <IrasSectionNav
            sections={sections}
            activeSectionCode={activeSectionCode}
            onSelect={setActiveSectionCode}
          />
        </div>

        {/* Required documents */}
        <div className="p-3 border-t border-paper-200">
          <RequiredDocsChecklist docs={requiredDocs} />
        </div>
      </aside>

      {/* ── Center — section editor ─────────────────────────────────────────── */}
      <main
        className="flex-1 overflow-y-auto min-w-0 bg-white"
        aria-label="Section editor"
      >
        {/* Section header */}
        <div className="sticky top-0 bg-white border-b border-paper-200 px-6 py-3 flex items-center gap-3 z-10">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)]">
              Section {activeSection.code}
            </p>
            <h1 className="text-sm font-semibold text-[oklch(15%_0.01_240)] truncate">
              {activeSection.title}
            </h1>
          </div>
          <span className="text-[10px] text-[oklch(55%_0.01_240)] italic hidden sm:block">
            Auto-populated from protocol
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] tabular-nums text-[oklch(50%_0.01_240)]">
              {activeSection.answeredCount}/{activeSection.totalCount} answered
            </span>
            <div
              className="w-16 h-1.5 rounded-full bg-paper-200 overflow-hidden ml-1"
              role="progressbar"
              aria-valuenow={sectionPct(activeSection)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${sectionPct(activeSection)}%`,
                  background: "oklch(58% 0.10 185)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Answer cards */}
        <div className="px-6 py-5 space-y-4 max-w-3xl">
          {activeSection.answers && activeSection.answers.length > 0 ? (
            activeSection.answers.map((ans) => (
              <div
                key={ans.id}
                className="border border-paper-200 rounded-lg p-4 space-y-2"
              >
                {/* Question */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono font-semibold text-brand-500 shrink-0 mt-0.5">
                      {ans.questionCode}
                    </span>
                    <p className="text-[12px] font-medium text-[oklch(20%_0.01_240)] leading-snug">
                      {ans.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={[
                      "text-[9px] font-semibold px-1.5 py-0.5 rounded",
                      ans.kind === "auto"
                        ? "bg-brand-50 text-brand-700"
                        : "bg-amber-50 text-amber-700",
                    ].join(" ")}>
                      {ans.kind === "auto" ? "Auto" : "Edited"}
                    </span>
                    <button
                      className="p-1 rounded hover:bg-paper-100 text-[oklch(55%_0.01_240)] hover:text-[oklch(30%_0.01_240)] transition-colors"
                      aria-label="Regenerate answer"
                      title="Regenerate"
                    >
                      <RefreshCw size={11} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Answer text */}
                <p className="text-[12px] text-[oklch(25%_0.01_240)] leading-relaxed pl-5">
                  {ans.answer}
                </p>

                {/* Source + confidence */}
                <div className="flex items-center gap-3 pl-5 pt-1">
                  <span className="flex items-center gap-1 text-[10px] text-[oklch(50%_0.01_240)]">
                    <BookOpen size={9} aria-hidden="true" />
                    {ans.sourceRef}
                  </span>
                  <Confidence value={Math.round(ans.confidence * 100)} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[12px] text-[oklch(50%_0.01_240)]">
                No answers yet for section {activeSection.code}.
              </p>
              <button
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-md border border-brand-500 text-brand-700 hover:bg-brand-50 transition-colors"
              >
                <RefreshCw size={12} aria-hidden="true" />
                Auto-populate from protocol
              </button>
            </div>
          )}

          {/* PIS readability card (shown when section D is active) */}
          {activeSection.pisReadability && (
            <div className="border border-paper-200 rounded-lg p-4 space-y-3 bg-paper-50">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-semibold text-[oklch(20%_0.01_240)]">
                  Participant Information Sheet (PIS)
                </p>
                <button
                  onClick={() => setPisPreviewOpen(!pisPreviewOpen)}
                  className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-500 transition-colors"
                  aria-expanded={pisPreviewOpen}
                >
                  <Eye size={11} aria-hidden="true" />
                  {pisPreviewOpen ? "Hide" : "Preview"}
                </button>
              </div>

              <dl className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[11px]">
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Plain English</dt>
                  <dd className="font-medium text-green-700">
                    {activeSection.pisReadability.plainEnglish ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Reading age</dt>
                  <dd className="font-medium tabular-nums text-[oklch(20%_0.01_240)]">
                    {activeSection.pisReadability.readingAge}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Flesch</dt>
                  <dd className="font-medium tabular-nums text-[oklch(20%_0.01_240)]">
                    {activeSection.pisReadability.fleschScore}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Words</dt>
                  <dd className="font-medium tabular-nums text-[oklch(20%_0.01_240)]">
                    {activeSection.pisReadability.wordCount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Sections</dt>
                  <dd className="font-medium tabular-nums text-[oklch(20%_0.01_240)]">
                    {activeSection.pisReadability.sectionCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-[oklch(55%_0.01_240)]">Template</dt>
                  <dd className="font-medium text-[oklch(20%_0.01_240)]">
                    {activeSection.pisReadability.hraTemplateVersion}
                  </dd>
                </div>
              </dl>

              {pisPreviewOpen && (
                <div className="mt-2 p-3 rounded border border-paper-200 bg-white text-[11px] text-[oklch(30%_0.01_240)] leading-relaxed italic">
                  [PIS preview — full document renders here in production from the assembled PIS draft.]
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Right rail ──────────────────────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 border-l border-paper-200 bg-paper-50 overflow-y-auto p-3 space-y-5 hidden lg:block"
        aria-label="HRA compliance, REC timeline, and NIHR portfolio"
      >
        <HraComplianceRail
          checks={hraChecks}
          gap={hraGap}
          onGenerateFromProtocol={handleGenerateDpia}
        />

        <div className="border-t border-paper-200" />

        <RecTimeline milestones={recTimeline} />

        <div className="border-t border-paper-200" />

        <NihrPortfolioCard portfolio={nihrPortfolio} onAdopt={handleAdopt} />
      </aside>
    </div>
  );
}
