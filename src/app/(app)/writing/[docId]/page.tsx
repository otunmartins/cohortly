import { Suspense } from "react";
import { RegWritingClient } from "@/components/writing/RegWritingClient";
import { getRegWritingDoc } from "@/lib/data/writing";

// Loading skeleton matching the 3-pane layout
function RegWritingSkeleton() {
  return (
    <div className="flex overflow-hidden animate-pulse" style={{ height: "calc(100vh - 40px)" }}>
      {/* Left rail */}
      <aside className="w-56 shrink-0 border-r border-paper-200 bg-paper-50 p-3 space-y-2 hidden md:block">
        <div className="h-3 w-20 bg-paper-200 rounded mb-3" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-5 bg-paper-200 rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
        ))}
        <div className="border-t border-paper-200 pt-4 space-y-2">
          <div className="h-3 w-24 bg-paper-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 bg-paper-200 rounded" />
          ))}
        </div>
      </aside>
      {/* Center */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 p-8 space-y-4 bg-white">
        <div className="h-5 w-64 bg-paper-200 rounded" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 bg-paper-100 rounded" style={{ width: `${95 - i * 5}%` }} />
          ))}
        </div>
      </div>
      {/* Right rail */}
      <aside className="w-64 shrink-0 border-l border-paper-200 bg-paper-50 p-3 space-y-3 hidden lg:block">
        <div className="h-3 w-28 bg-paper-200 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-paper-200 rounded" />
        ))}
      </aside>
    </div>
  );
}

async function RegWritingContent({ docId }: { docId: string }) {
  // Tenant id would come from session in real impl; mock org used here
  const doc = await getRegWritingDoc("org_maple_001", docId);
  return <RegWritingClient doc={doc} />;
}

interface PageProps {
  params: Promise<{ docId: string }>;
}

export default async function RegulatoryWritingPage({ params }: PageProps) {
  const { docId } = await params;
  return (
    <Suspense fallback={<RegWritingSkeleton />}>
      <RegWritingContent docId={docId} />
    </Suspense>
  );
}
