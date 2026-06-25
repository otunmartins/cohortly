export type ThreatLevel = "high" | "medium" | "low";
export type Authority = "FDA" | "EMA" | "MHRA";

export interface IntelKpis {
  activeTrials: number;
  activeTrialsDelta: number;
  newApproval: string;
  poolOverlapPct: number;
  poolOverlapLabel: string;
  siteCollisions: number;
  totalSites: number;
  regMilestones: number;
  dataAsOf: string;
}

export interface CompetingTrial {
  nct: string;
  name: string;
  sponsor: string;
  phase: string;
  n: number;
  enrolledPct: number;
  threat: ThreatLevel;
  ukOverlap: boolean;
  dataAsOf: string;
}

export interface LabelDecision {
  id: string;
  drug: string;
  authority: Authority;
  decision: string;
  date: string;
}

export interface CliffWatchItem {
  id: string;
  drug: string;
  kind: "patent" | "exclusivity";
  date: string;
  daysUntil: number;
}

export interface SiteOverlapData {
  yourSites: string[];
  competitors: string[];
  competitorNames: string[];
  cells: number[][];
  atRiskCount: number;
}

export interface IntelData {
  indication: string;
  therapeuticArea: string;
  outlookMonths: number;
  summary: string;
  kpis: IntelKpis;
  competingTrials: CompetingTrial[];
  labelDecisions: LabelDecision[];
  cliffWatch: CliffWatchItem[];
  siteOverlap: SiteOverlapData;
}
