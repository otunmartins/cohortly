"use client";

import { useState } from "react";
import { Plus, Wand2, LayoutList } from "lucide-react";
import type { Criterion, CriterionKind } from "@/types/eligibility";
import { CriterionRow } from "./CriterionRow";
import { addCriterion } from "@/actions/eligibility";

type Tab = "all" | "inclusion" | "exclusion" | "flagged";

interface Props {
  criteria: Criterion[];
  projectId: string;
  onUpdated: (id: string, text: string) => void;
  onDeleted: (id: string) => void;
  onAdded: (criterion: Criterion) => void;
}

export function CriteriaTable({ criteria, projectId, onUpdated, onDeleted, onAdded }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [addKind, setAddKind] = useState<CriterionKind>("INCLUSION");
  const [addText, setAddText] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);

  const inclusion = criteria.filter((c) => c.kind === "INCLUSION");
  const exclusion = criteria.filter((c) => c.kind === "EXCLUSION");
  const flagged = criteria.filter((c) => !!c.warning);

  const displayed =
    activeTab === "inclusion"
      ? inclusion
      : activeTab === "exclusion"
      ? exclusion
      : activeTab === "flagged"
      ? flagged
      : criteria;

  async function handleAdd() {
    if (!addText.trim()) return;
    setAdding(true);
    const result = await addCriterion({ projectId, kind: addKind, text: addText.trim() });
    setAdding(false);
    if (result.success) {
      const nextNum =
        addKind === "INCLUSION"
          ? inclusion.length + 1
          : exclusion.length + 1;
      const prefix = addKind === "INCLUSION" ? "I" : "E";
      onAdded({
        id: `${prefix}${nextNum}`,
        kind: addKind,
        text: addText.trim(),
        feasibility: 50,
        source: "Sponsor SOP",
        regMandated: false,
        projectId,
        organizationId: "org_maple_001",
      });
      setAddText("");
      setShowAddRow(false);
    }
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "All", count: criteria.length },
    { key: "inclusion", label: "Inclusion", count: inclusion.length },
    { key: "exclusion", label: "Exclusion", count: exclusion.length },
    { key: "flagged", label: "Flagged", count: flagged.length },
  ];

  return (
    <div className="flex flex-col min-h-0">
      {/* Tab bar + actions */}
      <div className="flex items-center justify-between gap-3 mb-2 shrink-0">
        <div className="flex items-center gap-0" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 text-[11px] font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.key
                  ? "border-brand-500 text-brand-700"
                  : "border-transparent text-[oklch(50%_0.01_240)] hover:text-[oklch(20%_0.01_240)]"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span
                  className={`ml-1.5 text-[9px] font-semibold px-1 py-0.5 rounded ${
                    activeTab === t.key
                      ? "bg-brand-100 text-brand-700"
                      : "bg-paper-200 text-[oklch(50%_0.01_240)]"
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] border border-paper-200 rounded hover:bg-paper-200 transition-colors">
            <Wand2 size={10} />
            Optimise
          </button>
          <button className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] border border-paper-200 rounded hover:bg-paper-200 transition-colors">
            <LayoutList size={10} />
            Group by section
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto border border-paper-200 rounded-lg bg-white">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[oklch(55%_0.01_240)]">
            <span className="text-[12px]">No criteria in this category</span>
            <button
              onClick={() => setShowAddRow(true)}
              className="mt-3 text-[11px] text-brand-500 hover:text-brand-700 underline"
            >
              Add a criterion
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-paper-200 bg-paper-50">
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-10">
                  ID
                </th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)]">
                  Criterion
                </th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-28">
                  Feasibility
                </th>
                <th className="px-3 py-1.5 text-left text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-28">
                  Source
                </th>
                <th className="px-3 py-1.5 text-center text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] w-14">
                  Mand.
                </th>
                <th className="w-14" />
              </tr>
            </thead>
            <tbody>
              {displayed.map((c) => (
                <CriterionRow
                  key={c.id}
                  criterion={c}
                  onDelete={onDeleted}
                  onUpdated={onUpdated}
                />
              ))}
            </tbody>
          </table>
        )}

        {/* Add row */}
        {showAddRow ? (
          <div className="border-t border-paper-200 px-3 py-2 flex items-start gap-2 bg-paper-50">
            <select
              value={addKind}
              onChange={(e) => setAddKind(e.target.value as CriterionKind)}
              className="text-[10px] border border-paper-200 rounded px-1.5 py-1 bg-white text-[oklch(30%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 shrink-0"
            >
              <option value="INCLUSION">Inclusion</option>
              <option value="EXCLUSION">Exclusion</option>
            </select>
            <textarea
              value={addText}
              onChange={(e) => setAddText(e.target.value)}
              rows={2}
              placeholder="Add criterion or paste a draft — validate against MedDRA, ICD-10, and precedent."
              className="flex-1 text-[11px] border border-paper-200 rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder:text-[oklch(65%_0.01_240)] text-[oklch(20%_0.01_240)]"
            />
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={handleAdd}
                disabled={adding || !addText.trim()}
                className="px-2.5 py-1 text-[10px] font-medium text-white bg-brand-500 hover:bg-brand-700 rounded transition-colors disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add"}
              </button>
              <button
                onClick={() => { setShowAddRow(false); setAddText(""); }}
                className="px-2.5 py-1 text-[10px] font-medium text-[oklch(40%_0.01_240)] border border-paper-200 rounded hover:bg-paper-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddRow(true)}
            className="w-full border-t border-paper-200 px-3 py-2 text-left flex items-center gap-1.5 text-[10px] text-[oklch(55%_0.01_240)] hover:text-brand-500 hover:bg-paper-50 transition-colors"
          >
            <Plus size={11} />
            Add criterion or paste a draft — validate against MedDRA, ICD-10, and precedent.
          </button>
        )}
      </div>
    </div>
  );
}
