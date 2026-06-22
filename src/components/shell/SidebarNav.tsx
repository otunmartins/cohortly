"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Inbox,
  FlaskConical,
  Users,
  FileText,
  Shield,
  Scale,
  Activity,
  Globe,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Projects", href: "/projects", icon: Layers, count: 12 },
      { label: "Inbox", href: "/inbox", icon: Inbox, count: 4 },
    ],
  },
  {
    label: "Authoring",
    items: [
      { label: "Protocol Copilot", href: "/protocols/new", icon: FlaskConical, count: 8 },
      { label: "Eligibility Engine", href: "/eligibility", icon: Users },
      { label: "Regulatory Writing", href: "/writing", icon: FileText },
      { label: "Safety & PV", href: "/safety", icon: Shield },
      { label: "Ethics & IRAS", href: "/ethics", icon: Scale },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Feasibility Simulator", href: "/feasibility", icon: Activity },
      { label: "Competitive Intel", href: "/intel", icon: Globe },
      { label: "Knowledge Base", href: "/knowledge", icon: BookOpen },
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex-1 overflow-y-auto py-2 px-2">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-2 py-1 text-[10px] font-semibold tracking-widest uppercase text-[oklch(55%_0.01_240)]">
            {group.label}
          </p>
          <ul>
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-2 py-[5px] rounded-md text-[12px] font-medium transition-colors ${
                      active
                        ? "bg-brand-500 text-white"
                        : "text-[oklch(35%_0.01_240)] hover:bg-paper-200 hover:text-[oklch(20%_0.01_240)]"
                    }`}
                  >
                    <Icon
                      size={14}
                      strokeWidth={active ? 2 : 1.75}
                      className="shrink-0"
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-brand-100 text-brand-700"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export { NAV_GROUPS };
