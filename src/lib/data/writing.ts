import type { RegWritingDoc } from "@/types/writing";
import { MOCK_REG_WRITING_DOC } from "@/lib/mock-data";

export async function getRegWritingDoc(
  _organizationId: string,
  _docId: string,
): Promise<RegWritingDoc> {
  return MOCK_REG_WRITING_DOC;
}
