# Spec — Protocol Copilot

> Route: `app/(app)/protocols/[id]/page.tsx` · Nav: Authoring · Screen: S07
> Screenshot: `@context/screenshots/protocol-copilot.png`
> References: `@project-overview.md` (§5 S07, §7 `Document`/`Section`/`Citation`/`Source`), `@coding-standards.md` (§A8, §A10), `@ai-interaction.md`

> 🧱 **Mock phase (now):** Build the three-pane editor (TipTap), section nav, compliance meters, retrieved-sources rail, and recommendation cards against `protocolSections`, `protocolComplianceMeters`, `protocolRetrievedSources`, and `protocolRecommendation` from `@/src/lib/mock-data.ts` via a thin `src/lib/data/protocol.ts` function. **Stub** Generate, autosave, and accept/reject suggestion (UI state only — no `/api/generate`). The RAG + text-to-SQL precedent generation lands in the **AI/AACT phase**. The sections below describe the target state.

## Purpose
Three-pane protocol editor: author SPIRIT-compliant sections with grounded generation, inline citations, live compliance, and retrieved-source transparency.

## Primary users
`clin_ops`, `ra_lead`, `med_writer`.

## Layout — three panes
- **Top bar:** breadcrumb "Protocol · MAP-204 · Draft", Versions, Share, **Submit for review**.
- **Left rail:** **Compliance meters** (SPIRIT 32/33, ICH E6(R3) 27/28, MHRA 14/18, CTA) · **Protocol sections** list 1–10 with per-section `src` count + status dot (e.g. "Eligibility 7 src · 2 flagged", "Statistical plan 4 src · 1 gap").
- **Center — editor:** Section title + "last edited by"; Edit / Review / Compare; **TipTap** body with **inline citation chips** ([14] FDA·Adaptive Designs, [3] MAP-204 IB, [1] ICH E6(R3) §5.18…); **Recommendation card** (constrained gen, confidence %, precedent-backed, Insert paragraph / Show N precedents / Dismiss); **generation composer** (RAG chunk count, TA, Phase, model+temp, "Cite all generated text" toggle, Attach / Sources / Templates / Generate).
- **Right rail:** **Retrieved sources (N)** ranked with relevance scores ([1] ICH 93, [3] Sponsor 91…) + Therapeutic-area evidence (precedent protocols, approved labels, FDA correspondence, sponsor SOPs).

## Components
- shadcn: `Tabs`, `Progress` (compliance meters), `Card`, `Button`, `Toggle`.
- editor: **TipTap** with a custom **citation mark**.
- bespoke: `<Citation/>`, `<Confidence/>`, `<AIDraftBlock/>` (recommendation cards).
- new: `SectionNav`, `ComplianceMeters`, `RetrievedSourcesRail`, `GenerationComposer`.

## Data (Prisma)
- `Document` (type PROTOCOL) → `Section[]` (TipTap `contentJson`, `complianceScore`, status) → `Citation[]` → `Source`. `Suggestion` for recommendation cards.

## Server actions / API / retrieval
- `saveSection(docId, sectionId, json)` (debounced autosave, audited).
- `acceptSuggestion` / `rejectSuggestion`.
- `submitForReview(docId, assigneeId)` → `ReviewTask`.
- Generate → `POST /api/generate` (streamed; **RAG** for guidance + **text-to-SQL** for precedent counts e.g. "23 of 27 precedent trials"); returns cited text + confidence + modelVersion.

## Rendering
- **Client editor island** + server actions; right/left rails RSC where possible. Optimistic edits, autosave.

## Behaviours
- Generate inserts an `<AIDraftBlock/>`; accept commits text + persists citations; compliance meters update on save; citation chip click opens source in right rail.

## States
- Editor loading; section empty (composer prompt); generation streaming; error.

## Compliance notes
- **Human-in-the-loop:** generated text is a draft until accepted; can't lock without review. Every accepted statement persists `Citation` + provenance; **citations verified** against retrieved set. Autosave + accept/reject emit `AuditEvent` (USER + AI). Tenant-scoped.

## Out of scope (later)
- Real-time multi-user co-editing; full Compare/diff (stub Compare tab).

## Acceptance criteria
- [ ] Three panes match screenshot; section nav + compliance meters reflect live state.
- [ ] Generation streams, inserts `<AIDraftBlock/>`, accept persists cited text.
- [ ] Citations verified + clickable; autosave + suggestion actions audited.
- [ ] Submit for review creates a `ReviewTask`; tenant-scoped; a11y.
