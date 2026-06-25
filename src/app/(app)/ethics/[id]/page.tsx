import { Suspense } from "react";
import { getEthicsApplication } from "@/lib/data/ethics";
import { EthicsClient } from "@/components/ethics/EthicsClient";

function EthicsSkeleton() {
  return (
    <div className="flex overflow-hidden animate-pulse" style={{ height: "calc(100vh - 40px)" }}>
      {/* Left rail */}
      <aside className="w-52 shrink-0 border-r border-paper-200 bg-paper-50 p-3 space-y-3 hidden md:block">
        <div className="h-4 w-32 bg-paper-200 rounded" />
        <div className="h-3 w-24 bg-paper-200 rounded" />
        <div className="h-2 w-full bg-paper-200 rounded-full mt-2" />
        <div className="border-t border-paper-200 pt-3 space-y-1.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-6 bg-paper-200 rounded" style={{ width: `${85 - (i % 3) * 8}%` }} />
          ))}
        </div>
      </aside>
      {/* Center */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-white">
        <div className="h-12 border-b border-paper-200 px-6 flex items-center gap-3">
          <div className="h-4 w-48 bg-paper-200 rounded" />
        </div>
        <div className="px-6 py-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-paper-200 rounded-lg p-4 space-y-2">
              <div className="h-4 w-3/4 bg-paper-200 rounded" />
              <div className="h-3 w-full bg-paper-100 rounded" />
              <div className="h-3 w-5/6 bg-paper-100 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Right rail */}
      <aside className="w-64 shrink-0 border-l border-paper-200 bg-paper-50 p-3 space-y-3 hidden lg:block">
        <div className="h-3 w-28 bg-paper-200 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-paper-200 rounded" />
        ))}
      </aside>
    </div>
  );
}

async function EthicsContent({ ethicsId }: { ethicsId: string }) {
  const data = await getEthicsApplication("org_maple_001", ethicsId);
  return <EthicsClient data={data} />;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EthicsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<EthicsSkeleton />}>
      <EthicsContent ethicsId={id} />
    </Suspense>
  );
}
