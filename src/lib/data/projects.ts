import type { Project, Organization } from "@/types/project";
import { MOCK_PROJECTS, MOCK_ORG } from "@/lib/mock-data";

export async function getProjects(organizationId: string): Promise<Project[]> {
  return MOCK_PROJECTS.filter((p) => p.organizationId === organizationId);
}

export async function getOrganization(organizationId: string): Promise<Organization> {
  if (MOCK_ORG.id !== organizationId) {
    throw new Error(`Organization not found: ${organizationId}`);
  }
  return MOCK_ORG;
}
