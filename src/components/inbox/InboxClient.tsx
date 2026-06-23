"use client";

import { useState } from "react";
import { CheckCheck, X } from "lucide-react";
import type { InboxFilter, InboxThread } from "@/types/inbox";
import { DomainBadge } from "./DomainBadge";
import { InboxThreadDetail } from "./InboxThreadDetail";

const FILTERS: { key: InboxFilter; label: string }[] = [
  { key: "all",       label: "All" },
  { key: "unread",    label: "Unread" },
  { key: "mentions",  label: "Mentions" },
  { key: "reviews",   label: "Reviews" },
  { key: "safety",    label: "Safety" },
  { key: "regulator", label: "Regulator" },
];

interface Props {
  threads: InboxThread[];
  unreadCount: number;
}

function filterThreads(threads: InboxThread[], filter: InboxFilter): InboxThread[] {
  switch (filter) {
    case "unread":    return threads.filter((t) => t.isUnread);
    case "mentions":  return threads.filter((t) => t.kind === "mention");
    case "reviews":   return threads.filter((t) => t.kind === "review");
    case "safety":    return threads.filter((t) => t.kind === "safety_flag");
    case "regulator": return threads.filter((t) => t.kind === "regulator");
    default:          return threads;
  }
}

export function InboxClient({ threads: initialThreads, unreadCount: initialUnread }: Props) {
  const [threads, setThreads] = useState(initialThreads);
  const [activeFilter, setActiveFilter] = useState<InboxFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(initialThreads[0]?.id ?? null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const unreadCount = threads.filter((t) => t.isUnread).length;
  const visible = filterThreads(threads, activeFilter);
  const selected = threads.find((t) => t.id === selectedId) ?? null;

  function selectThread(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
    // Mark as read
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isUnread: false } : t)),
    );
  }

  function markAllRead() {
    setThreads((prev) => prev.map((t) => ({ ...t, isUnread: false })));
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-paper-200 bg-paper-50 shrink-0">
        <h1 className="font-display text-[18px] text-[oklch(12%_0.01_240)]">Inbox</h1>
        <button
          type="button"
          onClick={markAllRead}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-[oklch(40%_0.01_240)] hover:bg-paper-200 transition-colors"
          aria-label="Mark all messages as read"
        >
          <CheckCheck size={13} aria-hidden="true" />
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div
        className="flex items-center gap-0.5 px-3 py-1.5 border-b border-paper-200 bg-paper-50 shrink-0 overflow-x-auto"
        role="tablist"
        aria-label="Inbox filters"
      >
        {FILTERS.map(({ key, label }) => {
          const isActive = activeFilter === key;
          const badge = key === "unread" ? unreadCount : 0;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-[oklch(45%_0.01_240)] hover:bg-paper-200"
              }`}
            >
              {label}
              {badge > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold tabular-nums ${
                    isActive ? "bg-white/25 text-white" : "bg-brand-500 text-white"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Two-pane body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thread list */}
        <div
          className={`flex flex-col border-r border-paper-200 overflow-y-auto shrink-0 w-full md:w-[300px] lg:w-[340px] ${
            mobileDetailOpen ? "hidden md:flex" : "flex"
          }`}
          role="listbox"
          aria-label="Inbox threads"
        >
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12 text-center px-4">
              <p className="text-[12px] text-[oklch(50%_0.01_240)]">
                No messages in this filter.
              </p>
            </div>
          ) : (
            visible.map((thread) => {
              const isSelected = thread.id === selectedId;
              return (
                <button
                  key={thread.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectThread(thread.id)}
                  className={`w-full text-left px-3 py-2.5 border-b border-paper-200 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 ${
                    isSelected
                      ? "bg-brand-50 border-l-2 border-l-brand-500"
                      : "hover:bg-paper-100"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Avatar */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                      style={{
                        backgroundColor:
                          thread.senderColor ?? "oklch(45% 0.08 240)",
                      }}
                      aria-hidden="true"
                    >
                      {thread.senderInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Row 1 */}
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[12px] leading-none truncate ${
                            thread.isUnread
                              ? "font-semibold text-[oklch(15%_0.01_240)]"
                              : "font-medium text-[oklch(30%_0.01_240)]"
                          }`}
                        >
                          {thread.sender}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          {thread.urgency === "urgent" && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-[oklch(52%_0.20_25)] shrink-0"
                              aria-label="Urgent"
                            />
                          )}
                          {thread.isUnread && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
                              aria-label="Unread"
                            />
                          )}
                          <span className="text-[10px] text-[oklch(55%_0.01_240)] font-mono">
                            {thread.age}
                          </span>
                        </div>
                      </div>

                      {/* Row 2 — subject */}
                      <p
                        className={`text-[11px] mt-0.5 truncate leading-snug ${
                          thread.isUnread
                            ? "text-[oklch(20%_0.01_240)] font-medium"
                            : "text-[oklch(35%_0.01_240)]"
                        }`}
                      >
                        {thread.subject}
                      </p>

                      {/* Row 3 — snippet */}
                      <p className="text-[11px] mt-0.5 line-clamp-2 text-[oklch(55%_0.01_240)] leading-snug">
                        {thread.snippet}
                      </p>

                      {/* Row 4 — tags */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <DomainBadge tag={thread.domainTag} />
                        <span className="font-mono text-[9px] text-[oklch(55%_0.01_240)]">
                          {thread.studyCode}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail pane — desktop: always visible; mobile: sheet */}
        <div
          className={`flex-1 overflow-hidden ${
            mobileDetailOpen ? "flex flex-col" : "hidden md:flex md:flex-col"
          }`}
        >
          {/* Mobile back button */}
          {mobileDetailOpen && (
            <div className="flex items-center px-3 py-2 border-b border-paper-200 bg-paper-50 md:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileDetailOpen(false)}
                className="flex items-center gap-1 text-[11px] text-brand-700 font-medium"
                aria-label="Back to inbox list"
              >
                <X size={13} aria-hidden="true" />
                Back
              </button>
            </div>
          )}

          {selected ? (
            <InboxThreadDetail thread={selected} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-[12px] text-[oklch(55%_0.01_240)]">
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
