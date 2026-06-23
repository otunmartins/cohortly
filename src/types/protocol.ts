import { z } from "zod";

export const PHASES = ["I", "Ib·IIa", "II", "IIb·III", "III"] as const;
export type Phase = (typeof PHASES)[number];

export const MODALITIES = [
  "Small molecule",
  "Monoclonal antibody",
  "Bispecific antibody",
  "ADC",
  "Cell therapy",
  "Gene therapy",
  "Oligonucleotide",
  "Peptide",
  "Vaccine",
  "Other",
] as const;
export type ProductModality = (typeof MODALITIES)[number];

export const JURISDICTIONS = [
  "UK·MHRA ILAP",
  "US·FDA IND",
  "EU·EMA CTIS",
  "CA·Health Canada CTA",
  "AU·TGA CTN",
] as const;
export type Jurisdiction = (typeof JURISDICTIONS)[number];

export type IntakeMode = "guided" | "freeform" | "import";

// ── Protocol Copilot (S07) ─────────────────────────────────────────────────

export type SectionStatus = "empty" | "draft" | "flagged" | "complete";
export type DocStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "LOCKED";
export type EditorTab = "edit" | "review" | "compare";
export type RecommendationStatus = "pending" | "confirmed" | "dismissed";

export interface ProtocolSection {
  id: string;
  number: string;
  heading: string;
  sourceCount: number;
  flaggedCount: number;
  gapCount: number;
  status: SectionStatus;
  /** TipTap ProseMirror JSON document */
  contentJson: Record<string, unknown>;
  complianceScore: number;
}

export interface ComplianceMeter {
  framework: string;
  completed: number;
  total: number;
}

export interface RetrievedSource {
  id: string;
  n: number;
  authority: string;
  title: string;
  relevanceScore: number;
  kind: string;
  snippet: string;
}

export interface ProtocolRecommendation {
  id: string;
  tag: string;
  status: RecommendationStatus;
  text: string;
  confidence: number;
  precedentCount: number;
  sectionId: string;
}

export interface TaEvidence {
  precedentProtocols: number;
  similarTrials: number;
  sponsors: string[];
  confidence: number;
  recruitment: number;
}

export interface ProtocolDocument {
  id: string;
  projectId: string;
  projectCode: string;
  projectTitle: string;
  status: DocStatus;
  lastEditedBy: string;
  lastEditedAgo: string;
  therapeuticArea: string;
  phase: string;
  sections: ProtocolSection[];
  complianceMeters: ComplianceMeter[];
  retrievedSources: RetrievedSource[];
  recommendation: ProtocolRecommendation;
  taEvidence: TaEvidence;
}

export const ProtocolIntakeSchema = z.object({
  therapeuticArea: z.string().min(1, "Required"),
  meshCode: z.string().optional(),
  indication: z.string().min(2, "Required"),
  productName: z.string().min(1, "Required"),
  productModality: z.enum(MODALITIES, { error: "Required" }),
  productMoa: z.string().optional(),
  productRoute: z.string().optional(),
  productDose: z.string().optional(),
  phase: z.enum(PHASES, { error: "Required" }),
  designRandomised: z.boolean(),
  designDoubleBlind: z.boolean(),
  designPlaceboControlled: z.boolean(),
  designActiveComparator: z.boolean(),
  designAdaptive: z.boolean(),
  designOpenLabel: z.boolean(),
  targetSample: z.string().min(1, "Required"),
  allocationRatio: z.string().optional(),
  treatmentDuration: z.string().min(1, "Required"),
  targetFpi: z.string().min(1, "Required"),
  primaryEndpoint: z.string().min(10, "Describe the primary endpoint"),
  jurisdictions: z.array(z.enum(JURISDICTIONS)).min(1, "Select at least one"),
});

export type ProtocolIntakeValues = z.infer<typeof ProtocolIntakeSchema>;
