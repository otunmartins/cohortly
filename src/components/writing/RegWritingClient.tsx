"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Flag, History, BookOpen, MessageSquare } from "lucide-react";
import type { RegWritingDoc, RightRailTab } from "@/types/writing";
import { CitationNode } from "@/components/protocol/CitationNode";
import { AIDraftBlock } from "@/components/shared/AIDraftBlock";
import { EctdModuleTree } from "@/components/writing/EctdModuleTree";
import { ConsistencyCheck } from "@/components/writing/ConsistencyCheck";
import { DocHealthRail } from "@/components/writing/DocHealthRail";
import { CommentThread } from "@/components/writing/CommentThread";
import { saveWritingSection } from "@/actions/writing";

interface Props {
  doc: RegWritingDoc;
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

export function RegWritingClient({ doc }: Props) {
  const [activeModuleId, setActiveModuleId] = useState("m274");
  const [rightTab, setRightTab] = useState<RightRailTab>("comments");
  const [showAiBlock, setShowAiBlock] = useState(true);

  const editor = useEditor({
    extensions: [StarterKit, CitationNode],
    content: doc.contentJson,
    editorProps: {
      attributes: {
        class: "outline-none min-h-[240px] text-[13px] leading-relaxed text-[oklch(15%_0.01_240)] prose-p:mb-3",
      },
    },
  });

  const debouncedSave = useDebounce(
    (json: Record<string, unknown>) => {
      saveWritingSection(doc.id, "section_274", json).catch(console.error);
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

  const RIGHT_TABS: { id: RightRailTab; label: string; icon: React.ReactNode }[] = [
    { id: "comments", label: "Comments", icon: <MessageSquare size={11} aria-hidden="true" /> },
    { id: "sources",  label: "Sources",  icon: <BookOpen size={11} aria-hidden="true" /> },
    { id: "history",  label: "History",  icon: <History size={11} aria-hidden="true" /> },
  ];

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100vh - 40px)" }}>
      {/* ── Left rail ─────────────────────────────────────────────────────── */}
      <aside
        className="w-56 shrink-0 border-r border-paper-200 bg-paper-50 overflow-y-auto p-3 space-y-5 hidden md:block"
        aria-label="eCTD navigation"
      >
        <EctdModuleTree
          modules={doc.modules}
          activeModuleId={activeModuleId}
          onSelect={setActiveModuleId}
        />
        <div className="border-t border-paper-200 pt-4">
          <ConsistencyCheck issues={doc.consistencyIssues} />
        </div>
      </aside>

      {/* ── Center ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Section meta bar */}
        <div className="shrink-0 border-b border-paper-200 px-5 py-2 bg-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[oklch(20%_0.01_240)]">
              Module {doc.moduleNumber} · §{doc.sectionNumber}
            </p>
            <p className="text-[10px] text-[oklch(55%_0.01_240)]">
              {doc.version} · {doc.editCount} edits · Last edited {doc.lastEditedAgo} by {doc.lastEditedBy}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold ${
              doc.status === "IN_REVIEW"
                ? "bg-[oklch(94%_0.06_75)] text-[oklch(42%_0.12_75)]"
                : doc.status === "APPROVED" || doc.status === "LOCKED"
                ? "bg-[oklch(92%_0.06_145)] text-[oklch(35%_0.12_145)]"
                : "bg-paper-200 text-[oklch(40%_0.01_240)]"
            }`}
          >
            {doc.status.replace("_", " ")}
          </span>
        </div>

        {/* Editor scroll area */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          <h1 className="text-[18px] font-semibold font-display text-[oklch(10%_0.01_240)] mb-4 leading-snug">
            §{doc.sectionNumber} {doc.sectionHeading}
          </h1>

          {/* Reviewer flag — pinned to first paragraph */}
          <div className="relative mb-0">
            <div
              className="absolute -left-6 top-0 flex flex-col items-center"
              aria-label="Reviewer flag on first paragraph"
            >
              <Flag size={12} className="text-[oklch(65%_0.13_75)]" aria-hidden="true" />
            </div>
          </div>

          {/* TipTap editor */}
          <div
            role="textbox"
            aria-label={`§${doc.sectionNumber} ${doc.sectionHeading} — editor`}
            aria-multiline="true"
            className="tiptap-editor [&_.tiptap>p]:mb-4 [&_.tiptap>p:first-child]:border-l-2 [&_.tiptap>p:first-child]:border-[oklch(65%_0.13_75)] [&_.tiptap>p:first-child]:pl-3"
          >
            <EditorContent editor={editor} />
          </div>

          {/* Inline flag annotation under first paragraph */}
          <div className="mt-1 mb-4 ml-3 flex items-start gap-1.5 p-2 rounded bg-[oklch(98%_0.015_75)] border border-[oklch(90%_0.06_75)]">
            <Flag size={10} className="text-[oklch(60%_0.13_75)] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-[10px] text-[oklch(35%_0.08_75)] leading-relaxed">
              <span className="font-semibold">JH (QA Reviewer):</span>{" "}
              Confirm SAE % alignment with ISS §5.3.5.1 before sign-off.
            </p>
          </div>

          {/* AI draft block — renal safety paragraph */}
          {showAiBlock && (
            <AIDraftBlock
              text={doc.aiDraftBlock.text}
              confidence={doc.aiDraftBlock.confidence}
              sourceCount={doc.aiDraftBlock.sourceCount}
              modelVersion={doc.aiDraftBlock.modelVersion}
              tag="Renal safety"
              status={
                doc.aiDraftBlock.status === "accepted"
                  ? "confirmed"
                  : doc.aiDraftBlock.status === "rejected"
                  ? "dismissed"
                  : "pending"
              }
              onAccept={() => setShowAiBlock(false)}
              onReject={() => setShowAiBlock(false)}
            />
          )}
        </div>
      </div>

      {/* ── Right rail ────────────────────────────────────────────────────── */}
      <aside
        className="w-64 shrink-0 border-l border-paper-200 bg-paper-50 flex flex-col overflow-hidden hidden lg:flex"
        aria-label="Document details"
      >
        {/* Tab bar */}
        <div
          className="flex border-b border-paper-200 bg-white shrink-0"
          role="tablist"
          aria-label="Right rail tabs"
        >
          {RIGHT_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={rightTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => setRightTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium border-b-2 transition-colors -mb-px ${
                rightTab === tab.id
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(25%_0.01_240)]"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "comments" && (
                <span className="ml-0.5 px-1 py-0.5 rounded-full bg-[oklch(55%_0.18_25)] text-white text-[8px] font-bold leading-none">
                  {doc.comments.filter((c) => !c.resolved).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="flex-1 overflow-y-auto p-3">
          <div
            id="tabpanel-comments"
            role="tabpanel"
            aria-label="Comments"
            hidden={rightTab !== "comments"}
            className={rightTab === "comments" ? "h-full flex flex-col" : ""}
          >
            {rightTab === "comments" && (
              <CommentThread comments={doc.comments} docId={doc.id} />
            )}
          </div>

          <div
            id="tabpanel-sources"
            role="tabpanel"
            aria-label="Sources"
            hidden={rightTab !== "sources"}
          >
            {rightTab === "sources" && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide mb-2">
                  {doc.citations.length} cited sources
                </p>
                {doc.citations.map((c) => (
                  <div
                    key={c.sourceId}
                    className="rounded border border-paper-200 bg-white p-2 space-y-0.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-[9px] font-semibold font-mono">
                        [{c.n}] {c.label}
                      </span>
                      <span className="text-[9px] text-[oklch(55%_0.01_240)] font-mono">{c.authority}</span>
                    </div>
                    <p className="text-[10px] text-[oklch(25%_0.01_240)] leading-snug">{c.title}</p>
                    <p className="text-[9px] text-[oklch(55%_0.01_240)]">{c.kind}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            id="tabpanel-history"
            role="tabpanel"
            aria-label="History"
            hidden={rightTab !== "history"}
          >
            {rightTab === "history" && (
              <div>
                <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide mb-2">
                  Audit trail
                </p>
                <ol className="relative border-l border-paper-200 space-y-3 ml-2">
                  {doc.history.map((h) => (
                    <li key={h.id} className="pl-3 relative">
                      <span
                        className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-paper-50 flex items-center justify-center text-[7px] font-bold text-white ${
                          h.kind === "ai"
                            ? "bg-[oklch(65%_0.13_75)]"
                            : h.kind === "system"
                            ? "bg-[oklch(55%_0.01_240)]"
                            : "bg-brand-500"
                        }`}
                        aria-hidden="true"
                      >
                        {h.actorInitials.slice(0, 2)}
                      </span>
                      <p className="text-[10px] text-[oklch(25%_0.01_240)] leading-snug">{h.action}</p>
                      <p className="text-[9px] text-[oklch(55%_0.01_240)] font-mono mt-0.5">
                        {h.actor} · {h.timestamp}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Doc health — always visible below tabs */}
        <div className="border-t border-paper-200 p-3 shrink-0 bg-paper-50">
          <DocHealthRail metrics={doc.docHealth} contentHash={doc.contentHash} />
        </div>
      </aside>
    </div>
  );
}

