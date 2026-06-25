import { Suspense } from "react";
import { getSafetyCase } from "@/lib/data/safety";
import { SafetyClient } from "@/components/safety/SafetyClient";

function SafetySkeleton() {
  return (
    <div className="flex overflow-hidden animate-pulse" style={{ height: "calc(100vh - 40px)" }}>
      {/* Left rail */}
      <aside className="w-52 shrink-0 border-r border-paper-200 bg-paper-50 p-3 space-y-3 hidden md:block">
        <div className="h-5 w-32 bg-paper-200 rounded" />
        <div className="h-3 w-24 bg-paper-200 rounded" />
        <div className="border-t border-paper-200 pt-3 space-y-2">
          <div className="h-3 w-16 bg-paper-200 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-paper-200 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      </aside>
      {/* Center */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 p-6 space-y-4 bg-white">
        <div className="h-5 w-56 bg-paper-200 rounded" />
        <div className="flex gap-3 mb-2">
          <div className="h-5 w-16 bg-paper-200 rounded" />
          <div className="h-5 w-16 bg-paper-200 rounded" />
          <div className="h-5 w-16 bg-paper-200 rounded" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 bg-paper-100 rounded" style={{ width: `${95 - i * 5}%` }} />
        ))}
      </div>
      {/* Right rail */}
      <aside className="w-60 shrink-0 border-l border-paper-200 bg-paper-50 p-3 space-y-3 hidden lg:block">
        <div className="h-3 w-24 bg-paper-200 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-paper-200 rounded" />
        ))}
      </aside>
    </div>
  );
}

async function SafetyCaseContent({ saeId }: { saeId: string }) {
  const data = await getSafetyCase("org_maple_001", saeId);
  return <SafetyClient data={data} />;
}

interface PageProps {
  params: Promise<{ saeId: string }>;
}

export default async function SafetyCasePage({ params }: PageProps) {
  const { saeId } = await params;
  return (
    <Suspense fallback={<SafetySkeleton />}>
      <SafetyCaseContent saeId={saeId} />
    </Suspense>
  );
}
