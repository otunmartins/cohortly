import type { EthicsPageData } from "@/types/ethics";
import {
  MOCK_ETHICS_APPLICATION,
  MOCK_ETHICS_SECTIONS,
  MOCK_REQUIRED_DOCS,
  MOCK_HRA_CHECKS,
  MOCK_HRA_GAP,
  MOCK_REC_TIMELINE,
  MOCK_NIHR_PORTFOLIO,
} from "@/lib/mock-data";

export async function getEthicsApplication(
  _organizationId: string,
  _ethicsId: string,
): Promise<EthicsPageData> {
  const activeSection = MOCK_ETHICS_SECTIONS.find((s) => s.code === "D") ?? MOCK_ETHICS_SECTIONS[0];

  return {
    application: MOCK_ETHICS_APPLICATION,
    sections: MOCK_ETHICS_SECTIONS,
    requiredDocs: MOCK_REQUIRED_DOCS,
    hraChecks: MOCK_HRA_CHECKS,
    hraGap: MOCK_HRA_GAP,
    recTimeline: MOCK_REC_TIMELINE,
    nihrPortfolio: MOCK_NIHR_PORTFOLIO,
    activeSection,
  };
}
