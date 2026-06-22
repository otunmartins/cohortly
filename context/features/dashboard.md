# Spec — Dashboard

> Route: `app/(app)/dashboard/page.tsx` · Nav: Workspace · Screen: S03
> Screenshot: `@context/screenshots/dashboard.png` (visual source of truth)
> References: `@project-overview.md` (§5 S03, §7 data model), `@coding-standards.md`, `@ai-interaction.md`

## Purpose
Personalised home base. At a glance: what needs review, what's due, study health, and today's audit activity.

## Primary users
All authoring/operate roles; primary persona Regulatory Affairs (`ra_lead`).

## Layout
- **Top bar:** breadcrumb "Dashboard", ⌘K search, Import, **+ New project**, notifications.
- **Header:** greeting + date ("Good morning, Priya · Monday 11 May 2026"); subline "N documents awaiting review · M submissions due this week"; Today / Week / Quarter toggle.
- **KPI strip (4 cards):** Active studies (count, Δ, "across N indications") · Documents in review (count, Δ, "M below SLA") · Open regulatory queries (count, Δ, "K escalated to MHRA") · **AI evidence coverage %** ("of generated statements").
- **Main — "My queue / Awaiting your review":** tabs All / Protocols / Reg writing / Safety. Each row: type icon, study/doc id (MAP-204, IND-019, SAE-1142, IRAS-77), title, tags (e.g. SPIRIT, ICH E6(R3), Citation gap ×2, MedDRA-coded, 15-day expedited), **confidence %**, age, **Open**.
- **Right rail:** **Regulatory Pulse** (Live badge; auto-indexed MHRA/FDA/EMA/ICH updates with age) · **Provenance — Audit trail today** (21 CFR 11 badge; timestamped `actor → action` rows incl. AI retrievals).
- **Below:** Active studies grid (cards link to project).

## Components
- shadcn: `Card`, `Badge` (status tones + dot), `Progress`, `Tabs`, `Avatar`, `Separator`.
- bespoke: `<Confidence/>` (queue rows).
- new: `KpiCard`, `ReviewQueueRow`, `RegPulseItem`, `AuditTrailRow`.

## Data (Prisma)
- Reads: `Project` (active, counts by indication), `ReviewTask` (assigned to user, with confidence/SLA), `Document` (in-review counts), `RegUpdate` (pulse feed), `AuditEvent` (today, tenant-scoped).
- KPIs are aggregates with period deltas (Today/Week/Quarter).

## Server actions / API / retrieval
- Read-only; no generation. No retrieval path.

## Rendering
- **RSC + Suspense streaming** (read-heavy, fast first paint). Period toggle can be a client island that refetches.

## Behaviours
- Period toggle recomputes KPIs + queue. Queue tabs filter by domain. "Open" routes to the item's editor.

## States
- Loading skeletons per card/section; empty ("Your queue is clear"); error per region (don't fail the whole page).

## Compliance notes
- All reads tenant-scoped by `organizationId`. Audit-trail panel is a **read** of the append-only `AuditEvent` log — render, never mutate.

## Out of scope (later)
- Customisable widgets; saved views.

## Acceptance criteria
- [ ] Matches screenshot regions, responsive mobile→desktop.
- [ ] All data tenant-scoped; no cross-tenant leakage.
- [ ] KPIs show correct period deltas.
- [ ] Queue rows show confidence + route correctly on Open.
- [ ] Loading/empty/error states per region; WCAG 2.1 AA.
