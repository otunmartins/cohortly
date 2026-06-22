import { Suspense } from "react";
import { Radio, ShieldCheck } from "lucide-react";
import { getDashboardData, getActiveProjects } from "@/lib/data/dashboard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ReviewQueue } from "@/components/dashboard/ReviewQueue";
import { RegPulseItem } from "@/components/dashboard/RegPulseItem";
import { AuditTrailRow } from "@/components/dashboard/AuditTrailRow";
import { PeriodToggle } from "@/components/dashboard/PeriodToggle";
import { ProjectCard } from "@/components/projects/ProjectCard";

const ORG_ID = "org_maple_001";

function KpiSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-paper-200 animate-pulse" />
      ))}
    </div>
  );
}

function QueueSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 rounded bg-paper-200 animate-pulse" />
      ))}
    </div>
  );
}

function RailSkeleton() {
  return <div className="h-48 rounded-lg bg-paper-200 animate-pulse" />;
}

async function DashboardContent() {
  const [data, activeProjects] = await Promise.all([
    getDashboardData(ORG_ID),
    getActiveProjects(ORG_ID),
  ]);

  return (
    <>
      {/* KPI strip */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.label} metric={kpi} />
        ))}
      </div>

      {/* Main + right rail */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 mt-4">
        {/* Review queue */}
        <section className="bg-paper-50 border border-paper-200 rounded-lg p-4">
          <h2 className="text-[11px] font-semibold text-[oklch(25%_0.01_240)] uppercase tracking-wide mb-3">
            Awaiting your review
          </h2>
          <ReviewQueue items={data.reviewQueue} />
        </section>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          {/* Regulatory Pulse */}
          <section className="bg-paper-50 border border-paper-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Radio size={11} className="text-[oklch(50%_0.01_240)]" aria-hidden="true" />
                <h2 className="text-[11px] font-semibold text-[oklch(25%_0.01_240)] uppercase tracking-wide">
                  Regulatory
                </h2>
              </div>
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-success/10 rounded text-[9px] font-semibold text-success uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Live
              </span>
            </div>
            {data.regPulse.map((update) => (
              <RegPulseItem key={update.id} update={update} />
            ))}
          </section>

          {/* Audit trail */}
          <section className="bg-paper-50 border border-paper-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-[oklch(50%_0.01_240)]" aria-hidden="true" />
                <h2 className="text-[11px] font-semibold text-[oklch(25%_0.01_240)] uppercase tracking-wide">
                  Provenance
                </h2>
              </div>
              <span className="px-1.5 py-0.5 bg-paper-200 rounded text-[9px] font-semibold text-[oklch(40%_0.01_240)] uppercase tracking-wide">
                21 CFR 11
              </span>
            </div>
            <p className="text-[10px] text-[oklch(50%_0.01_240)] mb-2">Audit trail today</p>
            {data.auditTrail.map((entry) => (
              <AuditTrailRow key={entry.id} entry={entry} />
            ))}
          </section>
        </div>
      </div>

      {/* Active studies */}
      {activeProjects.length > 0 && (
        <section className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-semibold text-[oklch(25%_0.01_240)] uppercase tracking-wide">
              Active studies
            </h2>
            <span className="text-[10px] text-[oklch(55%_0.01_240)]">
              {activeProjects.length} projects
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] text-[oklch(55%_0.01_240)] uppercase tracking-widest mb-1">
            Monday 11 May 2026
          </p>
          <h1 className="font-display text-[26px] leading-tight text-[oklch(12%_0.01_240)]">
            Good morning, Priya.
          </h1>
          <p className="text-[11px] text-[oklch(45%_0.01_240)] mt-1">
            4 documents awaiting your review · 2 submissions due this week
          </p>
        </div>
        <Suspense fallback={null}>
          <PeriodToggle />
        </Suspense>
      </div>

      {/* Streamed content */}
      <Suspense
        fallback={
          <div className="space-y-4">
            <KpiSkeleton />
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
              <QueueSkeleton />
              <div className="space-y-4">
                <RailSkeleton />
                <RailSkeleton />
              </div>
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  );
}
