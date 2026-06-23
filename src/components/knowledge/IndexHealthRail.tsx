import { CheckCircle2, Clock } from "lucide-react";
import type { KbIndexHealth } from "@/types/knowledge";

interface Props {
  health: KbIndexHealth;
}

export function IndexHealthRail({ health }: Props) {
  return (
    <aside className="w-full lg:w-[220px] xl:w-[240px] shrink-0 space-y-4">
      {/* Index health */}
      <div className="rounded-lg border border-paper-200 bg-white p-3">
        <div className="flex items-center gap-1.5 mb-3">
          <CheckCircle2 size={12} className="text-[oklch(52%_0.14_145)]" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-[oklch(15%_0.01_240)]">
            Index · Synced
          </span>
          <span className="ml-auto text-[9px] font-mono text-[oklch(55%_0.01_240)]">
            {health.lastSyncedAgo}
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          {health.categories.map((cat) => (
            <div key={cat.label} className="flex items-baseline justify-between gap-1">
              <span className="text-[10px] text-[oklch(40%_0.01_240)] leading-snug">
                {cat.label}
              </span>
              <span className="text-[10px] font-mono tabular-nums text-[oklch(35%_0.01_240)] shrink-0">
                {cat.chunkCount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-paper-200 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-[oklch(30%_0.01_240)]">Total</span>
          <span className="text-[10px] font-mono font-bold tabular-nums text-[oklch(25%_0.01_240)]">
            {health.totalChunks.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Recent ingests */}
      <div className="rounded-lg border border-paper-200 bg-white p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={11} className="text-[oklch(50%_0.01_240)]" aria-hidden="true" />
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)]">
            Recent · Last 7 days
          </span>
        </div>
        <div className="space-y-2">
          {health.recentIngests.map((ing) => (
            <div key={ing.id} className="flex items-start gap-1.5">
              <span className="w-5 h-5 rounded flex items-center justify-center bg-paper-100 text-[8px] font-semibold text-[oklch(40%_0.01_240)] shrink-0">
                {ing.authority.slice(0, 2)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[oklch(25%_0.01_240)] leading-snug truncate">
                  {ing.title}
                </p>
                <p className="text-[9px] text-[oklch(55%_0.01_240)] font-mono">
                  +{ing.chunksAdded} chunks · {ing.age}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned */}
      {health.pinnedStudyCode && (
        <div className="rounded-lg border border-paper-200 bg-white p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] block mb-1.5">
            Pinned
          </span>
          <span className="font-mono text-[11px] text-brand-700 font-semibold">
            {health.pinnedStudyCode}
          </span>
        </div>
      )}
    </aside>
  );
}
