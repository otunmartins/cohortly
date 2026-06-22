export type Role =
  | "ra_lead"
  | "clin_ops"
  | "med_writer"
  | "pv"
  | "qa_reviewer"
  | "researcher"
  | "tenant_admin";

export type OrgType = "NHS" | "ACADEMIC" | "BIOTECH" | "CRO" | "PHARMA";

export type ProjectStatus =
  | "DRAFT"
  | "PRE_IND"
  | "IN_SCREENING"
  | "RECRUITING"
  | "IN_FOLLOW_UP"
  | "REPORTING"
  | "COMPLETED";

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  dataResidency: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  initials: string;
  organizationId: string;
}

export interface Project {
  id: string;
  code: string;
  title: string;
  phase: string;
  indication: string;
  regions: string[];
  status: ProjectStatus;
  targetEnrolment: number;
  actualEnrolment: number;
  siteCount: number;
  openItems: number;
  ownerId: string;
  ownerName: string;
  ownerInitials: string;
  ownerColor: string;
  organizationId: string;
  startDate: string;
  endDate: string;
}
