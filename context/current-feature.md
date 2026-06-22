# Current Feature: Dashboard (S03)

## Status

In Progress

## Goals

Build the Dashboard screen — personalised home base showing review queue, study health, regulatory pulse, and audit trail.

Route: `app/(app)/dashboard/page.tsx` · Nav: Workspace · Screen: S03

- **Top bar:** breadcrumb "Dashboard", ⌘K, Import, + New project, notifications
- **Header:** greeting + date ("Good morning, Priya · Monday 11 May 2026"); subline "N documents awaiting review · M submissions due this week"; Today / Week / Quarter toggle
- **KPI strip (4 cards):** Active studies (count + Δ + "across N indications") · Documents in review (count + Δ + "M below SLA") · Open regulatory queries (count + Δ + "K escalated to MHRA") · AI evidence coverage % ("of generated statements")
- **My queue / Awaiting your review:** tabs All / Protocols / Reg writing / Safety; rows show type icon, study/doc id, title, tags, confidence %, age, Open button
- **Right rail:** Regulatory Pulse (Live badge; MHRA/FDA/EMA/ICH updates) · Provenance — Audit trail today (21 CFR 11 badge; timestamped actor → action rows)
- **Below:** Active studies grid (cards link to project)
- RSC + Suspense streaming; period toggle as client island

## Components

- shadcn: `Card`, `Badge`, `Progress`, `Tabs`, `Avatar`, `Separator`
- Bespoke: `<Confidence/>` (queue rows)
- New: `KpiCard`, `ReviewQueueRow`, `RegPulseItem`, `AuditTrailRow`

## Data

- `Project[]` active counts by indication, `ReviewTask[]` assigned to user with confidence/SLA, `Document[]` in-review counts, `RegUpdate[]` pulse feed, `AuditEvent[]` today — all tenant-scoped
- KPIs are aggregates with period deltas (Today / Week / Quarter)
- Mock data from `src/lib/data/dashboard.ts` (following seed-spec data-access pattern)

## Notes

- All reads tenant-scoped by `organizationId` — no mutations on this screen
- Audit-trail panel is a read of the append-only `AuditEvent` log — render only, never mutate
- Period toggle refetches KPIs + queue; queue tabs filter by domain
- Loading skeletons per card/section; empty state ("Your queue is clear"); error per region (don't fail whole page)
- "Open" in queue rows routes to the item's editor
- WCAG 2.1 AA; responsive mobile → desktop

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
