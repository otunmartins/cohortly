# Current Feature: Inbox (S05)

## Status

In Progress

## Goals

- Two-pane layout (list + detail): thread list on left, full message + reply composer on right; list collapses to full-width on mobile with detail opening in a sheet.
- Filter tabs: All / Unread (n) / Mentions / Reviews / Safety / Regulator — filters work and unread counts are accurate.
- Thread list shows sender, subject, snippet, domain badge (Reg Writing / Regulator / Eligibility / Safety / Ethics), linked study (e.g. `MAP-204`), urgency dot, age, and unread state.
- Detail pane shows thread header (domain tag, study id, urgency label), full message, and a Reply composer with "Draft with Cohortly" (stubbed), Attach, and "Cite source" (inserts `<Citation/>`).
- Mark all read action in the top bar.
- Loading skeleton, empty-per-filter, and error states.
- Tenant-scoped; keyboard list navigation; WCAG 2.1 AA.

## Notes

- **Mock phase only:** all data comes from `inboxThreads` in `src/lib/mock-data.ts` via a thin `src/lib/data/inbox.ts` function.
- "Draft with Cohortly" and "Cite source" are **stubbed** — no real generation or `/api/generate` call. RAG + provenance wiring is deferred to the AI phase.
- AI safety flag threads are just `Notification` rows surfaced here — the AI ran on the Safety screen, not Inbox.
- RSC for the list + Suspense; detail pane + composer are client islands.
- Use shadcn: `ScrollArea`, `Badge`, `Avatar`, `Button`, `Tabs`, `Textarea`.
- Bespoke: `<InboxList/>`, `<InboxThread/>`, `<ReplyComposer/>`.
- Route: `app/(app)/inbox/page.tsx`.

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
- **2026-06-22** — Dashboard (S03) built: KPI strip, review queue (tabbed, client island), regulatory pulse, audit trail, active studies grid. Introduced `src/lib/data/`, `src/types/`, `<Confidence/>` shared component, and migrated projects page to data-access layer per seed-spec. Verified in browser.
