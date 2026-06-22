# Spec — Projects

> Route: `app/(app)/projects/page.tsx` (+ `[projectId]/page.tsx`) · Nav: Workspace · Screen: S04
> Screenshot: `@context/screenshots/projects-ui.png`
> References: `@project-overview.md` (§5 S04, §7 `Project`), `@coding-standards.md`, `@ai-interaction.md, `@context/screenshots/projects-ui.png`

## Purpose

All studies in the tenant, browsable three ways, filterable, searchable.

## Primary users

All roles.

## Layout

- **Top bar:** breadcrumb "Projects", ⌘K, Import, **+ New project**.
- **Header:** "All studies · {Org} · {N} projects · {M} active"; **Grid / Table / Timeline** view switch; "Search by name, ID, sponsor…"; "Showing X of Y".
- **Filter chips:** Phase · Indication · Status (removable).
- **Grid cards:** study code (`MAP-204`), status badge (Recruiting / Pre-IND / In screening / In follow-up / Reporting / Draft), title, `Phase · indication · regions`, **Enrolment progress** (e.g. 198/320 + bar), owner avatar, site count, open-items badge.

## Components

- shadcn: `Card`, `Table` (+ TanStack Table for sort/virtualise), `Tabs` (views), `Badge`, `Input`, `DropdownMenu` (filters), `Progress`, `Avatar`.
- new: `ProjectCard`, `ProjectsTable`, `ProjectsTimeline` (gantt), `FilterChips`.

## Data (Prisma)

- `Project[]` (tenant-scoped) with enrolment rollups (`targetEnrolment` vs actual via `enrolment_event`/derived), `Site` count, open `ReviewTask`/`Document` count for the badge, owner `User`.

## Server actions / API / retrieval

- Read-only list with filter/search params. No retrieval. `createProject(input)` action behind **+ New project** (routes to intake).

## Rendering

- **RSC + server fetch**; view switch + filters as client islands that update search params.

## Behaviours

- View switch (Grid/Table/Timeline). Filter chips + text search compose (AND). Card/row click → `[projectId]`.

## States

- Loading skeleton grid/rows; empty ("No studies match these filters"); error.

## Compliance notes

- Tenant-scoped list; `createProject` validates + RBAC + emits `AuditEvent` in-transaction.

## Out of scope (later)

- Bulk actions; saved filter views; CSV export.

## Acceptance criteria

- [ ] Three views render from the same data; switch preserves filters.
- [ ] Enrolment bar + status badge correct per study.
- [ ] Tenant-scoped; createProject audited.
- [ ] Table virtualises for large lists; responsive; a11y.
