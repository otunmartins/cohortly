"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu, Upload, Plus, Save, LayoutTemplate, GitBranch, Share2, SendHorizonal, RefreshCw } from "lucide-react";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/inbox": "Inbox",
  "/protocols/new": "New Protocol",
  "/protocols": "Protocol Copilot",
  "/eligibility": "Eligibility Engine",
  "/feasibility": "Feasibility Simulator",
  "/writing": "Regulatory Writing",
  "/ethics": "Ethics & IRAS",
  "/safety": "Safety & PV",
  "/intel": "Competitive Intel",
  "/knowledge": "Knowledge Base",
};

function getTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  for (const [prefix, label] of Object.entries(ROUTE_TITLES)) {
    if (pathname.startsWith(prefix + "/")) return label;
  }
  return "Cohortly";
}

interface TopBarProps {
  onMenuOpen: () => void;
}

export function TopBar({ onMenuOpen }: TopBarProps) {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const isProtocolEditor =
    pathname.startsWith("/protocols/") && pathname !== "/protocols/new";
  const isEligibilityEngine = pathname.startsWith("/eligibility/");

  return (
    <header className="h-10 flex items-center gap-3 px-4 bg-paper-50 border-b border-paper-200 shrink-0">
      {/* Mobile menu trigger */}
      <button
        aria-label="Open navigation menu"
        onClick={onMenuOpen}
        className="md:hidden text-[oklch(40%_0.01_240)] hover:text-[oklch(20%_0.01_240)] transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
        {pathname === "/protocols/new" ? (
          <>
            <span className="text-[11px] text-[oklch(55%_0.01_240)]">Protocol</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">·</span>
            <span className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] truncate">
              New protocol
            </span>
          </>
        ) : isEligibilityEngine ? (
          <>
            <span className="text-[11px] text-[oklch(55%_0.01_240)]">Eligibility</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">·</span>
            <span className="text-[11px] font-mono text-[oklch(40%_0.01_240)]">MAP-204</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">·</span>
            <span className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] truncate">
              Criteria builder
            </span>
          </>
        ) : isProtocolEditor ? (
          <>
            <span className="text-[11px] text-[oklch(55%_0.01_240)]">Protocol</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">·</span>
            <span className="text-[11px] font-mono text-[oklch(40%_0.01_240)]">MAP-204</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">·</span>
            <span className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] truncate">
              Draft
            </span>
          </>
        ) : (
          <>
            <span className="text-[11px] text-[oklch(55%_0.01_240)]">Cohortly</span>
            <span className="text-[11px] text-[oklch(70%_0.01_240)]">/</span>
            <span className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] truncate">
              {title}
            </span>
          </>
        )}
      </nav>

      {/* Search — grows to fill remaining space */}
      <div className="flex-1 max-w-sm mx-auto">
        <label className="sr-only" htmlFor="global-search">
          Search
        </label>
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[oklch(55%_0.01_240)] pointer-events-none"
          />
          <input
            id="global-search"
            type="search"
            placeholder="Search regulations, protocols, studies…"
            className="w-full pl-7 pr-14 py-1 text-[11px] bg-paper-100 border border-paper-200 rounded-md placeholder:text-[oklch(60%_0.01_240)] text-[oklch(20%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[oklch(60%_0.01_240)] bg-paper-200 px-1 py-0.5 rounded border border-paper-300 leading-none pointer-events-none">
            ⌘K
          </span>
        </div>
      </div>

      {/* Page-specific actions */}
      {isEligibilityEngine && (
        <div className="flex items-center gap-1.5">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <RefreshCw size={11} aria-hidden="true" />
            Regenerate
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white rounded-md transition-colors"
            style={{ backgroundColor: "oklch(58% 0.10 185)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
          >
            <Save size={11} aria-hidden="true" />
            Save to protocol
          </button>
        </div>
      )}
      {isProtocolEditor && (
        <div className="flex items-center gap-1.5">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <GitBranch size={11} aria-hidden="true" />
            Versions
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <Share2 size={11} aria-hidden="true" />
            Share
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white rounded-md transition-colors"
            style={{ backgroundColor: "oklch(58% 0.10 185)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
          >
            <SendHorizonal size={11} aria-hidden="true" />
            Submit for review
          </button>
        </div>
      )}
      {pathname === "/protocols/new" && (
        <div className="flex items-center gap-1.5">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <Save size={11} aria-hidden="true" />
            Save draft
          </button>
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <LayoutTemplate size={11} aria-hidden="true" />
            Templates
          </button>
        </div>
      )}
      {pathname === "/projects" && (
        <div className="flex items-center gap-1.5">
          <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[oklch(30%_0.01_240)] border border-paper-200 rounded-md hover:bg-paper-200 transition-colors">
            <Upload size={11} aria-hidden="true" />
            Import
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white rounded-md transition-colors"
            style={{ backgroundColor: "oklch(58% 0.10 185)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)"; }}
          >
            <Plus size={11} aria-hidden="true" />
            New project
          </button>
        </div>
      )}

      {/* Notifications */}
      <div className="ml-auto flex items-center">
        <button
          aria-label="Notifications (3 unread)"
          className="relative text-[oklch(40%_0.01_240)] hover:text-[oklch(20%_0.01_240)] transition-colors p-1"
        >
          <Bell size={15} />
          <span
            aria-hidden="true"
            className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none"
          >
            3
          </span>
        </button>
      </div>
    </header>
  );
}
