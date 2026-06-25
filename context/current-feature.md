# Current Feature: Safety & Pharmacovigilance (S12)

## Status

In Progress

## Goals

- Narrative queue page (`/safety`) listing SAE cases with due-window badges and confidence scores
- SAE detail page (`/safety/[saeId]`) with 3-pane layout: structured case panel (left), narrative tabs (center), queue + signals + cumulative rail (right)
- `CaseDataPanel` — demographics, MedDRA event, concomitant meds, relevant history; expedited badge + reporting clock
- `NarrativeEditor` — AI-drafted narrative via `<AIDraftBlock/>` with highlighted CRF fields; Narrative / Timeline / Labs tabs; footer metrics (clock, template adherence, MedDRA accuracy, regulatory destinations)
- `NarrativeQueue` — other SAEs with due-window countdown and confidence indicators
- `SignalDetectionCard` — possible signal (neutropenia n=4, PRR=4.2, χ²=8.9) with Open assessment CTA
- `CumulativeSafety` — SAE/SUSAR totals, DSUR due date, DSMB next date for MAP-204
- TopBar: breadcrumb "Safety & PV · SAE-1142 · Subject 04-218", **Due in 3d 4h** countdown, E2B(R3) export button, Medical sign-off button
- Mock data in `src/lib/data/safety.ts` backed by types in `src/types/safety.ts`
- Stub server actions: `generateNarrative`, `acceptNarrativeSuggestion`, `rejectNarrativeSuggestion`, `medicalSignOff`, `exportE2b`
- Tenant-scoped; no PHI in logs; loading/empty/error states; keyboard accessible

## Notes

