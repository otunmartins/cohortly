"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles, Lightbulb } from "lucide-react";
import {
  PHASES,
  MODALITIES,
  ProtocolIntakeSchema,
  type ProtocolIntakeValues,
} from "@/types/protocol";
import { DesignToggles } from "./DesignToggles";
import { JurisdictionPicker } from "./JurisdictionPicker";

const MESH_OPTIONS = [
  { label: "Non-alcoholic steatohepatitis (NASH)", code: "D065626" },
  { label: "Hepatitis C, Chronic", code: "D019698" },
  { label: "Non-Small-Cell Lung Carcinoma", code: "D002289" },
  { label: "Diabetes Mellitus, Type 2", code: "D003924" },
  { label: "Heart Failure", code: "D006333" },
  { label: "Arthritis, Rheumatoid", code: "D001172" },
  { label: "Multiple Sclerosis", code: "D009103" },
  { label: "Alzheimer Disease", code: "D000544" },
  { label: "Breast Neoplasms", code: "D001943" },
  { label: "Atrial Fibrillation", code: "D001281" },
];

const ENDPOINT_SUGGESTIONS: { label: string; value: string; hint: string }[] = [
  {
    label: "NASH resolution (FDA 2023)",
    value:
      "Proportion of patients achieving NASH resolution without worsening of liver fibrosis at week 52, per FDA 2023 NASH guidance biopsy criteria.",
    hint: "FDA 2023 NASH guidance · 47 precedent trials",
  },
  {
    label: "Overall survival (oncology)",
    value: "Overall survival (OS) defined as time from randomisation to death from any cause.",
    hint: "ICH E9(R1) · 312 oncology trials",
  },
  {
    label: "HbA1c reduction (T2DM)",
    value:
      "Change from baseline in HbA1c at week 26 versus placebo, as assessed by central laboratory.",
    hint: "FDA T2DM 2020 guidance · 189 precedent trials",
  },
  {
    label: "MACE (cardiovascular)",
    value:
      "Time to first occurrence of major adverse cardiovascular events (MACE: CV death, non-fatal MI, non-fatal stroke) in a time-to-event analysis.",
    hint: "EMA cardiovascular guidance · 94 precedent trials",
  },
];

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-1"
    >
      {children}
      {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-0.5 text-[10px] text-danger">
      {message}
    </p>
  );
}

