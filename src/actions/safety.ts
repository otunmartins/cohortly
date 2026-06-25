"use server";

import type { ActionResult } from "@/types/action";

export async function generateNarrative(
  _caseId: string,
): Promise<ActionResult<{ narrativeId: string }>> {
  // Stub: real impl calls POST /api/generate (docType: NARRATIVE) with CRF fields + template,
  // streams tokens, persists citations + confidence + modelVersion, writes AuditEvent(actorKind:"AI")
  return { success: true, data: { narrativeId: "narr_mock_" + Date.now() } };
}

export async function acceptNarrativeSuggestion(
  _narrativeId: string,
): Promise<ActionResult<{ accepted: true }>> {
  // Stub: would persist accepted narrative, write AuditEvent(actorKind:"USER", action:"accepted")
  return { success: true, data: { accepted: true } };
}

export async function rejectNarrativeSuggestion(
  _narrativeId: string,
): Promise<ActionResult<{ rejected: true }>> {
  // Stub: would mark narrative dismissed, write AuditEvent
  return { success: true, data: { rejected: true } };
}

export async function medicalSignOff(
  _caseId: string,
  _signatureMeaning: string,
): Promise<ActionResult<{ versionId: string }>> {
  // Stub: real impl requires approved ReviewTask, captures e-sig meaning,
  // writes immutable DocVersion + content hash, sets status=LOCKED, emits AuditEvent
  return { success: true, data: { versionId: "ver_sae_mock_001" } };
}

export async function exportE2b(
  _caseId: string,
): Promise<ActionResult<{ url: string }>> {
  // Stub: real impl renders E2B(R3) XML and returns presigned S3 URL
  return { success: true, data: { url: "" } };
}
