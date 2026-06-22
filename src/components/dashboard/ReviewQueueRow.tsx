import Link from "next/link";
import { FlaskConical, FileText, Shield, Scale } from "lucide-react";
import type { ReviewItem } from "@/types/dashboard";
import { Confidence } from "@/components/shared/Confidence";

const TYPE_CONFIG: Record<
  ReviewItem["type"],
  { Icon: React.ComponentType<{ size: number; className?: string }>; bg: string; iconColor: string; label: string }
> = {
  protocol:    { Icon: FlaskConical, bg: "bg-brand-50",  iconColor: "text-brand-700",  label: "Protocol" },
  reg_writing: { Icon: FileText,     bg: "bg-paper-100", iconColor: "text-[oklch(40%_0.01_240)]", label: "Reg. writing" },
  safety:      { Icon: Shield,       bg: "bg-[oklch(97%_0.02_25)]", iconColor: "text-danger", label: "Safety" },
  ethics:      { Icon: Scale,        bg: "bg-[oklch(97%_0.03_280)]", iconColor: "text-[oklch(50%_0.12_280)]", label: "Ethics" },
};

const TAG_STYLES: Record<NonNullable<ReviewItem["tags"][number]["variant"]>, string> = {
  default: "bg-paper-100 text-[oklch(40%_0.01_240)] border-paper-200",
  info:    "bg-brand-50 text-brand-700 border-brand-100",
  warn:    "bg-accent-50 text-accent-700 border-accent-100",
  danger:  "bg-[oklch(97%_0.02_25)] text-danger border-[oklch(90%_0.04_25)]",
};

export function ReviewQueueRow({ item }: { item: ReviewItem }) {
  const { Icon, bg, iconColor } = TYPE_CONFIG[item.type];

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-paper-100 last:border-0">
      {/* Type icon */}
      <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={12} className={iconColor} aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[10px] font-mono font-semibold text-[oklch(35%_0.01_240)]">
            {item.studyId}
          </span>
          <span className="text-[oklch(70%_0.01_240)] text-[10px]">·</span>
          <span className="text-[10px] font-mono text-[oklch(50%_0.01_240)]">
            {item.docId}
          </span>
        </div>
        <p className="text-[11px] font-medium text-[oklch(18%_0.01_240)] leading-snug truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {item.tags.map((tag) => (
            <span
              key={tag.label}
              className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-medium border ${TAG_STYLES[tag.variant]}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      {/* Confidence + age + action */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <Confidence value={item.confidence} />
        <span className="text-[9px] text-[oklch(60%_0.01_240)]">{item.age}</span>
        <Link
          href={item.href}
          className="text-[10px] font-medium text-brand-700 hover:text-brand-500 transition-colors"
        >
          Open
        </Link>
      </div>
    </div>
  );
}
