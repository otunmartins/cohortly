# Spec — Prisma + Seed (data layer)

> Phase: after all page UIs are built on mock data, and after Auth. · Branch: `feature/prisma-seed`
> References: `@project-overview.md` (§3 stack, §7 data model + Prisma schema, ERD), `@coding-standards.md` (§1 compliance, §A5 Prisma, §A6 data fetching), `@ai-interaction.md` (workflow), `@/src/lib/mock-data.ts` (the data this seeds from)

## Goal
Introduce Prisma + PostgreSQL, define the schema, migrate, and **seed the operational tables from `mock-data.ts`** — then swap each page's data access from mock functions to tenant-scoped Prisma queries, with **no component rewrites**.

## Scope
- Prisma schema + first migration for **operational tables** (tenant, users, projects, documents, criteria, review/audit, safety, ethics).
- `prisma/seed.ts` populating those tables from the existing `mock-data.ts`.
- Swap the thin data-access functions (`src/lib/data/*`) from mock → Prisma, page by page.

## Out of scope (later phases — do NOT touch here)
- **AACT** (`ctgov` read-only snapshot) — a data *load*, not a Prisma seed. `CompetingTrial`/`Approval` may be seeded as **dev placeholders only**; the real source is text-to-SQL over AACT.
- **Embeddings / `Chunk` vectors / the AI service** — populated by the ingestion pipeline later. Seed `Source` *metadata* only if useful; leave `embedding` empty.
- **Auth** — a separate step that precedes this one (real session replaces mock `currentUser`).

## Prerequisites
- Local PostgreSQL reachable via `DATABASE_URL`.
- `pgvector` extension available (`CREATE EXTENSION IF NOT EXISTS vector;`) — the `Chunk.embedding` column is defined now but stays empty until ingestion.

## Tasks
1. **Install + init Prisma**; set `DATABASE_URL`; `previewFeatures = ["postgresqlExtensions"]`.
2. **Author `prisma/schema.prisma`** from `@project-overview.md` §7 — the faithful models (Organization, User, Project, Document, Section, Citation, Source, Chunk, Criterion, ReviewTask, AuditEvent) plus the inferred ones needed by built pages (Site, FeasibilityRun, CompetingTrial, SafetyCase, Narrative, Signal, EthicsApplication, FormSection, Notification, DocVersion, Comment). Every tenant-owned model carries `organizationId`.
3. **Append-only grants migration:** `REVOKE UPDATE, DELETE` on `AuditEvent`, `DocVersion`, and signature records for the app role (insert-only at the DB level, per `@coding-standards.md` §1.3).
4. **Migrate:** `prisma migrate dev` (never `db push`). Verify `prisma migrate status` clean.
5. **Write `prisma/seed.ts`** — import from `@/src/lib/mock-data.ts` and insert (see mapping + rules below). Wire `prisma db seed`.
6. **Swap data access page by page:** change each `src/lib/data/*` function from returning mock to a tenant-scoped Prisma query of the **same return shape**. Components don't change. Do this one page per commit; verify each page still renders identically.
7. **Promote types:** move the domain `type`/`interface` blocks out of `mock-data.ts` into `src/types/*` (they become canonical); retire `mock-data.ts` (or keep for tests).

## Mock → schema mapping (seed source)
| `mock-data.ts` export | Model(s) |
|---|---|
| `organization` | `Organization` |
| `currentUser`, `people` | `User` |
| `projects` | `Project` (+ owner relation) |
| `sites` | `Site` |
| `eligibilityCriteria` | `Criterion` |
| `reviewQueue` | `ReviewTask` (+ stub `Document`s) |
| `auditTrailToday` | `AuditEvent` (insert-only) |
| `regWritingDoc`, `protocolSections` | `Document` + `Section` (+ `Comment`, `Citation`) |
| `safetyCase`, `narrativeQueue`, `safetySignal` | `SafetyCase`, `Narrative`, `Signal` |
| `irasApplication`, `requiredDocuments` | `EthicsApplication`, `FormSection`, `Document` |
| `competingTrials`, `labelDecisions` | `CompetingTrial`, `Approval` — **dev placeholder only** (real source = AACT) |
| `knowledgeSources` | `Source` (metadata only; no `Chunk`/embedding) |

## Seed authoring rules
- **Idempotent:** use `upsert` (or `deleteMany` + create within a guard) keyed on stable ids so re-running is safe.
- **FK insert order:** Organization → User → Project → Site → Document → Section → Criterion / ReviewTask / SafetyCase / EthicsApplication → AuditEvent last.
- **Tenant-scoped:** every row gets `organizationId = organization.id`.
- **Fictional only:** Maple Therapeutics / Subject 04-218 etc. — **no PHI** (already true of the mock).
- Wrap inserts in a transaction; log a summary count at the end.

## Acceptance criteria
- [ ] `prisma migrate dev` + `prisma migrate status` clean; schema matches `@project-overview.md` §7.
- [ ] `AuditEvent` / `DocVersion` are insert-only at the DB grant level (UPDATE/DELETE revoked).
- [ ] `prisma db seed` runs idempotently; every page that was on mock now renders identically from the DB.
- [ ] All queries tenant-scoped by `organizationId`; no cross-tenant rows.
- [ ] `pgvector` extension enabled; `Chunk.embedding` column exists and is empty (ingestion deferred).
- [ ] `npm run build` + `lint` + `typecheck` pass. No AACT load, no AI service, no embeddings introduced.

## Notes
- This phase makes the **ordinary data** real. The **retrieval-powered** screens (Knowledge Base, Eligibility/Feasibility/Competitive Intel precedent figures, Copilot generation) stay on mock or placeholder until the **AI service + AACT** phase that follows.
- Keep `prisma migrate deploy` for production startup; never auto-migrate in prod.
