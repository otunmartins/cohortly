# Current Feature: Feasibility Simulator (S09)

## Status

In Progress

## Goals

- Render KPI row: Time to N=320, Eligible pool, Activation cost, Probability of success, Critical path
- Enrolment forecast chart (Recharts): P10/P50/P90 + CI band vs Sponsor plan and Target lines; Monte Carlo seed label + Re-simulate button
- Scenario levers rail: sliders (Sites activated, UK allocation %, Screen-failure %) + toggles (Adaptive interim, NIHR portfolio, DCT, Patient stipend); Run 1,000 simulations button
- Site landscape: UK/EU/US tabs; top-12 sites with projected enrolment/month bars
- Competing trials panel: recruiting NASH F2–F3 table (NCT, sponsor, N, % enrolled) from mock AACT data
- TopBar: breadcrumb, Duplicate scenario, Lock baseline actions
- States: simulating (progress), empty (no run yet → prompt), error
- Stub server actions: `runFeasibility`, `lockBaseline`, `duplicateScenario` with audit scaffolding
- All data from `src/lib/data/feasibility.ts` backed by mock data — no real Monte Carlo

## Notes

- Route: `app/(app)/feasibility/[id]/page.tsx` · Screen S09 · Nav: Intelligence
- Client islands for chart + levers; server-fetched KPIs and initial data passed as props
- Components: `EnrolmentForecastChart`, `ScenarioLevers`, `SiteLandscape`, `CompetingTrialsList`, `FeasibilityKpiHeader`, `FeasibilityClient`
- shadcn: `Slider`, `Switch`, `Tabs`, `Card`, `Button`; Recharts for the forecast area chart
- Competing trials are mocked now; real AACT text-to-SQL comes in a later phase
- Lever change → triggers re-simulate stub → chart + KPIs update from recomputed mock
- Lock baseline and Duplicate scenario are audited actions (stub)
- Tenant-scoped; a11y; responsive (mobile collapses levers to sheet)

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
- **2026-06-22** — Dashboard (S03) built: KPI strip, review queue (tabbed, client island), regulatory pulse, audit trail, active studies grid. Introduced `src/lib/data/`, `src/types/`, `<Confidence/>` shared component, and migrated projects page to data-access layer per seed-spec. Verified in browser.
- **2026-06-23** — Inbox (S05) built: two-pane layout (list + detail), six filter tabs with unread counts, 8 mock threads across all domain types, thread detail with full message + reply composer (Attach / Cite source / Draft with Cohortly stubbed), Mark all read, mobile-responsive collapse with Back button, loading skeleton and empty-per-filter states. Verified in browser. Merged to main.
- **2026-06-23** — Knowledge Base (S14) built: hero with 482k-chunk counter, query bar + 7-authority source filters + example queries, synthesised answer card with inline `<Citation/>` chips + `<Confidence/>`, ranked source passage cards (score bar, authority badges, Open/Copy/Pin actions), sort tabs (Relevance/Recency/Authority), index health rail (categories, recent ingests, pinned study), idle/loading/answered state machine. Introduced `<Citation/>` shared component. Verified in browser. Merged to main.
- **2026-06-23** — Protocol Intake (S06) built: three-mode tab (Guided/Freeform/Import), Guided form with MeSH autocomplete, phase picker, six design toggles, jurisdiction picker (5 regions), endpoint suggestions panel, RHF + zod validation, Generate button gated on `isValid`. Right rail shows 10 SPIRIT sections + live KB sources. TopBar updated with Protocol breadcrumb, Save draft, Templates. Submit stubs to `protocols/[id]` draft-generating placeholder. Merged to main.
- **2026-06-23** — Protocol Copilot (S07) built: 3-pane TipTap editor (compliance meters + section nav left, editor with CitationNode inline chips center, ranked sources rail right). Custom CitationNode TipTap extension renders inline `<Citation/>` chips from ProseMirror JSON. `<AIDraftBlock/>` recommendation cards with accept/dismiss/precedents. `<GenerationComposer/>` bottom bar with RAG context, cite-all toggle, Generate. TopBar updated with protocol breadcrumb + Versions/Share/Submit for review. Stub server actions (saveSection, acceptSuggestion, rejectSuggestion, submitForReview). New shared `ActionResult<T>` type. Verified in browser. Merged to main.
- **2026-06-24** — Eligibility Engine (S08) built: KPI strip (combined feasibility %, screen failure %, time-to-enrol, comparator trial bars), criteria table (All/Inclusion/Exclusion/Flagged tabs, feasibility bars, source badges, Reg-mandated badges, inline amber warnings), scenario levers with live ±pp pool recompute, demographic representation bars vs FDA Diversity Plan thresholds with unmet-group warning, site readiness list. `CriteriaTable`, `CriterionRow`, `ScenarioLevers`, `DemographicBars`, `SiteReadinessList`, `EligibilityClient`, `EligibilityKpiHeader` components. Stub server actions (`updateCriterion`, `addCriterion`, `removeCriterion`) with audit scaffolding. New `src/types/eligibility.ts`, `src/lib/data/eligibility.ts`. TopBar updated with eligibility breadcrumb, Regenerate, Save to protocol. Verified in browser. Merged to main.
