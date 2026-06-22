"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { LayoutGrid, Table2, GanttChartSquare, Search, X, SlidersHorizontal } from "lucide-react";
import type { Project as MockProject, Organization as MockOrganization } from "@/types/project";
import { ProjectsGrid } from "./ProjectsGrid";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectsTimeline } from "./ProjectsTimeline";

type ViewMode = "grid" | "table" | "timeline";

interface Props {
  projects: MockProject[];
  org: MockOrganization;
}

const VIEW_OPTIONS: { value: ViewMode; label: string; Icon: React.ComponentType<{ size: number }> }[] = [
  { value: "grid", label: "Grid", Icon: LayoutGrid },
  { value: "table", label: "Table", Icon: Table2 },
  { value: "timeline", label: "Timeline", Icon: GanttChartSquare },
];

function unique(arr: string[]): string[] {
  return [...new Set(arr)].sort();
}

export function ProjectsClient({ projects, org }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = (searchParams.get("view") ?? "grid") as ViewMode;
  const phase = searchParams.get("phase") ?? "";
  const indication = searchParams.get("indication") ?? "";
  const status = searchParams.get("status") ?? "";
  const q = searchParams.get("q") ?? "";

  const setParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) {
        p.set(key, value);
      } else {
        p.delete(key);
      }
      router.push(`/projects?${p.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("phase");
    p.delete("indication");
    p.delete("status");
    p.delete("q");
    router.push(`/projects?${p.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const filtered = projects.filter((proj) => {
    if (phase && proj.phase !== phase) return false;
    if (indication && proj.indication !== indication) return false;
    if (status && proj.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      const match =
        proj.code.toLowerCase().includes(s) ||
        proj.title.toLowerCase().includes(s) ||
        proj.indication.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  const activeCount = projects.filter(
    (p) => !["DRAFT", "COMPLETED"].includes(p.status)
  ).length;

  const phases = unique(projects.map((p) => p.phase));
  const indications = unique(projects.map((p) => p.indication));
  const statuses = unique(projects.map((p) => p.status));

  const STATUS_LABELS: Record<string, string> = {
    DRAFT: "Draft",
    PRE_IND: "Pre-IND",
    IN_SCREENING: "In screening",
    RECRUITING: "Recruiting",
    IN_FOLLOW_UP: "In follow-up",
    REPORTING: "Reporting",
    COMPLETED: "Completed",
  };

  const activeFilters = [
    phase && { key: "phase", label: "Phase", value: phase },
    indication && { key: "indication", label: "Indication", value: indication },
    status && { key: "status", label: "Status", value: STATUS_LABELS[status] ?? status },
  ].filter(Boolean) as { key: string; label: string; value: string }[];

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 px-6 pt-4 pb-3 border-b border-paper-200">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[oklch(55%_0.01_240)]">
            All Studies · {org.name}
          </p>
          <h1 className="font-display text-[22px] text-[oklch(18%_0.01_240)] leading-tight mt-0.5">
            {projects.length} projects ·{" "}
            <span className="text-brand-700">{activeCount} active</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 pt-1 shrink-0">
          {/* Study search */}
          <div className="relative hidden sm:block">
            <Search
              size={11}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(55%_0.01_240)] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
              placeholder="Search by name, ID, sponsor…"
              className="pl-7 pr-3 py-1.5 text-[11px] bg-paper-50 border border-paper-200 rounded-md w-52 placeholder:text-[oklch(65%_0.01_240)] text-[oklch(20%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
              aria-label="Search studies"
            />
          </div>

          {/* View switcher */}
          <div
            role="tablist"
            aria-label="View mode"
            className="flex items-center border border-paper-200 rounded-md overflow-hidden bg-paper-50"
          >
            {VIEW_OPTIONS.map(({ value: v, label, Icon }) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setParam("view", v)}
                title={label}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors ${
                  view === v
                    ? "bg-brand-500 text-white"
                    : "text-[oklch(45%_0.01_240)] hover:bg-paper-200"
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 px-6 py-2 border-b border-paper-200 bg-paper-50 flex-wrap">
        {/* Phase filter */}
        <div className="relative flex items-center">
          <SlidersHorizontal size={11} className="text-[oklch(55%_0.01_240)] mr-1.5" aria-hidden="true" />
          <select
            value={phase}
            onChange={(e) => setParam("phase", e.target.value)}
            className="appearance-none pl-1 pr-4 py-0.5 text-[10px] border-0 bg-transparent text-[oklch(40%_0.01_240)] cursor-pointer focus:outline-none focus:ring-0"
            aria-label="Filter by phase"
          >
            <option value="">Phase</option>
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <svg className="absolute right-0 pointer-events-none w-3 h-3 text-[oklch(60%_0.01_240)]" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Indication filter */}
        <div className="relative flex items-center">
          <select
            value={indication}
            onChange={(e) => setParam("indication", e.target.value)}
            className="appearance-none pl-1 pr-4 py-0.5 text-[10px] border-0 bg-transparent text-[oklch(40%_0.01_240)] cursor-pointer focus:outline-none focus:ring-0"
            aria-label="Filter by indication"
          >
            <option value="">Indication</option>
            {indications.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <svg className="absolute right-0 pointer-events-none w-3 h-3 text-[oklch(60%_0.01_240)]" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Status filter */}
        <div className="relative flex items-center">
          <select
            value={status}
            onChange={(e) => setParam("status", e.target.value)}
            className="appearance-none pl-1 pr-4 py-0.5 text-[10px] border-0 bg-transparent text-[oklch(40%_0.01_240)] cursor-pointer focus:outline-none focus:ring-0"
            aria-label="Filter by status"
          >
            <option value="">Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] ?? s}
              </option>
            ))}
          </select>
          <svg className="absolute right-0 pointer-events-none w-3 h-3 text-[oklch(60%_0.01_240)]" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Active filter chips */}
        {activeFilters.map((f) => (
          <span
            key={f.key}
            className="inline-flex items-center gap-1 bg-brand-50 border border-brand-100 text-brand-700 rounded px-1.5 py-0.5 text-[10px] font-medium"
          >
            <span className="text-[oklch(55%_0.08_185)]">{f.label}:</span>{" "}
            {f.value}
            <button
              onClick={() => setParam(f.key, "")}
              aria-label={`Remove ${f.label} filter`}
              className="ml-0.5 text-brand-700 hover:text-brand-900 transition-colors"
            >
              <X size={10} />
            </button>
          </span>
        ))}

        {activeFilters.length > 1 && (
          <button
            onClick={clearFilters}
            className="text-[10px] text-[oklch(50%_0.01_240)] hover:text-[oklch(30%_0.01_240)] transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}

        {/* Mobile search */}
        <div className="relative sm:hidden flex-1 min-w-0">
          <Search
            size={10}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[oklch(55%_0.01_240)] pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search…"
            className="w-full pl-6 pr-2 py-1 text-[10px] bg-paper-50 border border-paper-200 rounded placeholder:text-[oklch(65%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Showing count */}
        <span className="ml-auto text-[10px] text-[oklch(55%_0.01_240)] shrink-0">
          Showing{" "}
          <span className="font-mono text-[oklch(30%_0.01_240)]">{filtered.length}</span>
          {" "}of{" "}
          <span className="font-mono text-[oklch(30%_0.01_240)]">{projects.length}</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {view === "grid" && <ProjectsGrid projects={filtered} />}
        {view === "table" && <ProjectsTable projects={filtered} />}
        {view === "timeline" && <ProjectsTimeline projects={filtered} />}
      </div>
    </div>
  );
}
