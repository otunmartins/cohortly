"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown, MapPin, AlertCircle } from "lucide-react";
import type { MockProject } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

type SortKey = keyof Pick<
  MockProject,
  "code" | "title" | "status" | "phase" | "indication" | "actualEnrolment" | "siteCount" | "openItems"
>;

interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown size={10} className="opacity-30" />;
  return dir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
}

function pct(actual: number, target: number) {
  return target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
}

interface Props {
  projects: MockProject[];
}

export function ProjectsTable({ projects }: Props) {
  const [sort, setSort] = useState<SortState>({ key: "code", dir: "asc" });

  function toggleSort(key: SortKey) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  }

  const sorted = [...projects].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    const cmp =
      typeof av === "string" && typeof bv === "string"
        ? av.localeCompare(bv)
        : (av as number) - (bv as number);
    return sort.dir === "asc" ? cmp : -cmp;
  });

  const cols: { key: SortKey; label: string; align?: "right" }[] = [
    { key: "code", label: "Code" },
    { key: "title", label: "Title" },
    { key: "status", label: "Status" },
    { key: "phase", label: "Phase" },
    { key: "indication", label: "Indication" },
    { key: "actualEnrolment", label: "Enrolment", align: "right" },
    { key: "siteCount", label: "Sites", align: "right" },
    { key: "openItems", label: "Open", align: "right" },
  ];

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[13px] font-medium text-[oklch(35%_0.01_240)]">
          No studies match these filters
        </p>
        <p className="text-[11px] text-[oklch(55%_0.01_240)] mt-1">
          Try adjusting your search or removing a filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-paper-200">
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="bg-paper-100 border-b border-paper-200">
            {cols.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 font-semibold text-[oklch(40%_0.01_240)] whitespace-nowrap select-none ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                <button
                  onClick={() => toggleSort(col.key)}
                  className="inline-flex items-center gap-1 hover:text-[oklch(20%_0.01_240)] transition-colors"
                >
                  {col.label}
                  <SortIcon active={sort.key === col.key} dir={sort.dir} />
                </button>
              </th>
            ))}
            <th className="px-3 py-2 text-left font-semibold text-[oklch(40%_0.01_240)]">
              Owner
            </th>
            <th className="px-3 py-2 text-left font-semibold text-[oklch(40%_0.01_240)]">
              Regions
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((project, i) => {
            const enrolPct = pct(project.actualEnrolment, project.targetEnrolment);
            return (
              <tr
                key={project.id}
                className={`border-b border-paper-200 last:border-0 hover:bg-brand-50 transition-colors ${
                  i % 2 === 0 ? "bg-paper-50" : "bg-white"
                }`}
              >
                <td className="px-3 py-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-mono text-[10px] font-semibold text-brand-700 hover:underline"
                  >
                    {project.code}
                  </Link>
                </td>
                <td className="px-3 py-2 max-w-[200px]">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-[oklch(20%_0.01_240)] hover:text-brand-700 transition-colors truncate block"
                  >
                    {project.title}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-3 py-2 text-[oklch(45%_0.01_240)] whitespace-nowrap">
                  {project.phase}
                </td>
                <td className="px-3 py-2 text-[oklch(45%_0.01_240)]">
                  {project.indication}
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex flex-col items-end gap-0.5 min-w-[80px]">
                    <span className="font-mono text-[oklch(30%_0.01_240)]">
                      {project.actualEnrolment.toLocaleString()}/{project.targetEnrolment.toLocaleString()}
                    </span>
                    <div className="h-1 w-16 rounded-full bg-paper-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          enrolPct >= 100
                            ? "bg-[oklch(52%_0.16_145)]"
                            : enrolPct > 0
                            ? "bg-brand-500"
                            : "bg-paper-300"
                        }`}
                        style={{ width: `${enrolPct}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1 text-[oklch(50%_0.01_240)]">
                    <MapPin size={9} aria-hidden="true" />
                    <span className="font-mono">{project.siteCount}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  {project.openItems > 0 ? (
                    <div className="inline-flex items-center gap-0.5 bg-accent-50 border border-accent-100 rounded px-1 py-0.5">
                      <AlertCircle size={9} className="text-accent-700" aria-hidden="true" />
                      <span className="font-mono font-semibold text-accent-700">
                        {project.openItems}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[oklch(70%_0.01_240)]">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-semibold shrink-0"
                      style={{ backgroundColor: project.ownerColor }}
                    >
                      {project.ownerInitials}
                    </div>
                    <span className="text-[oklch(40%_0.01_240)] whitespace-nowrap">
                      {project.ownerName}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {project.regions.map((r) => (
                      <span
                        key={r}
                        className="inline-block bg-paper-100 border border-paper-200 rounded px-1 py-0.5 text-[9px] font-mono text-[oklch(40%_0.01_240)]"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