export function IntakeGuidedForm() {
  const router = useRouter();
  const [meshQuery, setMeshQuery] = useState("");
  const [meshOpen, setMeshOpen] = useState(false);
  const [showEndpointSuggestions, setShowEndpointSuggestions] = useState(false);
  const meshRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProtocolIntakeValues>({
    resolver: zodResolver(ProtocolIntakeSchema),
    defaultValues: {
      therapeuticArea: "",
      meshCode: "",
      indication: "",
      productName: "",
      productMoa: "",
      productRoute: "",
      productDose: "",
      designRandomised: false,
      designDoubleBlind: false,
      designPlaceboControlled: false,
      designActiveComparator: false,
      designAdaptive: false,
      designOpenLabel: false,
      targetSample: "",
      allocationRatio: "1:1",
      treatmentDuration: "",
      targetFpi: "",
      primaryEndpoint: "",
      jurisdictions: [],
    },
    mode: "onChange",
  });

  // Register fields that are driven by setValue rather than a DOM input
  useEffect(() => {
    register("therapeuticArea");
    register("meshCode");
  }, [register]);

  // Close MeSH dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (meshRef.current && !meshRef.current.contains(e.target as Node)) {
        setMeshOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredMesh = MESH_OPTIONS.filter(
    (o) =>
      meshQuery.length >= 2 &&
      o.label.toLowerCase().includes(meshQuery.toLowerCase()),
  );

  function onSubmit() {
    router.push("/protocols/stub-001");
  }

  const selectedPhase = useWatch({ control, name: "phase" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Row 1: Therapeutic area + Indication */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Therapeutic area with MeSH autocomplete */}
        <div ref={meshRef} className="relative">
          <FieldLabel htmlFor="therapeuticArea" required>
            Therapeutic area
            <span className="ml-1 text-[9px] font-normal font-mono text-[oklch(50%_0.01_240)]">
              MeSH
            </span>
          </FieldLabel>
          <input
            id="therapeuticArea"
            type="text"
            autoComplete="off"
            value={meshQuery}
            onChange={(e) => {
              setMeshQuery(e.target.value);
              setValue("therapeuticArea", e.target.value, { shouldValidate: true });
              setMeshOpen(true);
            }}
            onFocus={() => meshQuery.length >= 2 && setMeshOpen(true)}
            role="combobox"
            placeholder="e.g. Non-alcoholic steatohepatitis"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-controls="mesh-listbox"
            aria-expanded={meshOpen && filteredMesh.length > 0}
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          {meshOpen && filteredMesh.length > 0 && (
            <ul
              id="mesh-listbox"
              role="listbox"
              aria-label="MeSH term suggestions"
              className="absolute z-20 mt-1 w-full bg-white border border-paper-200 rounded-lg shadow-lg max-h-44 overflow-y-auto"
            >
              {filteredMesh.map((opt) => (
                <li
                  key={opt.code}
                  role="option"
                  aria-selected={false}
                  className="flex items-center justify-between px-3 py-2 text-[11px] hover:bg-brand-50 cursor-pointer"
                  onMouseDown={() => {
                    setMeshQuery(opt.label);
                    setValue("therapeuticArea", opt.label, { shouldValidate: true });
                    setValue("meshCode", opt.code);
                    setMeshOpen(false);
                  }}
                >
                  <span className="text-[oklch(20%_0.01_240)]">{opt.label}</span>
                  <span className="font-mono text-[9px] text-[oklch(55%_0.01_240)] ml-2 shrink-0">
                    {opt.code}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <FieldError message={errors.therapeuticArea?.message} />
        </div>

        {/* Indication */}
        <div>
          <FieldLabel htmlFor="indication" required>
            Indication
          </FieldLabel>
          <input
            id="indication"
            type="text"
            {...register("indication")}
            placeholder="e.g. NASH with F2–F3 fibrosis"
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          <FieldError message={errors.indication?.message} />
        </div>
      </div>

      {/* Row 2: Investigational product */}
      <fieldset>
        <legend className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-2">
          Investigational product
          <span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Name */}
          <div>
            <FieldLabel htmlFor="productName" required>Name</FieldLabel>
            <input
              id="productName"
              type="text"
              {...register("productName")}
              placeholder="e.g. Semaglutide"
              className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
            <FieldError message={errors.productName?.message} />
          </div>

          {/* Modality */}
          <div>
            <FieldLabel htmlFor="productModality" required>Modality</FieldLabel>
            <div className="relative">
              <select
                id="productModality"
                {...register("productModality")}
                className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              >
                <option value="">Select modality</option>
                {MODALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[oklch(50%_0.01_240)] pointer-events-none"
                aria-hidden="true"
              />
            </div>
            <FieldError message={errors.productModality?.message} />
          </div>

          {/* MoA */}
          <div>
            <FieldLabel htmlFor="productMoa">MoA</FieldLabel>
            <input
              id="productMoa"
              type="text"
              {...register("productMoa")}
              placeholder="e.g. GLP-1 receptor agonist"
              className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Route */}
          <div>
            <FieldLabel htmlFor="productRoute">Route</FieldLabel>
            <input
              id="productRoute"
              type="text"
              {...register("productRoute")}
              placeholder="e.g. Subcutaneous"
              className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>

          {/* Dose */}
          <div>
            <FieldLabel htmlFor="productDose">Dose</FieldLabel>
            <input
              id="productDose"
              type="text"
              {...register("productDose")}
              placeholder="e.g. 2.4 mg weekly"
              className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
            />
          </div>
        </div>
      </fieldset>

      {/* Row 3: Phase */}
      <fieldset>
        <legend className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-2">
          Phase
          <span className="ml-0.5 text-danger" aria-hidden="true">*</span>
        </legend>
        <div role="group" aria-label="Trial phase" className="flex gap-1 flex-wrap">
          {PHASES.map((p) => (
            <label key={p} className="cursor-pointer">
              <input
                type="radio"
                value={p}
                {...register("phase")}
                className="sr-only"
              />
              <span
                className={[
                  "inline-flex items-center px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors",
                  selectedPhase === p
                    ? "bg-brand-500 border-brand-500 text-white"
                    : "bg-white border-paper-200 text-[oklch(40%_0.01_240)] hover:border-brand-500 hover:text-brand-700",
                ].join(" ")}
              >
                {p}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.phase?.message} />
      </fieldset>

      {/* Row 4: Design toggles */}
      <DesignToggles control={control} />

      {/* Row 5: Sample + Ratio + Duration + FPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <FieldLabel htmlFor="targetSample" required>
            Target sample
          </FieldLabel>
          <input
            id="targetSample"
            type="text"
            {...register("targetSample")}
            placeholder="e.g. 320"
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] tabular-nums text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          <FieldError message={errors.targetSample?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="allocationRatio">
            Allocation
          </FieldLabel>
          <input
            id="allocationRatio"
            type="text"
            {...register("allocationRatio")}
            placeholder="e.g. 1:1"
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] font-mono text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>

        <div>
          <FieldLabel htmlFor="treatmentDuration" required>
            Duration
          </FieldLabel>
          <input
            id="treatmentDuration"
            type="text"
            {...register("treatmentDuration")}
            placeholder="e.g. 72 weeks"
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          <FieldError message={errors.treatmentDuration?.message} />
        </div>

        <div>
          <FieldLabel htmlFor="targetFpi" required>
            Target FPI
          </FieldLabel>
          <input
            id="targetFpi"
            type="text"
            {...register("targetFpi")}
            placeholder="e.g. Q3 2025"
            className="w-full px-3 py-2 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
          <FieldError message={errors.targetFpi?.message} />
        </div>
      </div>

      {/* Row 6: Primary endpoint */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <FieldLabel htmlFor="primaryEndpoint" required>
            Primary endpoint
          </FieldLabel>
          <button
            type="button"
            onClick={() => setShowEndpointSuggestions((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-brand-700 hover:underline"
          >
            <Lightbulb size={10} aria-hidden="true" />
            Suggested by guidance
          </button>
        </div>

        {showEndpointSuggestions && (
          <div className="mb-2 rounded-lg border border-accent-100 bg-accent-50 p-3 space-y-2">
            <p className="text-[10px] font-semibold text-accent-700 mb-2">
              Endpoint suggestions from retrieved guidance
            </p>
            {ENDPOINT_SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setValue("primaryEndpoint", s.value, { shouldValidate: true });
                  setShowEndpointSuggestions(false);
                }}
                className="w-full text-left p-2 rounded-md hover:bg-accent-100 transition-colors group"
              >
                <p className="text-[11px] font-medium text-[oklch(20%_0.01_240)] group-hover:text-brand-700">
                  {s.label}
                </p>
                <p className="text-[10px] text-[oklch(50%_0.01_240)] mt-0.5">{s.value}</p>
                <p className="text-[9px] font-mono text-[oklch(55%_0.01_240)] mt-0.5">{s.hint}</p>
              </button>
            ))}
          </div>
        )}

        <textarea
          id="primaryEndpoint"
          {...register("primaryEndpoint")}
          rows={3}
          placeholder="Describe the primary endpoint — measure, timepoint, and assessment method"
          className="w-full px-3 py-2.5 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none transition-colors"
        />
        <FieldError message={errors.primaryEndpoint?.message} />
      </div>

      {/* Row 7: Jurisdiction picker */}
      <JurisdictionPicker control={control} error={errors.jurisdictions?.message} />

      {/* Submit */}
      <div className="pt-2 border-t border-paper-200 flex items-center gap-3">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 text-white text-[12px] font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles size={13} aria-hidden="true" />
          {isSubmitting ? "Starting…" : "Generate draft protocol"}
        </button>
        {!isValid && (
          <p className="text-[10px] text-[oklch(55%_0.01_240)]">
            Complete all required fields to generate
          </p>
        )}
      </div>
    </form>
  );
}
