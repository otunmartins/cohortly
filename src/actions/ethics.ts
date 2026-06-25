"use server";

import type { ActionResult } from "@/types/action";

export async function autoPopulateSection(
  _ethicsId: string,
  _sectionCode: string,
): Promise<ActionResult<{ sectionId: string }>> {
  // Stub: real impl calls POST /api/generate (docType: IRAS_SECTION) with protocol context + HRA guidance,
  // streams tokens, persists citations + confidence + modelVersion, writes AuditEvent(actorKind:"AI")
  return { success: true, data: { sectionId: "sec_mock_" + Date.now() } };
}

export async function editAnswer(
  _ethicsId: string,
  _answerId: string,
  _text: string,
): Promise<ActionResult<{ answerId: string }>> {
  // Stub: real impl updates answer text, flips kind to "edited",
  // writes AuditEvent(actorKind:"USER", action:"edited", target:`IrasAnswer:${answerId}`)
  return { success: true, data: { answerId: "ans_mock_" + Date.now() } };
}

export async function generateDocument(
  _ethicsId: string,
  _docType: "DPIA" | "PIS" | "ICF",
): Promise<ActionResult<{ documentId: string }>> {
  // Stub: real impl enqueues a background generation job (Inngest/BullMQ),
  // result lands in Inbox + required-docs checklist, writes AuditEvent(actorKind:"AI")
  return { success: true, data: { documentId: "doc_mock_" + Date.now() } };
}

export async function downloadSubmissionPack(
  _ethicsId: string,
): Promise<ActionResult<{ url: string }>> {
  // Stub: real impl assembles the REC submission pack (protocol, IB, PIS, ICF, DPIA, insurance)
  // and returns a presigned S3 URL for the zipped eCTD-style package
  return { success: true, data: { url: "" } };
}

export async function submitToHra(
  _ethicsId: string,
  _signatureMeaning: string,
): Promise<ActionResult<{ submissionId: string }>> {
  // Stub: real impl requires completed sections + all required docs submitted,
  // creates immutable DocVersion, captures e-sig meaning, writes AuditEvent(actorKind:"USER", action:"submitted")
  return { success: true, data: { submissionId: "sub_mock_" + Date.now() } };
}
