export type CtdModuleStatus = "empty" | "draft" | "review" | "complete";
export type DocStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "LOCKED";
export type ConsistencyKind = "cross-module" | "terminology" | "reference" | "numbering";
export type ConsistencySeverity = "error" | "warning" | "ok";
export type CommentKind = "human" | "ai";
export type AIDraftStatus = "pending" | "accepted" | "rejected";
export type RightRailTab = "comments" | "sources" | "history";

export interface CtdModule {
  id: string;
  number: string;
  heading: string;
  status: CtdModuleStatus;
  children?: CtdModule[];
}

export interface ConsistencyIssue {
  id: string;
  kind: ConsistencyKind;
  label: string;
  severity: ConsistencySeverity;
  detail?: string;
}

export interface DocHealthMetric {
  label: string;
  value: number;
  target: number;
  unit?: string;
}

export interface RegWritingComment {
  id: string;
  author: string;
  authorInitials: string;
  role: string;
  body: string;
  timestamp: string;
  kind: CommentKind;
  confidence?: number;
  resolved: boolean;
}

export interface RegCitation {
  n: number;
  sourceId: string;
  label: string;
  authority: string;
  title: string;
  kind: string;
}

export interface RegAIDraftBlock {
  id: string;
  text: string;
  confidence: number;
  sourceCount: number;
  modelVersion: string;
  status: AIDraftStatus;
}

export interface RegHistoryEntry {
  id: string;
  actor: string;
  actorInitials: string;
  action: string;
  timestamp: string;
  kind: "human" | "ai" | "system";
}

export interface RegWritingDoc {
  id: string;
  projectCode: string;
  projectTitle: string;
  docType: "CTD_2_7" | "IND";
  moduleNumber: string;
  sectionNumber: string;
  sectionHeading: string;
  version: string;
  editCount: number;
  lastEditedBy: string;
  lastEditedAgo: string;
  status: DocStatus;
  contentJson: Record<string, unknown>;
  citations: RegCitation[];
  aiDraftBlock: RegAIDraftBlock;
  comments: RegWritingComment[];
  history: RegHistoryEntry[];
  modules: CtdModule[];
  consistencyIssues: ConsistencyIssue[];
  docHealth: DocHealthMetric[];
  contentHash: string;
}
