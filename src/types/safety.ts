export type SaeClock = "15-day" | "7-day";
export type SaeStatus = "open" | "awaiting-sign-off" | "filed" | "overdue";
export type SaeSeverity = "mild" | "moderate" | "severe" | "life-threatening" | "fatal";
export type SaeCausality = "unlikely" | "possible" | "probable" | "definite";
export type SaeOutcome = "recovered" | "recovering" | "not-recovered" | "sequelae" | "fatal" | "unknown";
export type NarrativeStatus = "pending" | "accepted" | "rejected";
export type NarrativeTab = "narrative" | "timeline" | "labs";
export type SignalAssessment = "possible" | "probable" | "confirmed" | "refuted";

export interface Demographics {
  sex: string;
  age: number;
  ethnicity: string;
  bmi: number;
  nasScore: string;
  fibrosisStage: string;
}

export interface MedDRAEvent {
  pt: string;
  ptCode: string;
  soc: string;
  onsetDate: string;
  severity: SaeSeverity;
  outcome: SaeOutcome;
  causality: SaeCausality;
}

export interface ConcomitantMed {
  name: string;
  dose: string;
  indication: string;
}

export interface RelevantHistory {
  condition: string;
  year: number;
}

export interface ReportingClock {
  clockType: SaeClock;
  daysRemaining: number;
  hoursRemaining: number;
  dueDate: string;
  overdue: boolean;
}

export interface SafetyCase {
  id: string;
  saeRef: string;
  subjectRef: string;
  projectCode: string;
  siteCode: string;
  studyDrug: string;
  studyDose: string;
  expedited: boolean;
  isSusar: boolean;
  clock: ReportingClock;
  status: SaeStatus;
  demographics: Demographics;
  event: MedDRAEvent;
  concomitantMeds: ConcomitantMed[];
  relevantHistory: RelevantHistory[];
}

export interface CrfHighlight {
  text: string;
  field: string;
}

export interface NarrativeParagraph {
  id: string;
  text: string;
  highlights: CrfHighlight[];
}

export interface FooterMetric {
  label: string;
  value: string;
}

export interface SafetyNarrative {
  id: string;
  caseId: string;
  status: NarrativeStatus;
  confidence: number;
  sourceFieldCount: number;
  templateVersion: string;
  modelVersion: string;
  paragraphs: NarrativeParagraph[];
  footerMetrics: FooterMetric[];
  timelineEntries: TimelineEntry[];
  labRows: LabRow[];
}

export interface TimelineEntry {
  date: string;
  event: string;
  detail?: string;
  flagged?: boolean;
}

export interface LabRow {
  test: string;
  baseline: string;
  day14: string;
  day28: string;
  day41: string;
  unit: string;
  flagged?: boolean;
}

export interface QueueCase {
  id: string;
  saeRef: string;
  subjectRef: string;
  meddraPt: string;
  clockType: SaeClock;
  daysRemaining: number;
  hoursRemaining: number;
  overdue: boolean;
  confidence: number;
  status: SaeStatus;
}

export interface SafetySignal {
  id: string;
  term: string;
  assessment: SignalAssessment;
  observed: number;
  expected: number;
  prr: number;
  chiSquared: number;
  detail: string;
}

export interface CumulativeSafety {
  projectCode: string;
  totalSaes: number;
  totalSusars: number;
  dsurDue: string;
  dsmbNext: string;
}

export interface SafetyPageData {
  safetyCase: SafetyCase;
  narrative: SafetyNarrative;
  narrativeQueue: QueueCase[];
  signals: SafetySignal[];
  cumulative: CumulativeSafety;
}

export interface SafetyQueuePageData {
  queue: QueueCase[];
  cumulative: CumulativeSafety;
}
