import type { SafetyPageData, SafetyQueuePageData } from "@/types/safety";
import {
  MOCK_SAFETY_CASE,
  MOCK_SAFETY_NARRATIVE,
  MOCK_NARRATIVE_QUEUE,
  MOCK_SAFETY_SIGNALS,
  MOCK_CUMULATIVE_SAFETY,
} from "@/lib/mock-data";

export async function getSafetyCase(
  _organizationId: string,
  _saeId: string,
): Promise<SafetyPageData> {
  return {
    safetyCase: MOCK_SAFETY_CASE,
    narrative: MOCK_SAFETY_NARRATIVE,
    narrativeQueue: MOCK_NARRATIVE_QUEUE,
    signals: MOCK_SAFETY_SIGNALS,
    cumulative: MOCK_CUMULATIVE_SAFETY,
  };
}

export async function getSafetyQueue(
  _organizationId: string,
): Promise<SafetyQueuePageData> {
  return {
    queue: MOCK_NARRATIVE_QUEUE,
    cumulative: MOCK_CUMULATIVE_SAFETY,
  };
}
