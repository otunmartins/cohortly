export interface FeasibilityKpis {
  timeToN: number;
  timeToNDelta: number;
  eligiblePoolPct: number;
  eligiblePoolLabel: string;
  activationCostGbp: number;
  activationCostDelta: number;
  probabilityOfSuccessPct: number;
  probabilityOfSuccessDelta: number;
  criticalPathDays: number;
  criticalPathDelta: number;
  criticalPathLabel: string;
  targetN: number;
}

export interface ForecastPoint {
  month: number;
  p10: number;
  p50: number;
  p90: number;
  ciLow: number;
  ciHigh: number;
  sponsorPlan: number;
  target: number;
}

export interface MonteCarloSeed {
  runs: number;
  lastRunAt: string;
}

export interface FeasibilityLever {
  id: string;
  label: string;
  kind: "slider" | "toggle";
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface FeasibilitySite {
  id: string;
  name: string;
  city: string;
  country: string;
  region: "UK" | "EU" | "US";
  projectedPerMonth: number;
}

export interface FeasibilityCompetingTrial {
  nct: string;
  sponsor: string;
  n: number;
  enrolledPct: number;
  phase: string;
  indication: string;
  dataAsOf: string;
}

export interface FeasibilityData {
  projectId: string;
  projectCode: string;
  projectTitle: string;
  indication: string;
  kpis: FeasibilityKpis;
  forecast: ForecastPoint[];
  seed: MonteCarloSeed;
  levers: FeasibilityLever[];
  sites: FeasibilitySite[];
  competingTrials: FeasibilityCompetingTrial[];
}
