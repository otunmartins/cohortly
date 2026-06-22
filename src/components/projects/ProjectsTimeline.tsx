"use client";

import Link from "next/link";
import type { Project as MockProject } from "@/types/project";
import { StatusBadge } from "./StatusBadge";

const STATUS_BAR_COLOR: Record<MockProject["status"], string> = {
  DRAFT: "bg-paper-300",
  PRE_IND: "bg-accent-100 border border-accent-500",
  IN_SCREENING: "bg-brand-100 border border-brand-500",
  RECRUITING: "bg-brand-500",
  IN_FOLLOW_UP: "bg-brand-700",
  REPORTING: "bg-[oklch(22%_0.01_240)]",
  COMPLETED: "bg-[oklch(52%_0.16_145)]",
};

function parseDate(s: string): Date {
  return new Date(s);
}

interface Props {
  projects: MockProject[];
}

export function ProjectsTimeline({ projects }: Props) {
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

  const allDates = projects.flatMap((p) => [
    parseDate(p.startDate),
    parseDate(p.endDate),
  ]);
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));
  const totalMs = maxDate.getTime() - minDate.getTime();

  // Build year markers
  const startYear = minDate.getFullYear();
  const endYear = maxDate.getFullYear();
  const years: { year: number; left: number }[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const yearStart = new Date(y, 0, 1).getTime();
    const left = totalMs > 0 ? ((yearStart - minDate.getTime()) / totalMs) * 100 : 0;
    if (left >= 0 && left <= 100) years.push({ year: y, left });
  }

  function barStyle(project: MockProject) {
    const start = parseDate(project.startDate).getTime();
    const end = parseDate(project.endDate).getTime();
    const left = totalMs > 0 ? ((start - minDate.getTime()) / totalMs) * 100 : 0;
    const width = totalMs > 0 ? ((end - start) / totalMs) * 100 : 0;
    return { left: `${Math.max(0, left)}%`, width: `${Math.min(100 - left, width)}%` };
  }

  const sorted = [...projects].sort(
    (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime()
  );

  const ROW_HEIGHT = 36;
  const LABEL_WIDTH = 200;

  return (
    <div className="overflow-x-auto rounded-lg border border-paper-200 bg-paper-50">
      {/* Header row */}
      <div className="flex border-b border-paper-200 sticky top-0 bg-paper-50 z-10">
        <div
          className="shrink-0 px-3 py-2 text-[10px] font-semibold text-[oklch(40%_0.01_240)] border-r border-paper-200"
          style={{ width: LABEL_WIDTH }}
        >
          Study
        </div>
        <div className="flex-1 relative" style={{ minWidth: 400 }}>
          {/* Year markers */}
          {years.map(({ year, left }) => (
            <div
              key={year}
              className="absolute top-0 bottom-0 flex flex-col justify-end"
              style={{ left: `${left}%` }}
            >
              <span className="px-1 pb-1 text-[9px] font-mono text-[oklch(60%_0.01_240)]">
                {year}
              </span>
              <div className="w-px h-1 bg-paper-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      {sorted.map((project) => (
        <div
          key={project.id}
          className="flex border-b border-paper-200 last:border-0 hover:bg-brand-50 transition-colors"
          style={{ height: ROW_HEIGHT }}
        >
          {/* Label */}
          <div
            className="shrink-0 flex items-center gap-2 px-3 border-r border-paper-200"
            style={{ width: LABEL_WIDTH }}
          >
            <span className="font-mono text-[10px] font-semibold text-brand-700 shrink-0">
              {project.code}
            </span>
            <Link
              href={`/projects/${project.id}`}
              className="text-[10px] text-[oklch(30%_0.01_240)] truncate hover:text-brand-700 transition-colors"
            >
              {project.title}
            </Link>
          </div>

          {/* Bar area */}
          <div className="flex-1 relative flex items-center" style={{ minWidth: 400 }}>
            {/* Grid lines */}
            {years.map(({ year, left }) => (
              <div
                key={year}
                className="absolute top-0 bottom-0 w-px bg-paper-200"
                style={{ left: `${left}%` }}
                aria-hidden="true"
              />
            ))}

            {/* Gantt bar */}
            <div
              className={`absolute h-5 rounded ${STATUS_BAR_COLOR[project.status]} flex items-center px-1.5 overflow-hidden`}
              style={barStyle(project)}
              title={`${project.title} · ${project.startDate} → ${project.endDate}`}
            >
              <StatusBadge status={project.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
