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
