"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { ProtocolIntakeValues } from "@/types/protocol";

const TOGGLES: {
  field: keyof Pick<
    ProtocolIntakeValues,
    | "designRandomised"
    | "designDoubleBlind"
    | "designPlaceboControlled"
    | "designActiveComparator"
    | "designAdaptive"
    | "designOpenLabel"
  >;
  label: string;
}[] = [
  { field: "designRandomised", label: "Randomised" },
  { field: "designDoubleBlind", label: "Double-blind" },
  { field: "designPlaceboControlled", label: "Placebo-controlled" },
  { field: "designActiveComparator", label: "Active-comparator" },
  { field: "designAdaptive", label: "Adaptive" },
  { field: "designOpenLabel", label: "Open-label" },
];

interface Props {
  control: Control<ProtocolIntakeValues>;
}

export function DesignToggles({ control }: Props) {
  return (
    <fieldset>
      <legend className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-2">
        Study design
      </legend>
      <div className="flex flex-wrap gap-2">
        {TOGGLES.map(({ field, label }) => (
          <Controller
            key={field}
            name={field}
            control={control}
            render={({ field: { value, onChange } }) => (
              <button
                type="button"
                role="switch"
                aria-checked={value as boolean}
                onClick={() => onChange(!(value as boolean))}
                className={[
                  "px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors",
                  value
                    ? "bg-brand-500 border-brand-500 text-white"
                    : "bg-white border-paper-200 text-[oklch(40%_0.01_240)] hover:border-brand-500 hover:text-brand-700",
                ].join(" ")}
              >
                {label}
              </button>
            )}
          />
        ))}
      </div>
    </fieldset>
  );
}
