import Link from "next/link";
import { AlertCircle } from "lucide-react";
import type { QueueCase } from "@/types/safety";
import { Confidence } from "@/components/shared/Confidence";

interface Props {
  queue: QueueCase[];
  activeSaeId: string;
}

export function NarrativeQueue({ queue, activeSaeId }: Props) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide mb-2">
        Narrative Queue
      </p>
      <ul className="space-y-1.5" role="list" aria-label="SAE narrative queue">
        {queue.map((item) => {
          const isActive = item.id === activeSaeId;
          const isOverdue = item.overdue;
          const isUrgent = !isOverdue && item.daysRemaining <= 3;

          return (
            <li key={item.id}>
              <Link
                href={`/safety/${item.id}`}
                className={`block rounded p-2 transition-colors border ${
                  isActive
                    ? "bg-brand-50 border-brand-500 text-brand-700"
                    : "bg-white border-paper-200 hover:border-paper-300 hover:bg-paper-50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-semibold font-mono text-[oklch(20%_0.01_240)]">
                    {item.saeRef}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-semibold flex items-center gap-0.5 ${
                      isOverdue
                        ? "text-[oklch(42%_0.22_25)]"
                        : isUrgent
                        ? "text-[oklch(50%_0.16_75)]"
                        : "text-[oklch(42%_0.12_145)]"
                    }`}
                    aria-label={isOverdue ? "Overdue" : `Due in ${item.daysRemaining}d ${item.hoursRemaining}h`}
                  >
                    {isOverdue ? (
                      <>
                        <AlertCircle size={9} aria-hidden="true" />
                        Overdue
                      </>
                    ) : (
                      `${item.daysRemaining}d ${item.hoursRemaining}h`
                    )}
                  </span>
                </div>
                <p className="text-[10px] text-[oklch(30%_0.01_240)] leading-snug mb-1">
                  {item.meddraPt}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[9px] font-mono text-[oklch(55%_0.01_240)]">
                    Subj. {item.subjectRef}
                  </span>
                  <Confidence value={item.confidence} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
