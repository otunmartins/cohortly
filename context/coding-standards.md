# Coding Standards — Cohortly

Engineering contract for the Cohortly clinical-trials & regulatory platform. This is **GxP-regulated software**: the rules in [§1 Compliance-critical](#1-compliance-critical-rules-non-negotiable) map directly to 21 CFR Part 11, audit, and data-protection requirements and are **non-negotiable**. Everything else is the house style that keeps the codebase consistent and reviewable.

The system is two codebases behind one boundary:

- **Part A — Web app & BFF** (Next.js / TypeScript): UI, auth, tenant-scoped CRUD, and the streaming **proxy** to the AI service.
- **Part B — AI & retrieval service** (Python): the RAG pipeline, hybrid retrieval, text-to-SQL over AACT, and constrained generation.
- **Part C — Cross-cutting**: testing, security, performance, file layout, Git.

> Companion doc: `project-overview.md` (architecture, screens, data model). When this doc and the rendered prototype disagree on visuals, the prototype wins.

---

## 1. Compliance-critical rules (non-negotiable)

The product's differentiators and its regulatory obligations. A violation is a release blocker.

1. **Tenant isolation lives in the data layer.** Every query is scoped by `organizationId`. Never rely on the client or UI to filter by tenant. Prefer a scoped Prisma helper or RLS — not ad-hoc `where` clauses. Caches and retrieval results are tenant-keyed; **never serve one tenant's data to another.**
2. **Every mutation emits an `AuditEvent` in the same transaction.** No write commits without its audit row.
3. **Append-only tables are insert-only at the DB grant level.** `AuditEvent`, `DocVersion`, signature records: no `UPDATE`/`DELETE` from the app role — enforce in the migration.
4. **Human-in-the-loop is mandatory.** No AI-generated content may transition a document to `APPROVED`/`LOCKED` without an approved `ReviewTask`. Enforced server-side.
5. **Provenance on every AI output.** The AI service returns `citations[]` (source id + quote + locator), `confidence`, and `modelVersion`; the app persists them and writes `AuditEvent(actorKind: "AI")`. Low-confidence (`< 0.6`) is flagged for enhanced review.
6. **Every generated citation must resolve to a chunk that was actually retrieved.** Citation verification is a required pipeline step — guard against hallucinated sources.
7. **The AACT path is read-only and SELECT-only.** Generated SQL runs as a read-only role against an allowlisted schema, with statement timeouts. No DDL/DML, ever.
8. **Respect the AI-service boundary.** The Next.js app never embeds an LLM, generates SQL, or runs vector math. It proxies the Python service and streams results.
9. **No PHI/PII or secrets in logs, client bundles, error messages, caches, or any prompt/payload that leaves the boundary.** De-identify on ingest; keep regulated data server-side and in-region (UK residency for NHS tenants).
10. **Generation features are feature-flagged per tenant** so they can be disabled during validation (IQ/OQ/PQ). Prompts, models, indexes, and the embedding model are **versioned** and changes are change-controlled.

---

# Part A — Web app & BFF (Next.js / TypeScript)

## A1. TypeScript

- `strict` mode on. **No `any`** — use `unknown` and narrow, or define the type.
- Types for all props, Server Action inputs/outputs, API payloads, and data models.
- Derive types from Zod schemas (`z.infer<typeof Schema>`) so validation and types never drift.
- Inference where obvious; explicit return types on exported functions and Server Actions.
- Model "either/or" states as **discriminated unions**. Avoid non-null assertions (`!`); prefer `satisfies` over casts.
- Use the `@/` path alias; no deep `../../../` chains.

## A2. React

- **Functional components only**; hooks for state and side effects.
- One job per component; extract reusable logic into custom hooks (`useX`).
- Stable, meaningful `key`s (never the array index for dynamic lists).
- Don't sync server data into state via `useEffect` — derive it, or fetch in a Server Component.
- `useEffect` is for genuine side effects only (subscriptions, DOM, timers).

## A3. Next.js (App Router)

- **App Router only. Server Components by default.** Add `"use client"` only to interactive leaves (editors, forms, sliders, charts, menus), pushed as far down the tree as possible.
- Fetch data directly with Prisma in Server Components.
- **Server Actions** for form submissions and tenant-scoped mutations (default mutation path).
- **Route handlers** only when you need: streaming AI responses (proxy → Python service, SSE); webhooks (regulatory feeds, CT.gov sync); file uploads with progress; long-running/export operations; specific HTTP status/headers; endpoints for future mobile/CLI; third-party integrations.
- Route groups: `(auth)` (no shell) and `(app)` (sidebar + topbar, tenant guard).
- **Generation is always an async job**, never a blocking request: kick off, stream partials, let the user navigate away; the result lands in their Inbox + the document.

## A4. Server Actions — the standard mutation path

Spine: **validate (Zod) → authenticate + RBAC → scope to tenant → write + audit in one transaction → typed result.**

```ts
// src/types/action.ts
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

```ts
// src/actions/criteria.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import type { ActionResult } from "@/types/action";

const UpdateCriterionInput = z.object({
  id: z.string().cuid(),
  text: z.string().min(1),
  feasibility: z.number().int().min(0).max(100),
});

export async function updateCriterion(
  raw: z.infer<typeof UpdateCriterionInput>,
): Promise<ActionResult<{ id: string }>> {
  try {
    const input = UpdateCriterionInput.parse(raw);          // 1. validate
    const user = await requireUser();                       // 2. authn
    if (!can(user, "criteria:edit")) {                      //    + RBAC
      return { success: false, error: "Not permitted." };
    }

    const result = await prisma.$transaction(async (tx) => {
      const criterion = await tx.criterion.findFirstOrThrow({   // 3. tenant scope
        where: { id: input.id, project: { organizationId: user.organizationId } },
      });
      const updated = await tx.criterion.update({
        where: { id: criterion.id },
        data: { text: input.text, feasibility: input.feasibility },
      });
      await tx.auditEvent.create({                              // 4. audit, same tx
        data: { actorId: user.id, actorKind: "USER", action: "edited",
                target: `Criterion:${updated.id}` },
      });
      return updated;
    });

    return { success: true, data: { id: result.id } };
  } catch (err) {
    console.error("updateCriterion failed", err);               // never leak internals
    return { success: false, error: "Could not update criterion." };
  }
}
```

> `next-safe-action` is acceptable to remove boilerplate, provided it preserves the validate → RBAC → tenant-scope → audit sequence.

## A5. Database & Prisma

- **Prisma for all operational DB access.**
- Schema changes: **`prisma migrate dev`** locally — never `db push`. Run **`prisma migrate status`** before committing; production runs **`prisma migrate deploy`** before the app starts.
- **Always scope queries by `organizationId`** — centralize it (scoped client / helper / RLS) so an unscoped query is obvious in review.
- **Audit + versioning tables are append-only** — encode `REVOKE UPDATE, DELETE` in the migration.
- **Soft-delete** operational records (`deletedAt`); never hard-delete anything touching the audit trail.
- **pgvector**: column as `Unsupported("vector(1536)")`; ANN search via `prisma.$queryRaw`.
- **AACT is outside Prisma** — its own read-only `ctgov` schema in the same Postgres, queried via generated SQL through the AI service. App role has read-only grants.
- Audit middleware stamps actor/`createdBy` on writes.

## A6. Data fetching & validation

- Server Components fetch directly with Prisma (tenant-scoped). Client Components mutate via Server Actions; read AI synthesis via streamed route handlers.
- **Validate every external input with Zod** at the boundary; trust the parsed type inward.
- Never trust a client-supplied tenant id — derive it from the session.

## A7. Error handling & logging

- `try/catch` in every Server Action; return the `ActionResult` shape.
- User-friendly messages via toast; log the real error server-side. Never return raw errors/stack traces/DB messages to the client.
- Structured server logging; **never log PHI/PII, secrets, tokens, or AI content containing patient data.** Log identifiers and event types, not content.
- Design **loading / empty / error** states for every screen.

## A8. AI integration (the boundary)

- All generation/retrieval goes through the Python AI service via proxy route handlers; stream tokens with the Vercel AI SDK.
- Persist provenance (`citations`, `confidence`, `modelVersion`) and write the AI audit event on completion.
- Wrap **all** generated content in the shared `<AIDraftBlock/>` (accept / edit / reject / regenerate); never render AI text as final without the human gate.
- Long generations are background jobs (Inngest/BullMQ) — show progress, deliver to Inbox + document.

## A9. Styling & design system (Tailwind CSS v4)

> **CRITICAL — Tailwind v4 uses CSS-based config.**
> - **DO NOT** create `tailwind.config.ts`/`.js` (those are v3).
> - All theme config goes in CSS via the `@theme` directive in `src/app/globals.css`.
> - Use CSS custom properties for colors, spacing, fonts.

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand · clinical teal */
  --color-brand-50:  oklch(97% 0.02 180);
  --color-brand-500: oklch(58% 0.10 185);
  --color-brand-700: oklch(45% 0.09 185);

  /* Accent · warm amber (AI/generation, sparingly) */
  --color-accent-500: oklch(80% 0.13 75);

  /* Paper · warm neutral surfaces */
  --color-paper-50:  oklch(99% 0.004 90);
  --color-paper-100: oklch(97% 0.006 90);

  /* Typography */
  --font-display: "Instrument Serif", serif;   /* page titles, KPI numbers */
  --font-sans:    "Inter Tight", sans-serif;   /* all UI/body */
  --font-mono:    "JetBrains Mono", monospace; /* IDs, codes, citations, refs */
}
```

- **Single light theme** — warm "paper" surfaces per the design system. No theme toggle.
- **Tailwind for all styling**; **no inline styles**.
- Use **shadcn/ui** (copied into `src/components/ui`, themed to the tokens above); Radix primitives underneath for accessibility.
- **Density is tight** (professional data tool): base text 12–13px, table rows ~32px, controls 28–32px, `tabular-nums` for figures.
- `lucide-react` for icons; `recharts` for charts.

## A10. Shared components (build once, reuse)

These encode human-in-the-loop + provenance and recur wherever generation appears. Build once.

| Component | Responsibility |
|---|---|
| `<Citation/>` | Inline chip `[n] source`; click opens the source; persists to `Citation` |
| `<Confidence/>` | Colour-coded % bar (green ≥85, amber ≥60, red below); on every AI output |
| `<AIDraftBlock/>` | Wraps generated text; accept / edit / reject / regenerate; shows source count + model version |

## A11. Accessibility

- Target **WCAG 2.1 AA**; lean on Radix/shadcn primitives rather than re-implementing.
- Semantic HTML; label every input; visible focus; full keyboard operability for editors, menus, dialogs.
- Never convey state by colour alone (confidence, status, threat) — pair with text/icon.

---

# Part B — AI & retrieval service (Python)

The retrieval and generation engine. The Next.js app calls it over an internal API; it owns embeddings, vector/lexical search, text-to-SQL, reranking, and constrained generation.

## B1. Language & tooling

- **Python 3.12+**, full type hints; `mypy` (or `pyright`) in strict mode in CI.
- **`ruff`** for lint + format (single tool); no other formatter.
- **`pydantic` v2** for all request/response and config models — the typed contract with the BFF.
- Dependency management with `uv` (or Poetry) + committed lockfile; **pinned versions, change-controlled** (validated system).
- **FastAPI** for the API; **LangGraph** for multi-agent/workflow orchestration; **LangChain** for the RAG pipeline (preferred framework — standardize on it; do not mix in a second retrieval framework on the same path).
- Structured logging (`structlog`/JSON); **never log PHI/PII or full prompts containing patient data**. Log query shape, retrieved doc ids, scores, model + index versions.
- No business logic in route handlers — thin FastAPI layer over service modules; functions under ~50 lines where reasonable.

## B2. RAG pipeline

The six stages (intent → retrieval → validation → constrained generation → human review → audit) are the contract. Engineering rules per stage:

**Ingestion & chunking**
- Domain-aware chunking (respect section boundaries; don't split mid-table/mid-criterion).
- Attach metadata to every chunk: `docType`, `authority` (FDA/EMA/MHRA/ICH/Internal/CT.gov), `jurisdiction`, `therapeuticArea`, `pathway`, `version`, `section`, `page`.
- **Deterministic chunk IDs** (content + source hash) so re-ingestion is **idempotent**; record `embeddingModel` + `ingestedAt` for traceability.

**Embeddings**
- One embedding model per corpus; **fixed dimension** *(default 1536 — DECISION: confirm model/dimension)*. Store the model version in chunk metadata so re-embeds are traceable and never silently mixed.
- Batch embedding calls; **cache by content hash** (see B4).

**Hybrid retrieval**
- **Dense** via pgvector (HNSW index, cosine) **+ lexical BM25** *(default: Postgres FTS to stay one-engine; DECISION: OpenSearch if lexical scale/quality demands it)*.
- Apply **metadata pre-filters** (authority, jurisdiction, TA, date) in the query, not in post-processing.
- Fuse dense + lexical with **Reciprocal Rank Fusion (RRF)**; keep fusion weights configurable and versioned.

**Reranking**
- **Cross-encoder rerank** the fused top-k before generation *(DECISION: hosted reranker vs local cross-encoder — deployment/cost call)*. Keep `topK` (retrieve) and `topN` (rerank→context) explicit and tunable.

**Validation & context assembly**
- Score passages for recency / authority / relevance; drop superseded guidance versions.
- Rule engine enforces hard constraints **pre-generation**; assemble context with explicit per-passage attribution.

**Constrained generation**
- Structured output to required templates (e.g. `ICH_E6_R3`) — **not open chat**. Every statement is linked to evidence.
- **Citation verification step (required):** every citation in the output must map to a chunk in the retrieved set; reject/regenerate if not. Lower confidence when coverage is weak.

**Return contract (every generation/answer):**
```json
{ "text": "…", "citations": [{ "sourceId": "…", "quote": "…", "locator": "§5.18" }],
  "confidence": 0.0, "modelVersion": "cohort-v3", "retrieval": { "topK": 0, "indexVersion": "…" } }
```

## B3. Text-to-SQL over AACT

For analytical trial questions Claude generates SQL against the curated AACT schema. Safety is mandatory:

- **Read-only DB role**, `ctgov` schema only; **SELECT-only** — reject any statement containing DDL/DML (parse the SQL, don't regex-guess).
- **Schema allowlist:** expose a **curated view layer**, not all ~51 raw tables; few-shot the model on that curated schema.
- Enforce **`statement_timeout`** and a **row `LIMIT`**; reject unbounded scans.
- **Validate before execute:** parse → confirm single SELECT → confirm tables/columns are in the allowlist → then run. Parameterize values.
- Never expose raw DB errors to the model or client; **log the generated SQL** to the audit trail.
- **Nightly snapshot** into `ctgov`; record the **data-as-of** date with every answer for reproducibility (a live API can't reconstruct an audited answer).

## B4. Caching (and why not CAG)

- **Embedding cache** (content hash → vector): standard; always on.
- **Semantic / result cache** for repeat KB answers: *(DECISION — optional for v1)*. If enabled, the cache key **must** include `tenantId` + retrieval filters + **corpus/index version** + **model version**. Invalidate on re-index. **Never cache across tenants.**
- **CAG (Cache-Augmented Generation) is out of scope** as a retrieval strategy. CAG preloads a small, static corpus into the model context/KV-cache and skips retrieval; our corpus (~482k chunks, frequently updated) is far too large and too dynamic. "Caching" here means the performance layers above — not a replacement for RAG. (A narrow exception: pinning one specific guidance doc into context for a single generation task is fine, but that's task context, not the retrieval architecture.)

## B5. Provenance & audit from the service

- **Every retrieval — vector or SQL — writes to the same append-only audit log** with: model version, params/filters, retrieved doc/chunk ids (or generated SQL + data-as-of), reviewer/actor, timestamps.
- The service is the **source of the provenance** the BFF persists; the two audit trails reconcile to one record per generation.

## B6. Evaluation & guardrails

- Maintain a **golden eval set**; measure retrieval (recall@k) and generation (citation faithfulness / groundedness, answer accuracy).
- **Regression-gate** any prompt, model, index, or embedding-model change against the eval set before release.
- Enforce the low-confidence threshold (`< 0.6` → enhanced review). PII/PHI **de-identified on ingest**.

## B7. Versioning & validation (GxP)

- Version and record: prompt templates, LLM + version, reranker, embedding model, index/corpus version.
- Changes are **change-controlled**; generation is **feature-flaggable per tenant** for IQ/OQ/PQ.

> **Open decisions to confirm** (defaults applied above): ① BM25 via **Postgres FTS** (one-engine) vs **OpenSearch**; ② **embedding model + dimension** (assumed 1536); ③ **reranker** hosted vs local; ④ **semantic result cache** in v1 or deferred.

---

# Part C — Cross-cutting

## C1. Testing

- **Unit + integration** for actions, lib, and service modules; **e2e on critical flows** (auth, generate → review → approve/lock, submission).
- Explicitly test the compliance invariants: **tenant isolation** (no cross-tenant read/write/cache), **RBAC** denials, **audit-event emission** on every mutation, **SQL safety** (writes rejected), and **citation verification** (hallucinated citation rejected).
- Tooling: Vitest + Playwright (web); pytest (service). Mock the AI service at the proxy boundary; use eval harness for retrieval quality (B6).

## C2. File organization & naming

**Web app**
```
src/
├─ app/(auth)/...  ·  app/(app)/[route]/page.tsx
├─ actions/[feature].ts          # Server Actions
├─ components/ui/                 # shadcn primitives (themed)
├─ components/[feature]/ComponentName.tsx
├─ lib/[utility].ts               # prisma, auth, rbac, ai-client
└─ types/[feature].ts
```

**AI service**
```
service/
├─ api/                # FastAPI routers (thin)
├─ pipeline/           # ingestion, retrieval, rerank, generation
├─ sql/                # text-to-SQL: schema allowlist, validators
├─ models/             # pydantic IO + config
├─ eval/               # golden set + harness
└─ core/               # logging, audit, settings
```

| Kind | Convention | Example |
|---|---|---|
| Components (TS) | PascalCase | `ItemCard.tsx` |
| Files (TS) | match component, else kebab-case | `use-feasibility.ts` |
| Functions / vars | camelCase (TS) · snake_case (Py) | `updateCriterion` · `build_context` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_SECTIONS` |
| Types / Interfaces | PascalCase, no prefix | `Criterion` (not `ICriterion`) |
| Python modules | snake_case | `hybrid_retriever.py` |

## C3. Security & secrets

- **RBAC enforced server-side**, never by hiding UI alone.
- Secrets in env (server-only); never import server-only modules into client components; never ship keys to the client.
- Validate/constrain file uploads (type, size); treat uploaded documents as untrusted.
- The AI service is **not publicly reachable** — internal network only; the BFF is the sole caller.
- Pin dependency versions and keep lockfiles; upgrades are **change-controlled**.

## C4. Performance

Budgets (= NFR targets): standard Q&A **< 3s p95**, section draft **< 60s**, full protocol draft **< 5min (async)**.

- Stream where the user waits (RAG answers, generation); Suspense for read-heavy screens.
- Avoid client-side fetch waterfalls — fetch in Server Components, pass into client islands as props.
- Virtualize long tables (TanStack Table). Cache embeddings; batch retrieval calls; index pgvector with HNSW.

## C5. Code quality & Git

- No commented-out code (unless explicitly annotated). No unused imports/variables.
- Functions under ~50 lines where reasonable; extract helpers.
- Conventional commits; small, reviewable PRs.
- **PR checklist = Definition of Done:** responsive · tenant-scoped (no leakage) · RBAC server-side · every mutation emits an `AuditEvent` in-transaction · AI outputs carry confidence + citations + model version · citations verified against retrieved set · SQL is read-only/validated · loading/empty/error states · keyboard + screen-reader accessible · inputs Zod/pydantic-validated · tests for the change.
