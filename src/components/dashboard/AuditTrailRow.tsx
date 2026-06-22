import { Bot } from "lucide-react";
import type { AuditEntry } from "@/types/dashboard";

export function AuditTrailRow({ entry }: { entry: AuditEntry }) {
  const isAI = entry.actorKind === "AI";

  return (
    <div className="flex items-start gap-2 py-1.5">
      <span className="text-[9px] font-mono text-[oklch(60%_0.01_240)] w-10 shrink-0 pt-0.5 tabular-nums">
        {entry.time}
      </span>

      {isAI ? (
        <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
          <Bot size={10} className="text-accent-700" aria-hidden="true" />
        </div>
      ) : (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-semibold shrink-0"
          style={{ backgroundColor: entry.actorColor ?? "oklch(50% 0.01 240)" }}
          aria-hidden="true"
        >
          {entry.actorInitials}
        </div>
      )}

      <p className="text-[10px] text-[oklch(30%_0.01_240)] leading-snug flex-1">
        <span className="text-[oklch(18%_0.01_240)] font-medium">
          {entry.action}
        </span>{" "}
        <span className="font-mono text-[oklch(35%_0.01_240)]">{entry.target}</span>
      </p>
    </div>
  );
}
