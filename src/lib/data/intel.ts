import { MOCK_INTEL_NASH } from "@/lib/mock-data";
import type { IntelData } from "@/types/intel";

export async function getIntelData(
  indication: string,
  organizationId: string,
): Promise<IntelData | null> {
  void organizationId;
  if (indication.toUpperCase() === "NASH") {
    return MOCK_INTEL_NASH;
  }
  return null;
}
