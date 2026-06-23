import { MOCK_ELIGIBILITY_MAP204 } from "@/lib/mock-data";
import type { EligibilityData } from "@/types/eligibility";

export async function getEligibilityData(
  projectId: string,
  organizationId: string,
): Promise<EligibilityData | null> {
  void organizationId;
  if (projectId === "proj_map_204") {
    return MOCK_ELIGIBILITY_MAP204 as EligibilityData;
  }
  return null;
}
