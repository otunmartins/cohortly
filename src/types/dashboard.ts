export type Period = "today" | "week" | "quarter";

export interface KpiMetric {
  label: string;
  value: string;
  delta: number;
  subtext: string;
}

export type ReviewItemType = "protocol" | "reg_writing" | "safety" | "ethics";

export interface ReviewTag {
  label: string;
  variant: "default" | "warn" | "danger" | "info";
}

export interface ReviewItem {
  id: string;
  type: ReviewItemType;
  studyId: string;
  docId: string;
  title: string;
  tags: ReviewTag[];
  confidence: number;
  age: string;
  href: string;
}

export type RegAuthority = "MHRA" | "FDA" | "EMA" | "ICH";

export interface RegUpdate {
  id: string;
  authority: RegAuthority;
  body: string;
  age: string;
  affectsStudies?: number;
}

export type AuditActorKind = "USER" | "AI" | "SYSTEM";

export interface AuditEntry {
  id: string;
  time: string;
  actorName: string;
  actorKind: AuditActorKind;
  actorInitials: string;
  actorColor?: string;
  action: string;
  target: string;
}

export interface DashboardData {
  greeting: string;
  subline: string;
  kpis: KpiMetric[];
  reviewQueue: ReviewItem[];
  regPulse: RegUpdate[];
  auditTrail: AuditEntry[];
}
