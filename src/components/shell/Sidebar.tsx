import { CheckCircle2, Settings } from "lucide-react";
import { MOCK_ORG, MOCK_USER } from "@/lib/mock-data";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-[200px] shrink-0 h-full bg-paper-50 border-r border-paper-200 overflow-hidden">
      {/* Wordmark */}
      <div className="px-3 py-3 border-b border-paper-200">
        <div className="flex items-center gap-1.5">
          {/* DNA helix mark */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="10" cy="10" r="9" fill="oklch(58% 0.10 185)" />
            <path
              d="M7 5.5c1 1 2 1.5 3 1.5s2-.5 3-1.5M7 14.5c1-1 2-1.5 3-1.5s2 .5 3 1.5M10 7v6"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-[15px] tracking-tight text-[oklch(20%_0.01_240)]">
            Cohortly
          </span>
        </div>
      </div>

      {/* Org switcher */}
      <div className="px-3 py-2 border-b border-paper-200">
        <button className="flex items-center gap-2 w-full rounded-md px-1.5 py-1 hover:bg-paper-200 transition-colors text-left">
          <span className="w-5 h-5 rounded bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
            {MOCK_ORG.name[0]}
          </span>
          <span className="flex-1 truncate text-[11px] font-medium text-[oklch(25%_0.01_240)]">
            {MOCK_ORG.name}
          </span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-[oklch(55%_0.01_240)]"
          >
            <path
              d="M2 3.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Nav groups */}
      <SidebarNav />

      {/* Footer */}
      <div className="border-t border-paper-200">
        {/* KB sync status */}
        <div className="px-3 py-2 border-b border-paper-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={11} className="text-success shrink-0" />
              <span className="text-[10px] text-[oklch(40%_0.01_240)]">
                Knowledge
              </span>
              <span className="text-[10px] font-medium text-success">
                Synced
              </span>
            </div>
            <button
              aria-label="Knowledge base settings"
              className="text-[oklch(55%_0.01_240)] hover:text-[oklch(30%_0.01_240)] transition-colors"
            >
              <Settings size={12} />
            </button>
          </div>
          <p className="mt-0.5 text-[10px] text-[oklch(55%_0.01_240)] font-mono">
            14m ago · 482k chunks
          </p>
        </div>

        {/* User block */}
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
            {MOCK_USER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] truncate">
              {MOCK_USER.name}
            </p>
            <p className="text-[10px] text-[oklch(50%_0.01_240)] truncate">
              {MOCK_USER.title}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
