# Current Feature

## Status

Not Started

## Goals

<!-- bullet points of what success looks like -->

## Notes

<!-- additional context, constraints, or details from spec -->

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
- **2026-06-22** — Dashboard (S03) built: KPI strip, review queue (tabbed, client island), regulatory pulse, audit trail, active studies grid. Introduced `src/lib/data/`, `src/types/`, `<Confidence/>` shared component, and migrated projects page to data-access layer per seed-spec. Verified in browser.
- **2026-06-23** — Inbox (S05) built: two-pane layout (list + detail), six filter tabs with unread counts, 8 mock threads across all domain types, thread detail with full message + reply composer (Attach / Cite source / Draft with Cohortly stubbed), Mark all read, mobile-responsive collapse with Back button, loading skeleton and empty-per-filter states. Verified in browser. Merged to main.
- **2026-06-23** — Knowledge Base (S14) built: hero with 482k-chunk counter, query bar + 7-authority source filters + example queries, synthesised answer card with inline `<Citation/>` chips + `<Confidence/>`, ranked source passage cards (score bar, authority badges, Open/Copy/Pin actions), sort tabs (Relevance/Recency/Authority), index health rail (categories, recent ingests, pinned study), idle/loading/answered state machine. Introduced `<Citation/>` shared component. Verified in browser. Merged to main.
