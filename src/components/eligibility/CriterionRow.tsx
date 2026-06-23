"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, AlertTriangle, Check, X } from "lucide-react";
import type { Criterion, CriterionSource } from "@/types/eligibility";
import { updateCriterion } from "@/actions/eligibility";

const SOURCE_STYLES: Record<CriterionSource, string> = {
  "Precedent":    "bg-paper-200 text-[oklch(35%_0.01_240)]",
  "FDA mandate":  "bg-[oklch(94%_0.04_240)] text-[oklch(38%_0.08_240)]",
  "EMA SAWP":     "bg-[oklch(94%_0.03_290)] text-[oklch(38%_0.08_280)]",
  "Sponsor SOP":  "bg-brand-50 text-brand-700",
  "WHO":          "bg-[oklch(94%_0.04_155)] text-[oklch(38%_0.10_145)]",
  "AASLD":        "bg-accent-50 text-accent-700",
  "ICH E14":      "bg-[oklch(94%_0.03_260)] text-[oklch(38%_0.08_260)]",
  "CMC":          "bg-[oklch(94%_0.04_5)] text-[oklch(38%_0.10_5)]",
};

interface Props {
  criterion: Criterion;
  onDelete: (id: string) => void;
  onUpdated: (id: string, text: string) => void;
}

export function CriterionRow({ criterion, onDelete, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(criterion.text);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  async function handleSave() {
    if (draft.trim() === criterion.text) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const result = await updateCriterion({
      id: criterion.id,
      projectId: criterion.projectId,
      text: draft.trim(),
      feasibility: criterion.feasibility,
    });
    setSaving(false);
    if (result.success) {
      onUpdated(criterion.id, draft.trim());
      setEditing(false);
    }
  }

  function handleCancel() {
    setDraft(criterion.text);
    setEditing(false);
  }

  const feasibilityColor =
    criterion.feasibility >= 80
      ? "bg-success"
      : criterion.feasibility >= 60
      ? "bg-warn"
      : "bg-danger";

  const feasibilityTextColor =
    criterion.feasibility >= 80
      ? "text-[oklch(42%_0.14_145)]"
      : criterion.feasibility >= 60
      ? "text-[oklch(52%_0.13_75)]"
      : "text-[oklch(48%_0.18_25)]";

  return (
    <>
      <tr className="group border-b border-paper-200 hover:bg-paper-50 transition-colors">
        {/* ID */}
        <td className="px-3 py-2 align-top w-10">
          <span className="text-[10px] font-mono font-semibold text-[oklch(45%_0.01_240)]">
            {criterion.id}
          </span>
        </td>

        {/* Criterion text */}
        <td className="px-3 py-2 align-top">
          {editing ? (
            <div className="flex flex-col gap-1">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full text-[11px] text-[oklch(20%_0.01_240)] border border-brand-500 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              />
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-white bg-brand-500 hover:bg-brand-700 rounded transition-colors disabled:opacity-50"
                >
                  <Check size={9} />
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-[oklch(40%_0.01_240)] border border-paper-200 rounded hover:bg-paper-200 transition-colors"
                >
                  <X size={9} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-[oklch(20%_0.01_240)] leading-relaxed">
              {criterion.text}
            </span>
          )}
        </td>

        {/* Feasibility */}
        <td className="px-3 py-2 align-top w-28">
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1.5 rounded-full bg-paper-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${feasibilityColor}`}
                style={{ width: `${criterion.feasibility}%` }}
              />
            </div>
            <span className={`text-[10px] font-mono font-semibold tabular-nums ${feasibilityTextColor}`}>
              {criterion.feasibility}
            </span>
          </div>
        </td>

        {/* Source */}
        <td className="px-3 py-2 align-top w-28">
          <span
            className={`inline-block text-[9px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
              SOURCE_STYLES[criterion.source]
            }`}
          >
            {criterion.source}
          </span>
        </td>

        {/* Reg mandated */}
        <td className="px-3 py-2 align-top w-14 text-center">
          {criterion.regMandated ? (
            <span className="inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[oklch(94%_0.04_25)] text-[oklch(45%_0.15_25)]">
              Reg
            </span>
          ) : (
            <span className="text-[oklch(70%_0.01_240)]">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="px-3 py-2 align-top w-14">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              aria-label={`Edit criterion ${criterion.id}`}
              className="p-0.5 text-[oklch(55%_0.01_240)] hover:text-brand-500 transition-colors"
            >
              <Pencil size={11} />
            </button>
            <button
              onClick={() => onDelete(criterion.id)}
              aria-label={`Remove criterion ${criterion.id}`}
              className="p-0.5 text-[oklch(55%_0.01_240)] hover:text-danger transition-colors"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </td>
      </tr>

      {/* Inline warning row */}
      {criterion.warning && (
        <tr className="border-b border-paper-200">
          <td />
          <td colSpan={5} className="px-3 pb-2">
            <div className="flex items-start gap-1.5 bg-accent-50 border border-accent-100 rounded px-2 py-1.5">
              <AlertTriangle
                size={11}
                className="text-accent-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span className="text-[10px] text-accent-700 leading-relaxed">
                {criterion.warning}
              </span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
