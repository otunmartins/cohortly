import type { InboxThread } from "@/types/inbox";
import { DomainBadge } from "./DomainBadge";
import { ReplyComposer } from "./ReplyComposer";

interface Props {
  thread: InboxThread;
}

export function InboxThreadDetail({ thread }: Props) {
  const urgencyLabel =
    thread.urgency === "urgent"
      ? "Urgent · respond today"
      : thread.urgency === "high"
      ? "High priority"
      : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Thread header */}
      <div className="px-4 py-3 border-b border-paper-200 bg-paper-50 shrink-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <DomainBadge tag={thread.domainTag} />
          <span className="font-mono text-[10px] text-[oklch(50%_0.01_240)]">
            {thread.studyCode}
          </span>
          {urgencyLabel && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[oklch(42%_0.18_25)]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[oklch(52%_0.20_25)] shrink-0"
                aria-hidden="true"
              />
              {urgencyLabel}
            </span>
          )}
        </div>
        <h2 className="text-[13px] font-semibold text-[oklch(15%_0.01_240)] leading-snug">
          {thread.subject}
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {thread.messages.map((msg) => (
          <article key={msg.id}>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{
                  backgroundColor: msg.fromColor ?? "oklch(45% 0.08 240)",
                }}
                aria-hidden="true"
              >
                {msg.fromInitials}
              </div>
              <span className="text-[12px] font-semibold text-[oklch(20%_0.01_240)]">
                {msg.from}
              </span>
              <span className="text-[10px] text-[oklch(55%_0.01_240)] ml-auto">
                {msg.age}
              </span>
            </div>
            <div className="ml-8 text-[12px] text-[oklch(25%_0.01_240)] leading-relaxed whitespace-pre-wrap">
              {msg.body}
            </div>
          </article>
        ))}
      </div>

      {/* Reply composer — client island */}
      <ReplyComposer studyCode={thread.studyCode} />
    </div>
  );
}
