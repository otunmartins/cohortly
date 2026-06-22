# Spec — Knowledge Base

> Route: `app/(app)/knowledge/page.tsx` · Nav: Intelligence · Screen: S14
> Screenshot: `@context/screenshots/knowledge-base.png`
> References: `@project-overview.md` (§2 retrieval, §5 S14, §7 `Source`/`Chunk`/`Citation`), `@coding-standards.md` (§A8, Part B), `@ai-interaction.md`

## Purpose
Ask-anything semantic search across global regulations + institutional memory, with citation-grade answers. **This is the cheapest end-to-end exercise of the retrieval spine — build it first** (`@project-overview.md` §11/§13).

## Primary users
All roles; heaviest for Regulatory Affairs / Medical Writers.

## Layout
- **Top bar:** breadcrumb "Knowledge base", ⌘K, Recent, Ingest documents, Manage sources.
- **Hero:** "Ask Cohortly anything across global regulations and your institutional memory." Subline: "Hybrid retrieval — dense + BM25 — with citation-grade provenance."
- **Query bar** + **Ask**; **source filters** (FDA / EMA / MHRA·ILAP / ICH / Internal SOPs / CT.gov / PubMed); date range.
- **Synthesised answer card:** confidence %, source count, latency; plain-English answer with **inline citations [n] source**; actions: Copy with citations, Insert into Module 2.7, Share.
- **Source passages · ranked:** Relevance / Recency / Authority sort; per-passage `[n] authority · kind · date`, score, cited-count, snippet; Open source / Copy citation / Pin to project.
- **Right rail:** Index health (Synced) · **Sources** with chunk counts (Regulators, ICH, CT.gov+EU CTR, PubMed, Internal SOPs, Prior CSRs; total ~482k) · Recent ingests · Pinned (project).

## Components
- shadcn: `Command` (⌘K), `Card`, `Badge`, `Tabs`, `Input`.
- bespoke: `<Citation/>`, `<Confidence/>`.
- new: `KbAnswer` (streamed), `SourcePassageCard`, `SourceFilters`, `IndexHealthRail`.

## Data (Prisma) + retrieval
- **Vector RAG path** (`@coding-standards.md` Part B): hybrid dense (pgvector) + BM25 + rerank → constrained synthesis with **verified citations**.
- Models: `Source`, `Chunk` (vector + metadata), `Citation`. Filters map to chunk metadata (authority, jurisdiction, date).

## Server actions / API
- `POST /api/kb/search` → proxy to AI service; **streams** synthesised answer + returns ranked chunks. Returns `{ text, citations[], confidence, modelVersion, retrieval{} }`.
- "Insert into Module" hands the cited answer to the active document.

## Rendering
- Route handler / server action with **token-streamed** answer; passages render progressively.

## Behaviours
- Filters constrain retrieval (pre-filter, not post). Sort toggles re-rank displayed passages. Pin → project sources.

## States
- Streaming (skeleton + tokens), empty ("No sources matched — broaden filters"), error.

## Compliance notes
- **Every citation must resolve to a retrieved chunk** (citation verification) before display. Persist provenance; write retrieval `AuditEvent`. Tenant-scoped internal sources; global corpus shared read-only.

## Out of scope (later)
- Multi-turn follow-ups; cross-answer comparison.

## Acceptance criteria
- [ ] Streamed answer with inline `<Citation/>` + `<Confidence/>`.
- [ ] Filters pre-filter retrieval; sort re-ranks passages.
- [ ] No hallucinated citations (verification enforced); provenance persisted + audited.
- [ ] Tenant isolation on internal sources; a11y; responsive.
