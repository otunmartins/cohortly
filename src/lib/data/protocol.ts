import type { ProtocolDocument } from "@/types/protocol";
import { MOCK_PROTOCOL_DOC } from "@/lib/mock-data";

export async function getProtocolDocument(
  _organizationId: string,
  _docId: string,
): Promise<ProtocolDocument> {
  return MOCK_PROTOCOL_DOC;
}
