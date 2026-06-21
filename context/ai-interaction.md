# AI Interaction Guide — Cohortly

How Claude Code works on this repo. Read alongside `project-overview.md` (what we're building) and `coding-standards.md` (how code must be written). When a rule here conflicts with a request, the **compliance-critical rules** in `coding-standards.md` §1 win — surface the conflict rather than silently weakening them.

---

## Communication

- Be concise and direct.
- Explain non-obvious decisions briefly; surface tradeoffs when there's a real fork.
- **Ask before large refactors or architectural changes.**
- Don't add features not in the project spec.
- **Never delete files without clarification.**
- If a request would weaken a compliance invariant (tenant scoping, audit, RBAC, read-only SQL, provenance), say so before proceeding.

---

## Workflow

The standard loop for **every** feature/fix:

1. **Document** — write the feature in `context/current-feature.md`.
2. **Branch** — create a new branch (see [Branching](#branching)).
3. **Implement** — build what's described in `context/current-feature.md`, following `coding-standards.md`.
4. **Verify** — confirm it works (browser for UI; the relevant gate below). Fix all errors before moving on.
5. **Iterate** — adjust as needed.
6. **Commit** — only after the verify gate passes and it works (and only with permission).
7. **Merge** — merge to `main`.
8. **Delete branch** — after merge (ask first).
9. **Review** — review the generated code (see [Code Review](#code-review)).
10. **Close out** — mark done in `context/current-feature.md` and append a line to `context/history.md`.

**Do NOT commit without permission and until the verify gate passes.** If it fails, fix the issues first — don't commit around them.

### Verify gate

| Codebase | Must pass before commit |
|---|---|
| Web app (Next.js/TS) | `npm run build` · `npm run lint` · `npm run typecheck` (`tsc --noEmit`) · manual browser check of the changed surface |
| AI service (Python) | `ruff check` · `mypy` (or `pyright`) · `pytest` |
| Database (if schema touched) | `prisma migrate status` clean · migration created via `prisma migrate dev` (never `db push`) |

> **One refinement to your draft:** you had *"implement unit testing later."* For most code that's fine — broad unit coverage can follow. But because this is GxP software, **tests for the compliance invariants are part of "done," not deferred**: tenant isolation, RBAC denial, audit-event emission on mutations, SQL read-only/validation, and citation verification. Everything else can be tested later.

---

## Branching

- A new branch for every feature/fix.
- Naming: `feature/[name]`, `fix/[name]`, `chore/[name]`, `refactor/[name]`.
- Ask to delete the branch once merged.

---

## Commits

- **Ask before committing — don't auto-commit.**
- Conventional commit messages (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).
- Keep commits focused — one feature/fix per commit.
- **Never put "Generated with Claude" (or similar) in commit messages.**
- **Never commit** secrets, `.env`, the AACT dump, or anything containing PHI/PII.

---

## When stuck

- If something isn't working after **2–3 attempts, stop and explain the issue** — root cause, what was tried, options.
- Don't keep trying random fixes.
- Ask for clarification when requirements are unclear.

---

## Code changes

- Make the **minimal change** that accomplishes the task.
- Don't refactor unrelated code unless asked.
- Don't add "nice to have" features.
- **Preserve existing patterns** in the codebase.
- Respect the **AI-service boundary**: the Next.js app proxies the Python service — it never embeds the LLM, generates SQL, or runs vector math.
- Never weaken a compliance invariant to make a build or test pass — fix the actual problem.

---

## Code review

Review generated code periodically and on demand, especially for:

- **Security** — auth checks, input validation (Zod/pydantic), RBAC enforced **server-side**, no secrets/PHI in logs or client bundles.
- **Tenant safety** — every query scoped by `organizationId`; no cross-tenant reads/writes/caches.
- **Audit & provenance** — every mutation emits an `AuditEvent` in the same transaction; AI outputs carry confidence + citations + model version; citations verified against the retrieved set.
- **SQL safety** — generated trial queries are read-only / SELECT-only / schema-allowlisted, with timeouts.
- **Performance** — unnecessary re-renders, N+1 queries, client fetch waterfalls.
- **Logic** — edge cases, error/empty/loading states.
- **Patterns** — matches the existing codebase and `coding-standards.md`.
