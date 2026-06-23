import { Suspense } from "react";
import { getInboxThreads, getUnreadCount } from "@/lib/data/inbox";
import { InboxClient } from "@/components/inbox/InboxClient";

const ORG_ID = "org_maple_001";

function InboxSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-10 border-b border-paper-200 bg-paper-100" />
      <div className="h-9 border-b border-paper-200 bg-paper-50" />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-[300px] lg:w-[340px] border-r border-paper-200 space-y-px p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded bg-paper-200" />
          ))}
        </div>
        <div className="hidden md:block flex-1 bg-paper-50" />
      </div>
    </div>
  );
}

async function InboxContent() {
  const [threads, unreadCount] = await Promise.all([
    getInboxThreads(ORG_ID),
    getUnreadCount(ORG_ID),
  ]);

  return <InboxClient threads={threads} unreadCount={unreadCount} />;
}

export default function InboxPage() {
  return (
    <div className="flex flex-col h-full">
      <Suspense fallback={<InboxSkeleton />}>
        <InboxContent />
      </Suspense>
    </div>
  );
}
