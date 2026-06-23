import type { KbAnswer, KbIndexHealth } from "@/types/knowledge";
import { SAMPLE_KB_ANSWER, SAMPLE_KB_INDEX_HEALTH } from "@/lib/mock-data";

export async function getKbAnswer(
  _organizationId: string,
): Promise<KbAnswer> {
  return SAMPLE_KB_ANSWER;
}

export async function getKbIndexHealth(
  _organizationId: string,
): Promise<KbIndexHealth> {
  return SAMPLE_KB_INDEX_HEALTH;
}
