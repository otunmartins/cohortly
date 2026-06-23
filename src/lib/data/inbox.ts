import type { InboxFilter, InboxThread } from "@/types/inbox";
import { MOCK_INBOX_THREADS } from "@/lib/mock-data";

export async function getInboxThreads(
  organizationId: string,
  filter: InboxFilter = "all",
): Promise<InboxThread[]> {
  const threads = MOCK_INBOX_THREADS.filter(
    (t) => t.organizationId === organizationId,
  );

  switch (filter) {
    case "unread":
      return threads.filter((t) => t.isUnread);
    case "mentions":
      return threads.filter((t) => t.kind === "mention");
    case "reviews":
      return threads.filter((t) => t.kind === "review");
    case "safety":
      return threads.filter((t) => t.kind === "safety_flag");
    case "regulator":
      return threads.filter((t) => t.kind === "regulator");
    default:
      return threads;
  }
}

export async function getUnreadCount(organizationId: string): Promise<number> {
  return MOCK_INBOX_THREADS.filter(
    (t) => t.organizationId === organizationId && t.isUnread,
  ).length;
}
