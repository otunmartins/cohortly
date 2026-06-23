import { Suspense } from "react";
import { getKbAnswer, getKbIndexHealth } from "@/lib/data/knowledge";
import { KbClient } from "@/components/knowledge/KbClient";

const ORG_ID = "org_maple_001";

function KbSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="border-b border-paper-200 bg-paper-50 px-6 py-5">
        <div className="text-center mb-5 space-y-2">
          <div className="h-3 w-48 mx-auto rounded bg-paper-200" />
          <div className="h-8 w-2/3 mx-auto rounded bg-paper-200" />
          <div className="h-4 w-1/2 mx-auto rounded bg-paper-200" />
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="h-9 rounded-lg bg-paper-200" />
        </div>
      </div>
      <div className="flex-1 max-w-5xl mx-auto px-6 py-5 w-full flex justify-end">
        <div className="hidden lg:block w-[220px] xl:w-[240px] space-y-2">
          <div className="h-48 rounded-lg bg-paper-200" />
          <div className="h-32 rounded-lg bg-paper-200" />
        </div>
      </div>
    </div>
  );
}

async function KbContent() {
  const [answer, health] = await Promise.all([
    getKbAnswer(ORG_ID),
    getKbIndexHealth(ORG_ID),
  ]);
  return <KbClient answer={answer} health={health} />;
}

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<KbSkeleton />}>
        <KbContent />
      </Suspense>
    </div>
  );
}
