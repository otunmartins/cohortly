# Spec — Regulatory Writing

> Route: `app/(app)/writing/[docId]/page.tsx` · Nav: Authoring · Screen: S10
> Screenshot: `@context/screenshots/regulatory-writing.png`
> References: `@project-overview.md` (§5 S10, §7 `Document`/`Citation`/`Comment`), `@coding-standards.md` (§A8, §A10), `@ai-interaction.md`

> 🧱 **Mock phase (now):** Build the eCTD module tree, TipTap editor, consistency check, comments, doc-health meters, and the AI-drafted block UI against `ectdModules`, `consistencyChecks`, and `regWritingDoc` from `@/src/lib/mock-data.ts` via a thin `src/lib/data/writing.ts` function. **Stub** Generate, accept/edit/reject, Sign-off/e-signature, and Export eCTD (UI state only — no `/api/generate`, no real lock/hash). The RAG generation + e-sign/audit wiring lands in later phases. The sections below describe the target state.

## Purpose
eCTD module authoring (e.g. IND-019, Module 2.7 Clinical Summary): draft regulated sections with grounded generation, cross-module consistency checks, reviewer comments, and provenance — then export eCTD.

## Primary users
`med_writer`, `ra_lead`; review by `qa_reviewer`.

## Layout
- **Top bar:** breadcrumb "Regulatory writing · IND-019 Onaplazib · Module 2.7", version + edit count, **Export eCTD**, **Sign-off**.
- **Left rail:** **eCTD module tree** (Module 1–5, sub-nodes e.g. 2.3/2.4/2.5/2.7 with completion ticks; active node highlighted) · **Consistency check** (Cross-module issues, Terminology/MedDRA, References broken, Numbering OK).
- **Center — editor:** "Module 2.7 · §2.7.4 Summary of Clinical Safety"; **TipTap** body with **inline citations** ([2][4] CSR, [11][13] ISS, [7] DSUR, [20] FDA·DILI, [15] ICH E14); **AI-drafted block** (confidence %, N sources retrieved, "Awaiting human approval", **Accept / Edit / Reject / Regenerate / Show sources**); reviewer flags pinned to paragraphs.
- **Right rail:** tabs **Comments / Sources / History** (human + AI comments with confidence); **Document Health** (Source-traceable %, Terminology %, SPIRIT %, Plain-English Flesch); **Provenance** (21 CFR 11, "every statement linked to source", content **hash**).

## Components
- shadcn: `Tabs`, `Progress` (health meters), `Card`, `Button`, `Badge`.
- editor: **TipTap** + comment threads + citation mark.
- bespoke: `<Citation/>`, `<Confidence/>`, `<AIDraftBlock/>`.
- new: `EctdModuleTree`, `ConsistencyCheck`, `DocHealthRail`, `CommentThread`.

## Data (Prisma)
- `Document` (type CTD_2_7/IND), `Section`, `Citation`, `Comment`, `CtdModule` (tree), `DocVersion` (immutable), `ReviewTask`.

## Server actions / API / retrieval
- `saveSection` (autosave), `acceptSuggestion`/`reject`, comment CRUD, `approveDocument(docId, signatureMeaning)` (e-sign + lock), Export eCTD (`/api/export/[docId]`).
- Generate via `POST /api/generate` (**RAG** over CSR/ISS/DSUR/guidance), streamed, cited.

## Rendering
- **Client editor island** + server actions; rails RSC. Optimistic edits, autosave.

## Behaviours
- AI block accept/edit/reject/regenerate; comments pin to paragraphs; consistency check flags (e.g. SAE % mismatch vs ISS table); Sign-off requires review + captures e-signature meaning + locks + hashes.

## States
- Loading; generating (awaiting approval); review/edit modes; error.

## Compliance notes
- **Human-in-the-loop + e-signature:** no transition to APPROVED/LOCKED without `ReviewTask` approval; `approveDocument` captures signature meaning, writes `AuditEvent`, sets immutable `DocVersion` + content hash. Citations verified; provenance persisted. Tenant-scoped.

## Out of scope (later)
- Full eCTD publishing/packaging pipeline (export stub → PDF first); live co-editing.

## Acceptance criteria
- [ ] Module tree + consistency check + doc-health meters match screenshot.
- [ ] AI-drafted blocks gate on human accept; citations verified + clickable.
- [ ] Sign-off captures e-signature meaning, locks doc, writes immutable version + hash + audit.
- [ ] Comments pin to paragraphs; tenant-scoped; a11y.
