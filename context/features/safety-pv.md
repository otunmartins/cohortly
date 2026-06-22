# Spec — Safety & Pharmacovigilance

> Route: `app/(app)/safety/page.tsx` (queue) + `safety/[saeId]/page.tsx` · Nav: Authoring · Screen: S12
> Screenshot: `@context/screenshots/safety-and-pv.png`
> References: `@project-overview.md` (§5 S12, §7 `SafetyCase`/`Narrative`/`Signal`/`MedDRATerm`), `@coding-standards.md` (§A8, §A10), `@ai-interaction.md`

## Purpose
SAE narrative workspace: generate a regulator-ready narrative from structured CRF data, track reporting clocks, surface safety signals, and export E2B(R3).

## Primary users
`pv` (medical monitor); review/sign-off by medical.

## Layout
- **Top bar:** breadcrumb "Safety & PV · SAE-1142 · Subject 04-218", **Due in 3d 4h**, E2B(R3), **Medical sign-off**.
- **Left rail — structured case:** expedited badge (15-day), SAE id, subject, "MAP-204 · Site UK-04 · onaplazib 60 mg"; **Demographics** (sex, age, ethnicity, BMI, NAS·fibrosis); **Event** (MedDRA PT + code, SOC, onset, severity, outcome, causality); **Concomitant meds**; **Relevant history**.
- **Center — narrative:** AI-drafted badge (confidence %, "Generated from CRF · N source fields · sponsor template v3.1"); tabs **Narrative / Timeline / Labs**; the narrative with **extracted CRF fields highlighted**; footer metrics (Reporting clock, Template adherence X/Y, MedDRA accuracy %, Regulatory destinations MHRA·FDA·EMA).
- **Right rail:** **Narrative queue** (other SAEs with due-window + confidence) · **Signal detection** ("Possible signal: neutropenia n=4 vs IB expected n≤1, PRR=4.2, χ²=8.9", Open assessment) · **Cumulative · MAP-204** (SAEs, SUSARs, DSUR due, DSMB next).

## Components
- shadcn: `Card`, `Badge`, `Progress`, `Tabs`, `Button`.
- bespoke: `<Confidence/>`, `<AIDraftBlock/>` (narrative gen).
- new: `CaseDataPanel`, `NarrativeEditor`, `NarrativeQueue`, `SignalDetectionCard`, `CumulativeSafety`.

## Data (Prisma)
- `SafetyCase` (subject, MedDRA PT/SOC, severity, causality, clocks), `Narrative` (contentJson, confidence, status), `Signal` (PRR/χ²/observed/expected), `MedDRATerm`. CRF source fields feed generation.

## Server actions / API / retrieval
- Generate narrative → `POST /api/generate` (docType NARRATIVE; from CRF fields + sponsor template), highlighted-field mapping returned. Accept/Edit/Regenerate. `approveDocument`-style **Medical sign-off** (e-sign + lock). E2B(R3) export (`/api/export`).

## Rendering
- Server case data + client narrative island.

## Behaviours
- Narrative tabs (Narrative/Timeline/Labs); accept/edit; reporting clock counts down; signal card → assessment; queue navigates between cases.

## States
- Loading; generating; awaiting sign-off; overdue clock warning; error.

## Compliance notes
- **Reporting clocks are regulatory deadlines** — surface prominently. Narrative generation is human-gated (medical sign-off before filing). MedDRA coding accuracy tracked. Provenance + audit on generation and sign-off. Tenant-scoped; **no PHI in logs**.

## Out of scope (later)
- Full E2B(R3) XML schema validation; DSUR aggregation (routes to Reg Writing).

## Acceptance criteria
- [ ] Structured case panel + narrative (highlighted fields) + footer metrics match screenshot.
- [ ] Narrative generated from CRF via `<AIDraftBlock/>`; medical sign-off locks + audits.
- [ ] Reporting clock + signal card + cumulative counts render; queue navigates.
- [ ] No PHI in logs; tenant-scoped; a11y.
