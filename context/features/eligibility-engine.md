# Spec — Eligibility Engine

> Route: `app/(app)/eligibility/[id]/page.tsx` · Nav: Authoring · Screen: S08
> Screenshot: `@context/screenshots/eligibility-engine.png`
> References: `@project-overview.md` (§5 S08, §7 `Criterion`/`FeasibilityRun`), `@coding-standards.md` (Part B text-to-SQL), `@ai-interaction.md`

## Purpose
Criteria builder with live feasibility modelling: see how each inclusion/exclusion criterion narrows the pool, scenario-model relaxations, and check demographic + site readiness.

## Primary users
`clin_ops`, `ra_lead`.

## Layout
- **Top bar:** breadcrumb "Eligibility · MAP-204 · Criteria builder", **Regenerate**, **Save to protocol**.
- **KPI header:** Combined feasibility (e.g. 23.4% of UK NASH pool, "Tight") · Projected screen failure (38%, "benchmark 31–44%") · Time to enrol (14.2 mo, "−2.1 vs default") · Compare to active NASH trials (per-NCT %).
- **Criteria table:** tabs All / Inclusion (n) / Exclusion (n) / Flagged (n); Optimise; Group by section. Columns: **ID** (I1…/E1…), **Criterion**, **Feasibility** (0–100 bar + number), **Source** (Precedent / EMA SAWP / WHO / Sponsor SOP / FDA mandate / AASLD / ICH E14 / CMC), **Mand.** (Reg badge); inline warnings ("Narrows pool by 14.2% beyond precedent median — consider relaxing", "Inconsistent across sites").
- **Add row:** "Add criterion or paste a draft — validate against MedDRA, ICD-10, and precedent."
- **Right rail:** **Scenario modelling** (toggle levers with ±pp, e.g. Relax E3 +3.2pp; modelled eligible pool) · **Demographic representation** (Female, Black/African, South Asian, Hispanic, Age 65+) vs **FDA Diversity Plan** thresholds (warn if unmet) · **Site readiness · top N** (score per site).

## Components
- shadcn: `Table` (+ TanStack), `Switch`/`Slider` (levers), `Progress` (feasibility bars), `Badge`.
- new: `CriteriaTable`, `CriterionRow`, `ScenarioLevers`, `DemographicBars`, `SiteReadinessList`.
- Client island for live what-if recompute.

## Data (Prisma) + retrieval
- `Criterion` (kind, text, feasibility 0–100, source, regMandated), `FeasibilityRun` (scenario + results).
- **Feasibility/precedent figures via text-to-SQL over AACT** (precedent medians, pool, comparator trials). Criterion validation against MedDRA/ICD-10 (service).

## Server actions / API / retrieval
- `updateCriterion(id, patch)`; add/remove criterion (audited). Scenario toggle → recompute (`POST /api/feasibility/simulate` or lightweight model). Regenerate criteria → `POST /api/generate`. Save to protocol writes criteria into the protocol document.

## Rendering
- Server data + **client islands** (table edits, scenario levers) with live recompute.

## Behaviours
- Edit criterion → revalidate + recompute feasibility. Toggle lever → modelled pool Δ updates. Flagged tab surfaces warnings. Save to protocol persists.

## States
- Loading; empty (no criteria → "Add or generate"); recomputing; error. Diversity-threshold warning banner.

## Compliance notes
- Criterion edits audited; `regMandated` criteria flagged. AACT figures carry data-as-of provenance (read-only SQL). Tenant-scoped.

## Out of scope (later)
- Multi-arm criteria; criterion-level version history.

## Acceptance criteria
- [ ] Table matches screenshot (IDs, feasibility bars, sources, Reg badges, warnings).
- [ ] Scenario levers recompute modelled pool live with ±pp deltas.
- [ ] Demographic vs FDA thresholds with unmet warnings; site readiness list.
- [ ] Edits audited; precedent figures from validated read-only SQL; a11y.
