# Current Feature: Knowledge Base (S14)

## Status

Complete

## Goals

- Hero search bar with query input + Ask button; source filters (FDA / EMA / MHRA·ILAP / ICH / Internal SOPs / CT.gov / PubMed) and date range.
- Synthesised answer card: confidence %, source count, latency, plain-English answer with inline `<Citation/>` chips; Copy with citations, Insert into Module 2.7, Share actions.
- Source passages list (ranked): Relevance / Recency / Authority sort tabs; per-passage authority badge, kind, date, score, cited-count, snippet; Open source / Copy citation / Pin to project actions.
- Right rail: Index health (Synced, chunk count), Sources breakdown by category, Recent ingests, Pinned to project.
- Loading/streaming skeleton, empty-per-filter state, error state.
- Tenant-scoped; WCAG 2.1 AA; responsive.

## Notes

- **Mock phase only:** all data comes from `sampleKbAnswer` + `knowledgeSources` in `src/lib/mock-data.ts` via a thin `src/lib/data/knowledge.ts` function. Render the streamed-answer UI as a **static mock** — no pgvector, no AI service, no `/api/kb/search` call.
- Bespoke components: `KbAnswer`, `SourcePassageCard`, `SourceFilters`, `IndexHealthRail`.
- Reuse existing shared components: `<Citation/>`, `<Confidence/>`.
- shadcn: `Command`, `Card`, `Badge`, `Tabs`, `Input`.
- Route: `app/(app)/knowledge/page.tsx`.
- This is the cheapest end-to-end exercise of the retrieval spine — lay the UI scaffolding so the AI phase can wire in the real streaming search with minimal friction.

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
- **2026-06-22** — Dashboard (S03) built: KPI strip, review queue (tabbed, client island), regulatory pulse, audit trail, active studies grid. Introduced `src/lib/data/`, `src/types/`, `<Confidence/>` shared component, and migrated projects page to data-access layer per seed-spec. Verified in browser.
- **2026-06-23** — Inbox (S05) built: two-pane layout (list + detail), six filter tabs with unread counts, 8 mock threads across all domain types, thread detail with full message + reply composer (Attach / Cite source / Draft with Cohortly stubbed), Mark all read, mobile-responsive collapse with Back button, loading skeleton and empty-per-filter states. Verified in browser. Merged to main.
