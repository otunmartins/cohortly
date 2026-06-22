import type { ProjectStatus } from "@/types/project";

const CONFIG: Record<
  ProjectStatus,
  { label: string; dot?: boolean; className: string }
> = {
  DRAFT: {
    label: "Draft",
    className:
      "bg-paper-200 text-[oklch(40%_0.01_240)]",
  },
  PRE_IND: {
    label: "Pre-IND",
    dot: true,
    className: "bg-accent-50 text-accent-700",
  },
  IN_SCREENING: {
    label: "In screening",
    dot: true,
    className: "bg-brand-50 text-brand-700",
  },
  RECRUITING: {
    label: "Recruiting",
    dot: true,
    className:
      "bg-[oklch(95%_0.07_145)] text-[oklch(38%_0.14_145)]",
  },
  IN_FOLLOW_UP: {
    label: "In follow-up",
    dot: true,
    className: "bg-brand-100 text-brand-700",
  },
  REPORTING: {
    label: "Reporting",
    dot: false,
    className: "bg-[oklch(22%_0.01_240)] text-white",
  },
  COMPLETED: {
    label: "Completed",
    dot: true,
    className:
      "bg-[oklch(95%_0.07_145)] text-[oklch(38%_0.14_145)]",
  },
};

const DOT_COLORS: Record<ProjectStatus, string> = {
  DRAFT: "",
  PRE_IND: "bg-accent-500",
  IN_SCREENING: "bg-brand-500",
  RECRUITING: "bg-[oklch(52%_0.16_145)]",
  IN_FOLLOW_UP: "bg-brand-500",
  REPORTING: "",
  COMPLETED: "bg-[oklch(52%_0.16_145)]",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, dot, className } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium leading-none whitespace-nowrap ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLORS[status]}`}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
