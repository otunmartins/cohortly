export type Role =
  | "ra_lead"
  | "clin_ops"
  | "med_writer"
  | "pv"
  | "qa_reviewer"
  | "researcher"
  | "tenant_admin";

export type OrgType = "NHS" | "ACADEMIC" | "BIOTECH" | "CRO" | "PHARMA";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  initials: string;
  organizationId: string;
}

export interface MockOrganization {
  id: string;
  name: string;
  type: OrgType;
  dataResidency: string;
}

export const MOCK_ORG: MockOrganization = {
  id: "org_maple_001",
  name: "Maple Therapeutics",
  type: "BIOTECH",
  dataResidency: "uk",
};

export const MOCK_USER: MockUser = {
  id: "user_priya_001",
  name: "Priya Shah",
  email: "priya.shah@mapletherapeutics.com",
  role: "ra_lead",
  title: "Regulatory Affairs",
  initials: "PS",
  organizationId: MOCK_ORG.id,
};
