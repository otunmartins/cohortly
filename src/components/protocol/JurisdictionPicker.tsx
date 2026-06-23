"use client";

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { Jurisdiction, ProtocolIntakeValues } from "@/types/protocol";
import { JURISDICTIONS } from "@/types/protocol";

const JURISDICTION_META: Record<Jurisdiction, { flag: string; short: string }> = {
  "UK·MHRA ILAP":        { flag: "🇬🇧", short: "MHRA" },
  "US·FDA IND":          { flag: "🇺🇸", short: "FDA" },
  "EU·EMA CTIS":         { flag: "🇪🇺", short: "EMA" },
  "CA·Health Canada CTA":{ flag: "🇨🇦", short: "HC" },
  "AU·TGA CTN":          { flag: "🇦🇺", short: "TGA" },
};

interface Props {
  control: Control<ProtocolIntakeValues>;
  error?: string;
}

export function JurisdictionPicker({ control, error }: Props) {
  return (
    <fieldset>
      <legend className="text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-1.5">
        Target jurisdictions
        <span className="ml-1 text-[oklch(60%_0.01_240)] font-normal">(select all that apply)</span>
      </legend>

      <Controller
        name="jurisdictions"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="flex flex-wrap gap-2">
            {JURISDICTIONS.map((j) => {
              const meta = JURISDICTION_META[j];
              const selected = (value as Jurisdiction[]).includes(j);
              return (
                <button
                  key={j}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => {
                    const next = selected
                      ? (value as Jurisdiction[]).filter((v) => v !== j)
                      : [...(value as Jurisdiction[]), j];
                    onChange(next);
                  }}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-colors",
                    selected
                      ? "bg-brand-50 border-brand-500 text-brand-700"
                      : "bg-white border-paper-200 text-[oklch(40%_0.01_240)] hover:border-brand-500",
                  ].join(" ")}
                >
                  <span aria-hidden="true">{meta.flag}</span>
                  <span>{j}</span>
                </button>
              );
            })}
          </div>
        )}
      />

      {error && (
        <p role="alert" className="mt-1 text-[10px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
