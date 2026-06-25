"use server";

import type { ActionResult } from "@/types/action";

export async function saveWritingSection(
  _docId: string,
  _sectionId: string,
  _contentJson: Record<string, unknown>,
): Promise<ActionResult<{ saved: true }>> {
  // Mock: real impl validates, RBAC-checks, writes to DB, emits AuditEvent in transaction
  return { success: true, data: { saved: true } };
}

export async function acceptWritingSuggestion(
  _suggestionId: string,
): Promise<ActionResult<{ accepted: true }>> {
  // Mock: would persist accepted text + citations, write AuditEvent(actorKind:"USER")
  return { success: true, data: { accepted: true } };
}

export async function rejectWritingSuggestion(
  _suggestionId: string,
): Promise<ActionResult<{ rejected: true }>> {
  // Mock: would mark suggestion dismissed, write AuditEvent
  return { success: true, data: { rejected: true } };
}

export async function addWritingComment(
  _docId: string,
  _body: string,
): Promise<ActionResult<{ commentId: string }>> {
  // Mock: would create Comment pinned to selection anchor, emit AuditEvent
  return { success: true, data: { commentId: "cmt_mock_" + Date.now() } };
}

export async function exportEctd(
  _docId: string,
): Promise<ActionResult<{ url: string }>> {
  // Stub: real impl renders eCTD/PDF package and returns a presigned S3 URL
  return { success: true, data: { url: "" } };
}

export async function signOffDocument(
  _docId: string,
  _signatureMeaning: string,
): Promise<ActionResult<{ versionId: string }>> {
  // Stub: real impl would require approved ReviewTask, capture e-sig meaning,
  // write immutable DocVersion + content hash, set status=LOCKED, emit AuditEvent
  return { success: true, data: { versionId: "ver_mock_001" } };
}
