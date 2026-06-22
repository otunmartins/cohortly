# Spec — Feasibility Simulator

> Route: `app/(app)/feasibility/[id]/page.tsx` · Nav: Intelligence · Screen: S09
> Screenshot: `@context/screenshots/trial-feasibility.png`
> References: `@project-overview.md` (§5 S09, §7 `FeasibilityRun`/`Site`/`CompetingTrial`), `@coding-standards.md` (Part B), `@ai-interaction.md`

## Purpose
Monte-Carlo enrolment + scenario simulation: forecast time-to-N under different levers, compare to sponsor plan/target, and see site landscape + competing trials.

## Primary users
`clin_ops`, `ra_lead`.

## Layout
- **Top bar:** breadcrumb "Feasibility Simulator · MAP-204 · NASH Ph…", Duplicate scenario, **Lock baseline**.
- **KPI row:** Time to N=320 (14.2 mo, Δ) · Eligible pool (23.4%, "tight") · Activation cost (£2.1M, Δ) · Probability of success (68%, +pp) · Critical path (512 days, Δ; "IND → DBL").
- **Enrolment forecast chart (Recharts):** cumulative subjects monthly, **P10/P50/P90** + 95% CI band; lines: Cohortly forecast (P50), Sponsor plan, Target; "Seed: 1,000 Monte Carlo runs"; Re-simulate.
- **Right rail — Scenario:** Active levers (sliders: Sites activated, UK allocation %, Screen-failure %; toggles: Adaptive interim, NIHR portfolio, DCT, Patient stipend); Reset; **Run 1,000 simulations**.
- **Bottom-left — Site landscape:** UK/EU/US tabs; top-12 sites projected enrolment/month (bars).
- **Bottom-right — Competing trials:** recruiting NASH F2–F3 (NCT, sponsor, N, % enrolled).

## Components
- shadcn: `Slider`, `Switch`, `Tabs`, `Card`, `Button`.
- charts: **Recharts** area + reference lines (P-bands, target).
- new: `EnrolmentForecastChart`, `ScenarioLevers`, `SiteLandscape`, `CompetingTrialsList`.

## Data (Prisma) + retrieval
- `FeasibilityRun` (scenario Json, results Json, isBaseline), `Site` (per-site rates), `CompetingTrial` (from **AACT via text-to-SQL** — recruiting NASH F2–F3).

## Server actions / API / retrieval
- `runFeasibility(projectId, scenario)` → enqueue Monte-Carlo job (`POST /api/feasibility/simulate`), poll/stream results. Lock baseline / Duplicate scenario actions (audited). Competing trials refreshed from AACT (read-only).

## Rendering
- Server data + **client islands** (levers, chart). Re-simulate is a job; show progress.

## Behaviours
- Move lever → "Run simulations" reruns Monte Carlo, chart + KPIs update. P10/P50/P90 toggle. Lock baseline freezes a scenario for comparison.

## States
- Simulating (progress), empty (no run yet → "Run first simulation"), error.

## Compliance notes
- Scenario runs + baseline locks audited. Competing-trial data carries AACT data-as-of. Tenant-scoped.

## Out of scope (later)
- Regulatory critical-path gantt detail; cost-model editing.

## Acceptance criteria
- [ ] Forecast chart renders P10/P50/P90 + CI vs sponsor/target.
- [ ] Levers re-run sim (job), KPIs + chart update; lock/duplicate work.
- [ ] Site landscape + competing trials from AACT (read-only, data-as-of).
- [ ] Runs audited; tenant-scoped; a11y; responsive.
