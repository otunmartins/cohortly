# Spec — Inbox

> Route: `app/(app)/inbox/page.tsx` · Nav: Workspace · Screen: S05
> Screenshot: `@context/screenshots/inbox-ui.png`
> References: `@project-overview.md` (§5 S05, §7 `Notification`/`Comment`/`ReviewTask`), `@coding-standards.md`, `@ai-interaction.md`

> 🧱 **Mock phase (now):** Inbox is **mostly presentational** — a notifications/messaging surface (two-pane list + detail + reply box), not an AI feature. Build it all from `inboxThreads` in `@/src/lib/mock-data.ts` via a thin `src/lib/data/inbox.ts` function. The **only** AI action on the page is the optional **"Draft with Cohortly"** reply assist (+ "Cite source") — **stub those** (no generation, no `/api/generate`); their RAG + provenance wiring lands in the AI phase. Note: "AI safety flag" threads are just `Notification` rows *surfaced* here — the AI ran on the Safety screen, not here.

## Purpose
Unified work inbox across all lanes: review requests, @mentions, regulator updates, AI safety flags, system notices.

## Primary users
All roles.

## Layout — two-pane (list + detail)
- **Top bar:** breadcrumb "Inbox", ⌘K, **Mark all read**, Filter.
- **Filters:** All / Unread (n) / Mentions / Reviews / Safety / Regulator.
- **List:** sender (R. Okafor, MHRA·ILAP, L. Tan, AI·Cohortly, HRA·REC, FDA·CDER…), subject, snippet, **domain tag** (Reg writing / Regulator / Eligibility / Safety / Ethics), linked study (`MAP-204`), urgency dot, age, unread state.
- **Detail pane:** thread header (domain tag, study id, "urgent · respond today"), full message, **Reply** composer with **"Draft with Cohortly"**, Attach, **Cite source**, Save draft.

## Components
- shadcn: `ScrollArea`, `Badge`, `Avatar`, `Button`, `Tabs`, `Textarea`.
- bespoke: `<Citation/>` (in reply via Cite source).
- new: `InboxList`, `InboxThread`, `ReplyComposer`.

## Data (Prisma)
- `Notification` / `Comment` / `ReviewTask` unioned into a thread view (actor, domain tag, linked project, readAt, urgency). AI flags originate from the safety pipeline.

## Server actions / API / retrieval
- `markRead`, `markAllRead`, `sendReply` actions. **"Draft with Cohortly"** → `POST /api/generate` (reply assist, **RAG**, returns cited draft). Provenance persisted on the reply.

## Rendering
- **RSC** list + Suspense; detail pane + composer are client islands.

## Behaviours
- Filter tabs; select row → detail; reply (manual or AI-assisted); cite source inserts `<Citation/>`.

## States
- Loading list skeleton; empty per filter; error.

## Compliance notes
- Tenant-scoped. AI-drafted replies carry provenance (citations + model version) and an `AuditEvent(actorKind:"AI")`. No PHI in notification snippets.

## Out of scope (later)
- Threading across channels; email bridge; bulk triage.

## Acceptance criteria
- [ ] Two-pane responsive (list collapses to full-width on mobile, detail in sheet).
- [ ] Filters work; unread counts accurate.
- [ ] AI reply draft cites sources + is audited.
- [ ] Tenant-scoped; a11y (keyboard list nav).
