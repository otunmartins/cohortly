"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Inbox, MoreHorizontal } from "lucide-react";

const TABS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: Layers },
  { label: "Inbox", href: "/inbox", icon: Inbox },
];

interface BottomTabBarProps {
  onMoreOpen: () => void;
}

export function BottomTabBar({ onMoreOpen }: BottomTabBarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around bg-paper-50 border-t border-paper-200 h-14 md:hidden"
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
              active ? "text-brand-500" : "text-[oklch(50%_0.01_240)]"
            }`}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.75} />
            <span className="text-[9px] font-medium">{label}</span>
          </Link>
        );
      })}
      <button
        aria-label="More navigation options"
        onClick={onMoreOpen}
        className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-[oklch(50%_0.01_240)] transition-colors"
      >
        <MoreHorizontal size={18} strokeWidth={1.75} />
        <span className="text-[9px] font-medium">More</span>
      </button>
    </nav>
  );
}
