import { Suspense } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { getSafetyQueue } from "@/lib/data/safety";
import { Confidence } from "@/components/shared/Confidence";

function QueueSkeleton() {
  return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-4 w-40 bg-paper-200 rounded" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-paper-200 rounded" />
      ))}
    </div>
  );
}

async function SafetyQueueContent() {
  const { queue, cumulative } = await getSafetyQueue("org_maple_001");

  const overdue = queue.filter((c) => c.overdue);
  const urgent = queue.filter((c) => !c.overdue && c.daysRemaining <= 3);
  const normal = queue.filter((c) => !c.overdue && c.daysRemaining > 3);

  function ClockBadge({ item }: { item: (typeof queue)[number] }) {
    if (item.overdue) {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[oklch(94%_0.10_25)] text-[oklch(35%_0.18_25)] text-[9px] font-semibold">
          <AlertCircle size={9} aria-hidden="true" />
          Overdue
        </span>
      );
    }
    if (item.daysRemaining <= 3) {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[oklch(94%_0.06_75)] text-[oklch(42%_0.12_75)] text-[9px] font-semibold font-mono">
          {item.daysRemaining}d {item.hoursRemaining}h
        </span>
      );
    }
    return (
      <span className="text-[9px] font-mono text-[oklch(42%_0.12_145)] font-semibold">
        {item.daysRemaining}d {item.hoursRemaining}h
      </span>
    );
  }

  function QueueRow({ item }: { item: (typeof queue)[number] }) {
    return (
      <Link
        href={`/safety/${item.id}`}
        className="flex items-center gap-4 px-4 py-3 border-b border-paper-100 hover:bg-paper-50 transition-colors group"
        aria-label={`${item.saeRef} · ${item.meddraPt} · Subject ${item.subjectRef}`}
      >
        <div className="w-24 shrink-0">
          <p className="text-[11px] font-semibold font-mono text-[oklch(20%_0.01_240)]">{item.saeRef}</p>
          <p className="text-[9px] font-mono text-[oklch(55%_0.01_240)]">Subj. {item.subjectRef}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-[oklch(15%_0.01_240)] font-medium truncate">{item.meddraPt}</p>
          <p className="text-[10px] text-[oklch(55%_0.01_240)]">{item.clockType} reporting clock</p>
        </div>
        <div className="shrink-0">
          <ClockBadge item={item} />
        </div>
        <div className="shrink-0">
          <Confidence value={item.confidence} />
        </div>
        <div className="shrink-0 text-[10px] font-medium text-brand-700 group-hover:underline">
          Open →
        </div>
      </Link>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[20px] font-display font-semibold text-[oklch(12%_0.01_240)]">
            Safety &amp; PV
          </h1>
          <p className="text-[12px] text-[oklch(50%_0.01_240)] mt-0.5">
            {cumulative.projectCode} · {queue.length} active SAE narrative{queue.length !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Cumulative strip */}
        <div className="flex items-center gap-6 bg-paper-100 rounded-lg px-4 py-2 shrink-0 border border-paper-200">
          <div className="text-center">
            <p className="text-[18px] font-display font-semibold text-[oklch(15%_0.01_240)] tabular-nums leading-tight">
              {cumulative.totalSaes}
            </p>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">SAEs</p>
          </div>
          <div className="text-center">
            <p className="text-[18px] font-display font-semibold text-[oklch(42%_0.22_25)] tabular-nums leading-tight">
              {cumulative.totalSusars}
            </p>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">SUSARs</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold font-mono text-[oklch(20%_0.01_240)]">{cumulative.dsurDue}</p>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">DSUR due</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold font-mono text-[oklch(20%_0.01_240)]">{cumulative.dsmbNext}</p>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">DSMB next</p>
          </div>
        </div>
      </div>

      {/* Queue sections */}
      <div className="rounded-lg border border-paper-200 overflow-hidden bg-white">
        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-2 bg-paper-50 border-b border-paper-200">
          <div className="w-24 shrink-0 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
            SAE ref
          </div>
          <div className="flex-1 text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
            MedDRA PT
          </div>
          <div className="shrink-0 w-24 text-right text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
            Deadline
          </div>
          <div className="shrink-0 w-16 text-right text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide">
            Confidence
          </div>
          <div className="shrink-0 w-12" />
        </div>

        {overdue.length > 0 && (
          <>
            <div className="px-4 py-1 bg-[oklch(97%_0.02_25)] border-b border-[oklch(90%_0.04_25)]">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[oklch(42%_0.18_25)]">
                Overdue
              </span>
            </div>
            {overdue.map((item) => (
              <QueueRow key={item.id} item={item} />
            ))}
          </>
        )}
        {urgent.length > 0 && (
          <>
            <div className="px-4 py-1 bg-[oklch(98%_0.015_75)] border-b border-[oklch(90%_0.04_75)]">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[oklch(42%_0.12_75)]">
                Due within 3 days
              </span>
            </div>
            {urgent.map((item) => (
              <QueueRow key={item.id} item={item} />
            ))}
          </>
        )}
        {normal.length > 0 && (
          <>
            <div className="px-4 py-1 bg-paper-50 border-b border-paper-200">
              <span className="text-[9px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)]">
                Upcoming
              </span>
            </div>
            {normal.map((item) => (
              <QueueRow key={item.id} item={item} />
            ))}
          </>
        )}

        {queue.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[oklch(50%_0.01_240)]">No active SAE narratives</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SafetyPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 40px)" }}>
      <Suspense fallback={<QueueSkeleton />}>
        <SafetyQueueContent />
      </Suspense>
    </div>
  );
}
