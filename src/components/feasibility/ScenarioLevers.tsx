"use client";

import { Play } from "lucide-react";
import type { FeasibilityLever } from "@/types/feasibility";

interface Props {
  levers: FeasibilityLever[];
  isSimulating: boolean;
  onSliderChange: (id: string, value: number) => void;
  onToggleChange: (id: string, value: number) => void;
  onRunSimulation: () => void;
  onReset: () => void;
}

export function ScenarioLevers({
  levers,
  isSimulating,
  onSliderChange,
  onToggleChange,
  onRunSimulation,
  onReset,
}: Props) {
  const sliders = levers.filter((l) => l.kind === "slider");
  const toggles = levers.filter((l) => l.kind === "toggle");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(45%_0.01_240)]">
          Scenario
        </span>
        <button
          onClick={onReset}
          className="text-[10px] text-[oklch(55%_0.01_240)] hover:text-[oklch(30%_0.01_240)] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-3">
        {sliders.map((lever) => (
          <div key={lever.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor={`lever-${lever.id}`}
                className="text-[11px] font-medium text-[oklch(25%_0.01_240)]"
              >
                {lever.label}
              </label>
              <span className="text-[11px] font-mono tabular-nums text-[oklch(30%_0.01_240)] font-semibold">
                {lever.value}{lever.unit}
              </span>
            </div>
            <input
              id={`lever-${lever.id}`}
              type="range"
              min={lever.min}
              max={lever.max}
              step={lever.step}
              value={lever.value}
              onChange={(e) => onSliderChange(lever.id, Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer accent-[oklch(58%_0.10_185)] bg-paper-200"
              style={{
                background: `linear-gradient(to right, oklch(58% 0.10 185) 0%, oklch(58% 0.10 185) ${
                  (((lever.value ?? 0) - (lever.min ?? 0)) / ((lever.max ?? 100) - (lever.min ?? 0))) * 100
                }%, oklch(90% 0.005 240) ${
                  (((lever.value ?? 0) - (lever.min ?? 0)) / ((lever.max ?? 100) - (lever.min ?? 0))) * 100
                }%, oklch(90% 0.005 240) 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] font-mono text-[oklch(65%_0.01_240)]">
              <span>{lever.min}{lever.unit}</span>
              <span>{lever.max}{lever.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-paper-200" />

      {/* Toggles */}
      <div className="flex flex-col gap-1.5">
        {toggles.map((lever) => (
          <div
            key={lever.id}
            className="flex items-center justify-between gap-2 px-2.5 py-2 rounded border border-paper-200 bg-white"
          >
            <span className="text-[11px] font-medium text-[oklch(25%_0.01_240)]">
              {lever.label}
            </span>
            <button
              role="switch"
              aria-checked={lever.value === 1}
              aria-label={`Toggle ${lever.label}`}
              onClick={() => onToggleChange(lever.id, lever.value === 1 ? 0 : 1)}
              className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 shrink-0 ${
                lever.value === 1 ? "bg-brand-500" : "bg-paper-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                  lever.value === 1 ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Run button */}
      <button
        onClick={onRunSimulation}
        disabled={isSimulating}
        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "oklch(58% 0.10 185)" }}
        onMouseEnter={(e) => {
          if (!isSimulating) e.currentTarget.style.backgroundColor = "oklch(45% 0.09 185)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "oklch(58% 0.10 185)";
        }}
      >
        <Play size={11} aria-hidden="true" />
        {isSimulating ? "Running 1,000 simulations…" : "Run 1,000 simulations"}
      </button>
    </div>
  );
}
