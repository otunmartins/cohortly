import type { DashboardData, KpiMetric, ReviewItem, RegUpdate, AuditEntry } from "@/types/dashboard";
import { MOCK_PROJECTS } from "@/lib/mock-data";

const MOCK_KPIS: KpiMetric[] = [
  { label: "Active studies",           value: "14",    delta: 2,    subtext: "across 4 indications" },
  { label: "Documents in review",      value: "37",    delta: -4,   subtext: "11 below SLA" },
  { label: "Open regulatory queries",  value: "8",     delta: 1,    subtext: "2 escalated to MHRA" },
  { label: "AI evidence coverage",     value: "94.2%", delta: 8.6,  subtext: "of generated statements" },
];

const MOCK_REVIEW_QUEUE: ReviewItem[] = [
  {
    id: "rq_001",
    type: "protocol",
    studyId: "MAP-204",
    docId: "IND-019",
    title: "Protocol v3 — Phase II NASH (MAP-204 onaplazib 200 mg)",
    tags: [
      { label: "SPIRIT", variant: "info" },
      { label: "ICH E6(R3)", variant: "info" },
    ],
    confidence: 80,
    age: "4d",
    href: "/protocols/proto_map_204",
  },
  {
    id: "rq_002",
    type: "reg_writing",
    studyId: "MAP-204",
    docId: "CTD-2.7",
    title: "IND Module 2.7 Clinical Summary — Onaplazib hepatic safety data",
    tags: [
      { label: "ICH E6(R3)", variant: "info" },
      { label: "Citation gap ×2", variant: "warn" },
    ],
    confidence: 79,
    age: "1d",
    href: "/writing/doc_ctd_204",
  },
  {
    id: "rq_003",
    type: "safety",
    studyId: "MAP-204",
    docId: "SAE-1142",
    title: "SAE narrative — Subject 04-218, neutropenic fever grade 3",
    tags: [
      { label: "MedDRA-coded", variant: "default" },
      { label: "15-day expedited", variant: "danger" },
    ],
    confidence: 46,
    age: "1d",
    href: "/safety/sae_1142",
  },
  {
    id: "rq_004",
    type: "ethics",
    studyId: "MAP-003",
    docId: "IRAS-77",
    title: "IRAS amendment 3 — paediatric extension, AAV gene therapy",
    tags: [
      { label: "IRAS", variant: "info" },
    ],
    confidence: 83,
    age: "17 min",
    href: "/ethics/eth_map_003",
  },
];

const MOCK_REG_PULSE: RegUpdate[] = [
  {
    id: "rp_001",
    authority: "MHRA",
    body: "eAP application window reopened for Q3",
    age: "29 ago · auto-indexed",
  },
  {
    id: "rp_002",
    authority: "FDA",
    body: "Draft guidance: Decentralised trials; comment period closes 14 Jun",
    age: "3d",
  },
  {
    id: "rp_003",
    authority: "EMA",
    body: "CTIS v2.7 — schema change affects 3 of your studies",
    age: "5d",
    affectsStudies: 3,
  },
  {
    id: "rp_004",
    authority: "ICH",
    body: "E6(R3) Step 4 adopted — protocol checks updated",
    age: "6d",
  },
];

const MOCK_AUDIT_TRAIL: AuditEntry[] = [
  {
    id: "ae_001",
    time: "Today",
    actorName: "Priya Shah",
    actorKind: "USER",
    actorInitials: "PS",
    actorColor: "oklch(58% 0.10 185)",
    action: "Approved",
    target: "ILz of IND-019",
  },
  {
    id: "ae_002",
    time: "09:17",
    actorName: "Priya Shah",
    actorKind: "USER",
    actorInitials: "PS",
    actorColor: "oklch(58% 0.10 185)",
    action: "Edited inclusion criterion 6",
    target: "MAP-204",
  },
  {
    id: "ae_003",
    time: "09:16",
    actorName: "Priya Shah",
    actorKind: "USER",
    actorInitials: "PS",
    actorColor: "oklch(58% 0.10 185)",
    action: "Edited inclusion criterion 6",
    target: "MAP-204",
  },
  {
    id: "ae_004",
    time: "08:16",
    actorName: "AI",
    actorKind: "AI",
    actorInitials: "AI",
    action: "Retrieved 14 chunks from",
    target: "ICH E6(R3)",
  },
  {
    id: "ae_005",
    time: "08:16",
    actorName: "Priya Shah",
    actorKind: "USER",
    actorInitials: "PS",
    actorColor: "oklch(58% 0.10 185)",
    action: "Locked protocol v2",
    target: "MAP-204",
  },
];

export async function getDashboardData(organizationId: string): Promise<DashboardData> {
  const activeProjects = MOCK_PROJECTS.filter(
    (p) =>
      p.organizationId === organizationId &&
      !["COMPLETED", "DRAFT"].includes(p.status),
  );

  return {
    greeting: "Good morning, Priya.",
    subline: "4 documents awaiting your review · 2 submissions due this week",
    kpis: MOCK_KPIS,
    reviewQueue: MOCK_REVIEW_QUEUE,
    regPulse: MOCK_REG_PULSE,
    auditTrail: MOCK_AUDIT_TRAIL,
  };
}

export async function getActiveProjects(organizationId: string) {
  return MOCK_PROJECTS.filter(
    (p) =>
      p.organizationId === organizationId &&
      !["COMPLETED", "DRAFT"].includes(p.status),
  );
}