- Route: `app/(app)/safety/page.tsx` (queue) + `app/(app)/safety/[saeId]/page.tsx`
- Mock phase: all data from `src/lib/data/safety.ts`; no live AI or E2B XML generation
- Reuse `<Confidence/>` and `<AIDraftBlock/>` shared components (already built)
- Reporting clocks are regulatory deadlines — display prominently with colour-coded urgency
- Medical sign-off stubs the e-sign + audit lock flow (same pattern as `signOffDocument` in writing)
- Screenshot reference: `context/screenshots/safety-and-pv.png`

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
- **2026-06-22** — Dashboard (S03) built: KPI strip, review queue (tabbed, client island), regulatory pulse, audit trail, active studies grid. Introduced `src/lib/data/`, `src/types/`, `<Confidence/>` shared component, and migrated projects page to data-access layer per seed-spec. Verified in browser.
- **2026-06-23** — Inbox (S05) built: two-pane layout (list + detail), six filter tabs with unread counts, 8 mock threads across all domain types, thread detail with full message + reply composer (Attach / Cite source / Draft with Cohortly stubbed), Mark all read, mobile-responsive collapse with Back button, loading skeleton and empty-per-filter states. Verified in browser. Merged to main.
- **2026-06-23** — Knowledge Base (S14) built: hero with 482k-chunk counter, query bar + 7-authority source filters + example queries, synthesised answer card with inline `<Citation/>` chips + `<Confidence/>`, ranked source passage cards (score bar, authority badges, Open/Copy/Pin actions), sort tabs (Relevance/Recency/Authority), index health rail (categories, recent ingests, pinned study), idle/loading/answered state machine. Introduced `<Citation/>` shared component. Verified in browser. Merged to main.
- **2026-06-23** — Protocol Intake (S06) built: three-mode tab (Guided/Freeform/Import), Guided form with MeSH autocomplete, phase picker, six design toggles, jurisdiction picker (5 regions), endpoint suggestions panel, RHF + zod validation, Generate button gated on `isValid`. Right rail shows 10 SPIRIT sections + live KB sources. TopBar updated with Protocol breadcrumb, Save draft, Templates. Submit stubs to `protocols/[id]` draft-generating placeholder. Merged to main.
- **2026-06-23** — Protocol Copilot (S07) built: 3-pane TipTap editor (compliance meters + section nav left, editor with CitationNode inline chips center, ranked sources rail right). Custom CitationNode TipTap extension renders inline `<Citation/>` chips from ProseMirror JSON. `<AIDraftBlock/>` recommendation cards with accept/dismiss/precedents. `<GenerationComposer/>` bottom bar with RAG context, cite-all toggle, Generate. TopBar updated with protocol breadcrumb + Versions/Share/Submit for review. Stub server actions (saveSection, acceptSuggestion, rejectSuggestion, submitForReview). New shared `ActionResult<T>` type. Verified in browser. Merged to main.
- **2026-06-24** — Eligibility Engine (S08) built: KPI strip (combined feasibility %, screen failure %, time-to-enrol, comparator trial bars), criteria table (All/Inclusion/Exclusion/Flagged tabs, feasibility bars, source badges, Reg-mandated badges, inline amber warnings), scenario levers with live ±pp pool recompute, demographic representation bars vs FDA Diversity Plan thresholds with unmet-group warning, site readiness list. `CriteriaTable`, `CriterionRow`, `ScenarioLevers`, `DemographicBars`, `SiteReadinessList`, `EligibilityClient`, `EligibilityKpiHeader` components. Stub server actions (`updateCriterion`, `addCriterion`, `removeCriterion`) with audit scaffolding. New `src/types/eligibility.ts`, `src/lib/data/eligibility.ts`. TopBar updated with eligibility breadcrumb, Regenerate, Save to protocol. Verified in browser. Merged to main.
- **2026-06-25** — Feasibility Simulator (S09) built: 5-KPI strip (Time to N, Eligible pool, Activation cost, Prob. of success, Critical path), Recharts `ComposedChart` enrolment forecast with P10/P50/P90 bands + 95% CI + sponsor plan/target dashed reference lines + N=320 marker, scenario levers rail (3 sliders: sites/UK allocation/screen-failure %; 4 toggles: adaptive interim/NIHR portfolio/DCT/patient stipend; Run 1,000 simulations button), site landscape (UK/EU/US tabs, top-12 projected rate bars), competing trials table (mock AACT data, threat badges). `FeasibilityKpiHeader`, `EnrolmentForecastChart`, `ScenarioLevers`, `SiteLandscape`, `CompetingTrialsList`, `FeasibilityClient` components. Stub server actions (`runFeasibility`, `lockBaseline`, `duplicateScenario`) with audit scaffolding. New `src/types/feasibility.ts`, `src/lib/data/feasibility.ts`. Installed recharts. TopBar updated with feasibility breadcrumb, Duplicate scenario, Lock baseline. Merged to main.
- **2026-06-25** — Competitive Intelligence (S13) built: KPI strip (active trials Δ, new approvals, patient pool overlap %, site collisions, reg milestones), competing trials table (All/Phase III/Phase II/UK overlap tabs, threat badges, enrolled progress bars), label decisions rail (FDA/EMA/MHRA), patent & exclusivity cliff watch, site-overlap heatmap (your sites × competitor trials, at-risk count). `IntelKpiHeader`, `CompetingTrialsTable`, `LabelDecisionsRail`, `CliffWatch`, `SiteOverlapHeatmap`, `IntelClient` components. Stub server actions (`configureAlerts`, `exportLandscapeReport`). New `src/types/intel.ts`, `src/lib/data/intel.ts`, `src/actions/intel.ts`. TopBar updated with Competitive Intel breadcrumb + Configure alerts + Export landscape report. Merged to main.
- **2026-06-25** — Regulatory Writing (S10) built: 3-pane eCTD module authoring for IND-019 Onaplazib §2.7.4 Summary of Clinical Safety. Left rail: eCTD module tree (Modules 1–5, recursive children, status icons) + Consistency Check panel (error/warning/ok with expandable details). Center: TipTap editor with CitationNode inline chips + reviewer flag annotation + `<AIDraftBlock/>` (renal safety draft, confidence 81%, gated on human accept/reject). Right rail: Comments/Sources/History tabs (human + AI comments with confidence, 7 cited sources, 5-entry audit trail) + Document Health meters (Source-traceable 88%, Terminology 74%, SPIRIT 91%, Flesch 38) + provenance block (21 CFR 11, content hash). `EctdModuleTree`, `ConsistencyCheck`, `DocHealthRail`, `CommentThread`, `RegWritingClient` components. Stub server actions (`saveWritingSection`, `acceptWritingSuggestion`, `rejectWritingSuggestion`, `addWritingComment`, `exportEctd`, `signOffDocument`). New `src/types/writing.ts`, `src/lib/data/writing.ts`, `src/actions/writing.ts`. TopBar updated with writing breadcrumb + Export eCTD + Sign-off. Merged to main.
