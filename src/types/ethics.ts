export type SectionStatus = "complete" | "in-progress" | "draft" | "empty";
export type DocStatus = "submitted" | "in-progress" | "draft" | "missing";
export type HraCheckStatus = "pass" | "warn" | "n-a";
export type AnswerKind = "auto" | "edited";
export type MilestoneStatus = "done" | "current" | "upcoming";

export interface IrasAnswer {
  id: string;
  questionCode: string;
  question: string;
  answer: string;
  kind: AnswerKind;
  sourceRef: string;
  confidence: number;
}

export interface PisReadability {
  plainEnglish: boolean;
  readingAge: number;
  fleschScore: number;
  wordCount: number;
  sectionCount: number;
  hraTemplateVersion: string;
}

export interface FormSection {
  id: string;
  code: string;
  title: string;
  answeredCount: number;
  totalCount: number;
  status: SectionStatus;
  answers?: IrasAnswer[];
  pisReadability?: PisReadability;
}

export interface RequiredDoc {
  id: string;
  label: string;
  detail?: string;
  status: DocStatus;
}

export interface HraCheck {
  id: string;
  framework: string;
  status: HraCheckStatus;
  note?: string;
}

export interface HraGap {
  message: string;
  sectionRef: string;
  action: string;
}

export interface RecMilestone {
  id: string;
  label: string;
  date: string;
  status: MilestoneStatus;
}

export interface NihrPortfolio {
  eligible: boolean;
  studyType: string;
  category: string;
  adopted: boolean;
}

export interface EthicsApplication {
  id: string;
  irasId: string;
  version: string;
  completionPct: number;
  projectCode: string;
  projectTitle: string;
  jurisdiction: string;
  authority: string;
}

export interface EthicsPageData {
  application: EthicsApplication;
  sections: FormSection[];
  requiredDocs: RequiredDoc[];
  hraChecks: HraCheck[];
  hraGap: HraGap;
  recTimeline: RecMilestone[];
  nihrPortfolio: NihrPortfolio;
  activeSection: FormSection;
}
