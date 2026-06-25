import { MOCK_FEASIBILITY_MAP204 } from "@/lib/mock-data";
import type { FeasibilityData } from "@/types/feasibility";

export async function getFeasibilityData(
  projectId: string,
  organizationId: string,
): Promise<FeasibilityData | null> {
  void organizationId;
  if (projectId === "proj_map_204") {
    return MOCK_FEASIBILITY_MAP204 as FeasibilityData;
  }
  return null;
}
