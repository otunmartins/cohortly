# Current Feature

App Shell

## Status

Completed

## Goals

Build the persistent application shell (sidebar + top bar + mobile nav) without implementing any screen UI.

- Mock data: `src/lib/mock-data.ts` — Priya Shah / Maple Therapeutics
- Tailwind v4 `@theme` design tokens (teal/amber/paper palettes, Instrument Serif / Inter Tight / JetBrains Mono)
- Desktop sidebar: Cohortly wordmark, 3 nav groups (Workspace / Authoring / Intelligence), KB sync footer, user block
- Top bar: breadcrumb (pathname-derived), ⌘K search field, notifications bell
- Mobile: sidebar collapses to sheet (triggered from hamburger in top bar or "More" in bottom tab bar) + bottom tab bar
- Empty stub pages for all 21 routes so no links 404

## Notes

- `ShellClient` is the only stateful island — owns `mobileOpen` state, wires TopBar ↔ MobileSheet ↔ BottomTabBar
- `Sidebar` is a Server Component; `SidebarNav` is client-only (needs `usePathname`)
- No `tailwind.config.*` — all theme config in `globals.css` via `@theme`
- `npm run build`, lint, and `tsc --noEmit` all pass clean

## History

- **2026-06-22** — Initial Next.js and Tailwind setup. Committed as `chore: initial next.js and tailwind setup`.
- **2026-06-22** — App shell built (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to master.
