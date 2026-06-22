# Spec — Competitive Intelligence

> Route: `app/(app)/intel/page.tsx` · Nav: Intelligence · Screen: S13
> Screenshot: `@context/screenshots/competitive-intelligence.png`
> References: `@project-overview.md` (§5 S13, §7 `CompetingTrial`/`Approval`/`Site`), `@coding-standards.md` (Part B), `@ai-interaction.md`

## Purpose
Therapeutic-area landscape and threat tracking: who's recruiting, recent approvals/label decisions, patent cliffs, and where competitors collide with your sites.

## Primary users
`ra_lead`, `clin_ops`.

## Layout
- **Top bar:** breadcrumb "Competitive int… · NASH · Hepatology", Configure alerts, **Export landscape report**.
- **Header:** "NASH / MASH · global · 18-month outlook"; "Tracking N active trials, M approved therapies, K milestones impacting your MAP-204 programme."
- **KPI strip:** Active trials (Δ) · New approvals (e.g. "Resmetirom · first FDA approval") · **Patient pool overlap %** ("high", with UK recruiting trials) · **Site collisions** (e.g. 14/28 shared with 3 competing trials) · Reg. milestones (next 6mo).
- **Main — Active competing trials:** tabs All / Phase III / Phase II / UK overlap; filter. Table: NCT ID, Trial / sponsor, Phase, N, **Enrolled** (bar + %), **Threat** (high/medium/low).
- **Right rail:** **Recent label decisions** (FDA/EMA/MHRA + date) · **Patent & exclusivity cliff watch** (item + date).
- **Bottom — Site overlap analysis (UK):** "Your N sites vs competing trials" heatmap (your sites × competitor trials; counts), "K sites at risk".

## Components
- shadcn: `Table` (+ TanStack), `Card`, `Badge` (threat tones), `Tabs`, `Progress` (enrolled bars).
- new: `CompetingTrialsTable`, `LabelDecisionsRail`, `CliffWatch`, `SiteOverlapHeatmap`.

## Data (Prisma) + retrieval
- `CompetingTrial` (nctId, sponsor, phase, n, enrolledPct, threat, indication), `Approval`, `Site`, patent events.
- **Primary source: AACT via text-to-SQL** (recruiting trials, overlap by site); approvals/labels from regulatory feeds (sync jobs).

## Server actions / API / retrieval
- Read-heavy. Configure alerts action; Export landscape report (PDF). Site-overlap feeds Feasibility.

## Rendering
- **RSC + server fetch**, Suspense; tabs/filter client islands.

## Behaviours
- Tab/filter the trials table; threat sort; heatmap cell → trial/site detail; export report.

## States
- Loading; empty per TA; error; "K sites at risk" warning.

## Compliance notes
- AACT-derived figures carry data-as-of provenance (read-only SQL). Tenant-scoped (your sites/pool). No write to AACT.

## Out of scope (later)
- Alert rule editor depth; multi-TA dashboards.

## Acceptance criteria
- [ ] KPI strip + competing-trials table match screenshot (threat tones, enrolled bars).
- [ ] Site-overlap heatmap renders your sites × competitors; "at risk" count correct.
- [ ] Trial data from validated read-only AACT SQL with data-as-of.
- [ ] Export works; tenant-scoped; a11y; responsive.
