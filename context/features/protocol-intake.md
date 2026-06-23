# Spec — Protocol intake

> Route: `app/(app)/protocols/new/page.tsx` · Nav: Authoring · Screen: S06
> Screenshot: `@context/screenshots/protocol-intake.png`
> References: `@project-overview.md` (§5 S06, §6 generation-as-job), `@coding-standards.md`, `@ai-interaction.md`

> 🧱 **Mock phase (now):** Build the three input modes (Guided / Freeform / Import) and the "What you'll get" rail as UI only, with form state (react-hook-form + zod) validated locally. **Stub** "Generate draft protocol" — instead of `POST /api/generate` + an async job, route to a placeholder `protocols/[id]` (or show a stubbed success). MeSH autocomplete and endpoint suggestions can be static mock lists. The real generation job lands in the **AI phase**. The sections below describe the target state.

## Purpose
The prompt screen that precedes protocol generation. Captures structured trial intent, then kicks off an async draft job → routes to Protocol Copilot.

## Primary users
`clin_ops`, `ra_lead`, `med_writer`.

## Layout
- **Top bar:** breadcrumb "Protocol · New protocol", Save draft, Templates.
- **Header:** "Describe the trial you want to design." Subline about SPIRIT-compliant grounding.
- **Mode tabs:** **Guided** / Freeform prompt / Import existing (.docx/.pdf/NCT ID).
- **Guided form:** Therapeutic area (with **MeSH** autocomplete, e.g. D065626) · Indication · Investigational product (name, modality `Select`, MoA·route·dose) · **Phase** segmented (I / Ib·IIa / II / IIb·III / III) · **design toggles** (Randomised, Double-blind, Placebo-controlled, Active-comparator, Adaptive, Open-label) · Target sample (320 1:1) · Treatment duration · Target FPI · Primary endpoint (textarea, with "Suggested by FDA 2023 NASH guidance · N precedent trials") · **Target jurisdictions** (UK·MHRA ILAP, US·FDA IND, EU·EMA CTIS, CA·Health Canada CTA, AU·TGA CTN).
- **Right rail:** "What you'll get" — SPIRIT-compliant draft, 10 sections listed, "~38–46 pages". "Will reference" knowledge sources (Live).

## Components
- shadcn: `Tabs`, `Input`, `Textarea`, `Select`, `Toggle`/`Switch`, `Card`, `Button`.
- new: `IntakeGuidedForm`, `JurisdictionPicker`, `DesignToggles`, `WhatYoullGetRail`.
- Forms: `react-hook-form` + `zod`.

## Data (Prisma)
- Creates/updates a `Project` (or draft) + a generation job spec. Jurisdictions → required-pathway mapping.

## Server actions / API / retrieval
- Submit → `POST /api/generate` (docType PROTOCOL) → **async job** (Inngest/BullMQ); returns job id; route to `protocols/[id]`. Result lands in Inbox + document. No blocking request.

## Rendering
- **Client form** (RHF) + server-action submit; right rail RSC.

## Behaviours
- Mode switch; MeSH autocomplete; endpoint suggestions from guidance; "Generate draft protocol" disabled until required fields valid.

## States
- Form validation inline; submitting → progress + redirect; error toast.

## Compliance notes
- Validate all inputs (zod). Generation is feature-flaggable per tenant. Job + result audited.

## Out of scope (later)
- Import parsing depth; template library management.

## Acceptance criteria
- [ ] Three modes; Guided validates and enables Generate only when complete.
- [ ] Submit kicks off async job, redirects to Copilot, result reaches Inbox.
- [ ] Jurisdiction selection persisted; zod-validated; a11y; responsive.
