export type InboxFilter = "all" | "unread" | "mentions" | "reviews" | "safety" | "regulator";

export type DomainTag =
  | "Reg Writing"
  | "Regulator"
  | "Eligibility"
  | "Safety"
  | "Ethics"
  | "Protocol";

export type ThreadKind = "review" | "mention" | "regulator" | "safety_flag" | "system";

export type UrgencyLevel = "urgent" | "high" | "normal";

export interface InboxMessage {
  id: string;
  from: string;
  fromInitials: string;
  fromColor?: string;
  body: string;
  age: string;
}

export interface InboxThread {
  id: string;
  kind: ThreadKind;
  sender: string;
  senderInitials: string;
  senderColor?: string;
  subject: string;
  snippet: string;
  domainTag: DomainTag;
  studyCode: string;
  urgency: UrgencyLevel;
  age: string;
  isUnread: boolean;
  messages: InboxMessage[];
  organizationId: string;
}
