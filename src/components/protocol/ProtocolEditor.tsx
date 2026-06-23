"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { ProtocolDocument, ProtocolSection, EditorTab } from "@/types/protocol";
import { ComplianceMeters } from "@/components/protocol/ComplianceMeters";
import { SectionNav } from "@/components/protocol/SectionNav";
import { RetrievedSourcesRail } from "@/components/protocol/RetrievedSourcesRail";
import { GenerationComposer } from "@/components/protocol/GenerationComposer";
import { AIDraftBlock } from "@/components/shared/AIDraftBlock";
import { CitationNode } from "@/components/protocol/CitationNode";
import { saveSection } from "@/actions/protocol";

interface Props {
  doc: ProtocolDocument;
}

function useDebounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number) {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timer) clearTimeout(timer);
      const t = setTimeout(() => fn(...args), ms);
      setTimer(t);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn, ms],
  );
}

export function ProtocolEditor({ doc }: Props) {
  const [activeSectionId, setActiveSectionId] = useState(doc.sections[3].id);
  const [activeTab, setActiveTab] = useState<EditorTab>("edit");
  const [showRec, setShowRec] = useState(true);

  const activeSection: ProtocolSection =
    doc.sections.find((s) => s.id === activeSectionId) ?? doc.sections[3];

  const editor = useEditor({
    extensions: [StarterKit, CitationNode],
    content: activeSection.contentJson,
    editable: activeTab === "edit",
    editorProps: {
      attributes: {
        class: "outline-none min-h-[200px] text-[13px] leading-relaxed text-[oklch(15%_0.01_240)] prose-p:mb-3",
      },
    },
  });

  // Swap content when section changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(activeSection.contentJson);
    }
  }, [activeSectionId, activeSection.contentJson, editor]);

  // Sync editable state with tab
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(activeTab === "edit");
    }
  }, [activeTab, editor]);

  const debouncedSave = useDebounce(
    (json: Record<string, unknown>) => {
      saveSection(doc.id, activeSection.id, json).catch(console.error);
    },
    1200,
  );

  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => {
      const json = editor.getJSON() as Record<string, unknown>;
      debouncedSave(json);
    };
    editor.on("update", onUpdate);
    return () => { editor.off("update", onUpdate); };
  }, [editor, debouncedSave]);

  const TABS: { id: EditorTab; label: string }[] = [
    { id: "edit", label: "Edit" },
    { id: "review", label: "Review" },
    { id: "compare", label: "Compare" },
  ];

  const showRecommendation =
    showRec &&
    doc.recommendation.sectionId === activeSectionId &&
    activeTab !== "compare";

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>
      {/* ── Left rail ─────────────────────────────────────────────────────── */}
      <aside
        className="w-52 shrink-0 border-r border-paper-200 bg-paper-50 overflow-y-auto p-3 space-y-5 hidden md:block"
        aria-label="Protocol navigation"
      >
        <ComplianceMeters meters={doc.complianceMeters} />
        <SectionNav
          sections={doc.sections}
          activeSectionId={activeSectionId}
          onSelect={setActiveSectionId}
        />
      </aside>

      {/* ── Center ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Section meta + tab bar */}
        <div className="shrink-0 border-b border-paper-200 px-5 pt-3 pb-0 bg-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-[oklch(55%_0.01_240)]">
              <span className="font-medium text-[oklch(30%_0.01_240)]">Section</span>
              {" · "}Last edited {doc.lastEditedAgo} by {doc.lastEditedBy}
            </p>
          </div>
          <div className="flex items-center gap-0" role="tablist" aria-label="Editor mode">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? "border-brand-500 text-brand-700"
                    : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(25%_0.01_240)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editor scroll area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          {/* Section heading */}
          <h1 className="text-[18px] font-semibold font-display text-[oklch(10%_0.01_240)] mb-4 leading-snug">
            {activeSection.number}. {activeSection.heading}
          </h1>

          {/* TipTap editor */}
          <div
            className={`tiptap-editor ${activeTab === "review" ? "opacity-90 pointer-events-none select-text" : ""}`}
            role="textbox"
            aria-label={`Section ${activeSection.number}: ${activeSection.heading}`}
            aria-multiline="true"
          >
            <EditorContent editor={editor} />
          </div>

          {/* Recommendation card — appears inline after content */}
          {showRecommendation && (
            <AIDraftBlock
              text={doc.recommendation.text}
              confidence={doc.recommendation.confidence}
              sourceCount={doc.retrievedSources.length}
              modelVersion="cohortly-v3"
              precedentCount={doc.recommendation.precedentCount}
              tag={doc.recommendation.tag}
              status={doc.recommendation.status}
              onAccept={() => setShowRec(false)}
              onReject={() => setShowRec(false)}
              onShowPrecedents={() => {}}
            />
          )}

          {/* Empty section prompt */}
          {activeSection.status === "empty" && !editor?.getText()?.trim() && (
            <p className="text-[12px] text-[oklch(60%_0.01_240)] italic mt-4">
              This section is empty. Use the composer below to generate draft content.
            </p>
          )}
        </div>

        {/* Generation composer — pinned to bottom */}
        <GenerationComposer
          therapeuticArea={doc.therapeuticArea}
          phase={doc.phase}
          ragChunks={46000}
        />
      </div>

      {/* ── Right rail ────────────────────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 border-l border-paper-200 bg-paper-50 overflow-y-auto p-3 hidden lg:block"
        aria-label="Retrieved sources"
      >
        <RetrievedSourcesRail
          sources={doc.retrievedSources}
          taEvidence={doc.taEvidence}
        />
      </aside>
    </div>
  );
}
