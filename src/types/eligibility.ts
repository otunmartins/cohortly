export type CriterionKind = "INCLUSION" | "EXCLUSION";

export type CriterionSource =
  | "Precedent"
  | "EMA SAWP"
  | "WHO"
  | "Sponsor SOP"
  | "FDA mandate"
  | "AASLD"
  | "ICH E14"
  | "CMC";

export interface Criterion {
  id: string;
  kind: CriterionKind;
  text: string;
  feasibility: number;
  source: CriterionSource;
  regMandated: boolean;
  warning?: string;
  projectId: string;
  organizationId: string;
}

export interface ScenarioLever {
  id: string;
  label: string;
  description: string;
  delta: number;
  enabled: boolean;
}

export interface DemographicItem {
  group: string;
  modelled: number;
  fdaTarget: number;
}

export interface EligibilitySite {
  id: string;
  name: string;
  city: string;
  readiness: number;
}

export interface ComparatorTrial {
  nct: string;
  sponsor: string;
  pct: number;
}

export interface EligibilitySummary {
  poolPct: number;
  poolLabel: string;
  screenFailurePct: number;
  screenFailureBenchmarkLow: number;
  screenFailureBenchmarkHigh: number;
  timeToEnrolMonths: number;
  timeToEnrolDelta: number;
  comparatorTrials: ComparatorTrial[];
  dataAsOf: string;
}

export interface EligibilityData {
  projectId: string;
  projectCode: string;
  projectTitle: string;
  indication: string;
  summary: EligibilitySummary;
  criteria: Criterion[];
  levers: ScenarioLever[];
  demographics: DemographicItem[];
  sites: EligibilitySite[];
}
