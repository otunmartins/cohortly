"use server";

import type { ActionResult } from "@/types/action";

export async function saveSection(
  _docId: string,
  _sectionId: string,
  _contentJson: Record<string, unknown>,
): Promise<ActionResult<{ saved: true }>> {
  // Mock: real impl would validate, RBAC-check, write to DB, emit AuditEvent
  return { success: true, data: { saved: true } };
}

export async function acceptSuggestion(
  _suggestionId: string,
): Promise<ActionResult<{ accepted: true }>> {
  // Mock: would persist accepted text + citations, write AuditEvent(actorKind:"USER")
  return { success: true, data: { accepted: true } };
}

export async function rejectSuggestion(
  _suggestionId: string,
): Promise<ActionResult<{ rejected: true }>> {
  // Mock: would mark suggestion dismissed, write AuditEvent
  return { success: true, data: { rejected: true } };
}

export async function submitForReview(
  _docId: string,
  _assigneeId: string,
): Promise<ActionResult<{ taskId: string }>> {
  // Mock: would create ReviewTask, notify assignee, emit AuditEvent
  return { success: true, data: { taskId: "task_mock_001" } };
}
