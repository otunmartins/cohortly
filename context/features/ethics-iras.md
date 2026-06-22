# Spec — Ethics & IRAS Assistant

> Route: `app/(app)/ethics/[id]/page.tsx` · Nav: Authoring · Screen: S11
> Screenshot: `@context/screenshots/ethics-and-iras.png`
> References: `@project-overview.md` (§5 S11, §7 `EthicsApplication`/`FormSection`), `@coding-standards.md`, `@ai-interaction.md`

## Purpose
Assemble a UK HRA/IRAS application: auto-populate answers from the protocol, track completion + required documents, check HRA compliance, and prep the REC/NIHR pack.

## Primary users
`researcher` (NHS/academic), `ra_lead`.

## Layout
- **Top bar:** breadcrumb "Ethics & IRAS · MAP-204 · IRAS application", Submission pack, **Submit to HRA**.
- **Left rail:** "UK · HRA / IRAS · Project ID … · v2.3"; **Completion %** bar; **sections A–H** with progress (e.g. "Participants 14/17", active highlighted) + status dots; **Required documents** checklist (Protocol, IB, PIS·adult, ICF·adult, GP letter, DPIA, Sponsor insurance) with status.
- **Center — section editor:** Section header (e.g. "D · Participants & recruitment", "Auto-populated from protocol"); per-question cards (D1–D4): question, answer, **Auto / Edited** badge, source + **confidence %** (e.g. "Protocol §3.4 · 98%"); a PIS card with **Plain English · reading age · Flesch** + Preview; metrics row (reading age, words, sections, HRA template version).
- **Right rail:** **HRA compliance check** (UK Policy Framework, Equality Act 2010, Inclusion & Diversity 2022, DPA 2018, Mental Capacity Act — pass/warn/n-a); gap callout ("DPIA missing in section F12 — required for UK GDPR. Generate from protocol →"); **REC review timeline** (Submission → Validation → REC meeting → Opinion → HRA approval); **NIHR portfolio** eligibility + Adopt to portfolio.

## Components
- shadcn: `Accordion`, `Progress`, `Badge`, `Card`, `Button`.
- bespoke: `<Confidence/>`, `<Citation/>` (source on answers).
- new: `IrasSectionNav`, `RequiredDocsChecklist`, `HraComplianceRail`, `RecTimeline`, `NihrPortfolioCard`.

## Data (Prisma)
- `EthicsApplication` (irasId, version, completionPct) → `FormSection` (A–H, answeredJson, completePct, status), `Document` (required docs incl. PIS/ICF/DPIA). Answers reference protocol sources.

## Server actions / API / retrieval
- Auto-populate answers from protocol via `POST /api/generate` (**RAG** over protocol + HRA guidance + SOPs), cited + confidence. Edit answer (Auto→Edited, audited). "Generate from protocol" for missing docs (e.g. DPIA). Submit to HRA / Submission pack actions.

## Rendering
- Server data + client islands (section editing, answer regenerate).

## Behaviours
- Section nav; per-answer Auto vs Edited; PIS readability preview; compliance warnings drive gap actions; timeline reflects status.

## States
- Loading; section incomplete; generating answer; error; gap warnings (e.g. missing DPIA).

## Compliance notes
- Auto answers carry source + confidence; edits audited (Auto→Edited). PIS readability scored (reading age/Flesch). Tenant-scoped; UK data residency for NHS tenants.

## Out of scope (later)
- Direct IRAS portal integration; multi-REC routing.

## Acceptance criteria
- [ ] Section A–H progress + required-docs checklist + completion % match screenshot.
- [ ] Auto-populated answers show source + confidence; edits flip to Edited + audited.
- [ ] HRA compliance rail + gap actions (e.g. Generate DPIA) work; REC timeline renders.
- [ ] PIS readability scored; tenant-scoped/UK-resident; a11y.
