# Current Feature

Projects (S04)

## Status

Completed

## Goals

Build the Projects screen — all studies in the tenant, browsable three ways, filterable, and searchable.

Route: `app/(app)/projects/page.tsx` (+ `[projectId]/page.tsx`) · Nav: Workspace · Screen: S04

- **Top bar:** breadcrumb "Projects", ⌘K, Import, **+ New project**
- **Header:** "All studies · {Org} · {N} projects · {M} active"; Grid / Table / Timeline view switch; search input; "Showing X of Y"
- **Filter chips:** Phase · Indication · Status (removable)
- **Grid cards:** study code (`MAP-204`), status badge, title, `Phase · indication · regions`, enrolment progress bar (e.g. 198/320), owner avatar, site count, open-items badge
- **Three views:** Grid, Table (TanStack Table, sortable/virtualized), Timeline (Gantt)
- **RSC + server fetch**; view switch + filters as client islands that update search params
- `createProject(input)` Server Action behind **+ New project**

## Components

- shadcn: `Card`, `Table`, `Tabs`, `Badge`, `Input`, `DropdownMenu`, `Progress`, `Avatar`
- New: `ProjectCard`, `ProjectsTable`, `ProjectsTimeline`, `FilterChips`

## Data

- `Project[]` tenant-scoped with enrolment rollups, `Site` count, open `ReviewTask`/`Document` count, owner `User`
- Mock data from `src/lib/mock-data.ts` for now

## Notes

- View switch, filters, and search compose via search params (AND logic)
- Card/row click → `[projectId]`
- Loading skeleton, empty ("No studies match these filters"), and error states required
- `createProject` must validate + RBAC + emit `AuditEvent` in-transaction
- Table virtualises for large lists; responsive; a11y (WCAG 2.1 AA)

## History

- **2026-06-22** — App Shell completed (sidebar, top bar, mobile nav, design tokens, all stub routes). Merged to main.
- **2026-06-22** — Projects feature built (grid/table/timeline views, filter chips, URL search params, 14 mock projects, TopBar actions, `[projectId]` stub). Verified in browser.
