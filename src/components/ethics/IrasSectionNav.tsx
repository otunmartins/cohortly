import type { FormSection, SectionStatus } from "@/types/ethics";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

interface Props {
  sections: FormSection[];
  activeSectionCode: string;
  onSelect: (code: string) => void;
}

function statusIcon(status: SectionStatus) {
  switch (status) {
    case "complete":
      return <CheckCircle2 size={10} className="text-green-600 shrink-0" aria-hidden="true" />;
    case "in-progress":
      return <Clock size={10} className="text-amber-500 shrink-0" aria-hidden="true" />;
    case "draft":
      return <Circle size={10} className="text-[oklch(60%_0.01_240)] shrink-0" aria-hidden="true" />;
    case "empty":
      return <AlertCircle size={10} className="text-paper-300 shrink-0" aria-hidden="true" />;
  }
}

export function IrasSectionNav({ sections, activeSectionCode, onSelect }: Props) {
  return (
    <nav aria-label="IRAS sections" className="space-y-0.5">
      {sections.map((s) => {
        const isActive = s.code === activeSectionCode;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.code)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors",
              isActive
                ? "bg-brand-500 text-white"
                : "hover:bg-paper-200 text-[oklch(30%_0.01_240)]",
            ].join(" ")}
          >
            {statusIcon(s.status)}
            <span className={["text-[11px] font-mono shrink-0", isActive ? "text-white" : "text-[oklch(50%_0.01_240)]"].join(" ")}>
              {s.code}
            </span>
            <span className={["text-[11px] truncate flex-1", isActive ? "font-semibold text-white" : ""].join(" ")}>
              {s.title}
            </span>
            <span className={["text-[10px] tabular-nums shrink-0", isActive ? "text-white/70" : "text-[oklch(55%_0.01_240)]"].join(" ")}>
              {s.answeredCount}/{s.totalCount}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
