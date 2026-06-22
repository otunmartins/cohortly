import Link from "next/link";
import { MapPin, AlertCircle } from "lucide-react";
import type { MockProject } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

function EnrolmentBar({
  actual,
  target,
  status,
}: {
  actual: number;
  target: number;
  status: MockProject["status"];
}) {
  const pct = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;

  const fillColor =
    pct >= 100
      ? "bg-[oklch(52%_0.16_145)]"
      : status === "DRAFT" || pct === 0
      ? "bg-paper-300"
      : "bg-brand-500";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-wide font-medium">
          Enrolment
        </span>
        <span className="text-[10px] font-mono text-[oklch(30%_0.01_240)]">
          {actual.toLocaleString()}/{target.toLocaleString()}
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-paper-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ProjectCard({ project }: { project: MockProject }) {
  const [codePrefix, codeNum] = project.code.split("-");

  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex flex-col gap-2.5 bg-paper-50 border border-paper-200 rounded-lg p-3.5 hover:border-brand-500 hover:shadow-sm transition-all group"
    >
      {/* Code + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="font-mono leading-none">
          <div className="text-[9px] text-[oklch(55%_0.01_240)] tracking-wide">
            {codePrefix}-
          </div>
          <div className="text-[13px] font-semibold text-[oklch(25%_0.01_240)]">
            {codeNum}
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Title */}
      <p className="text-[12px] font-semibold text-[oklch(18%_0.01_240)] leading-snug group-hover:text-brand-700 transition-colors line-clamp-2">
        {project.title}
      </p>

      {/* Phase · indication · regions */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-[10px] text-[oklch(45%_0.01_240)]">
          {project.phase}
        </span>
        <span className="text-[oklch(70%_0.01_240)] text-[10px]">·</span>
        <span className="text-[10px] text-[oklch(45%_0.01_240)]">
          {project.indication}
        </span>
        {project.regions.map((r) => (
          <span
            key={r}
            className="text-[oklch(70%_0.01_240)] text-[10px]"
          >
            · {r}
          </span>
        ))}
      </div>

      {/* Enrolment */}
      <EnrolmentBar
        actual={project.actualEnrolment}
        target={project.targetEnrolment}
        status={project.status}
      />

      {/* Footer: owner · sites · open items */}
      <div className="flex items-center gap-2 pt-0.5">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-semibold shrink-0"
          style={{ backgroundColor: project.ownerColor }}
          title={project.ownerName}
        >
          {project.ownerInitials}
        </div>
        <span className="text-[10px] text-[oklch(40%_0.01_240)] truncate flex-1">
          {project.ownerName.split(" ")[0][0]}. {project.ownerName.split(" ")[1]}
        </span>
        <div className="flex items-center gap-1 text-[oklch(50%_0.01_240)]">
          <MapPin size={9} aria-hidden="true" />
          <span className="text-[10px] font-mono">{project.siteCount}</span>
          <span className="text-[10px] text-[oklch(65%_0.01_240)]">sites</span>
        </div>
        {project.openItems > 0 && (
          <div
            className="flex items-center gap-0.5 bg-accent-50 border border-accent-100 rounded px-1 py-0.5"
            title={`${project.openItems} open items`}
          >
            <AlertCircle size={9} className="text-accent-700" aria-hidden="true" />
            <span className="text-[10px] font-mono font-semibold text-accent-700">
              {project.openItems}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
