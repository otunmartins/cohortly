"use client";

import type { ScenarioLever } from "@/types/eligibility";

interface Props {
  levers: ScenarioLever[];
  basePoolPct: number;
  modelledPoolPct: number;
  onToggle: (id: string, enabled: boolean) => void;
}

export function ScenarioLevers({ levers, basePoolPct, modelledPoolPct, onToggle }: Props) {
  const delta = modelledPoolPct - basePoolPct;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(45%_0.01_240)]">
          Scenario modelling
        </span>
      </div>

      {/* Modelled pool summary */}
      <div className="rounded-lg border border-paper-200 bg-paper-50 px-3 py-2.5 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] text-[oklch(55%_0.01_240)]">Modelled eligible pool</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-[18px] font-display tabular-nums text-[oklch(20%_0.01_240)] leading-none">
              {modelledPoolPct.toFixed(1)}%
            </span>
            {delta !== 0 && (
              <span
                className={`text-[11px] font-mono font-semibold tabular-nums ${
                  delta > 0 ? "text-[oklch(42%_0.14_145)]" : "text-[oklch(48%_0.18_25)]"
                }`}
              >
                {delta > 0 ? "+" : ""}
                {delta.toFixed(1)}pp
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-[oklch(60%_0.01_240)]">vs baseline</div>
          <div className="text-[12px] font-mono tabular-nums text-[oklch(50%_0.01_240)]">
            {basePoolPct.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Levers */}
      <div className="flex flex-col gap-1.5">
        {levers.map((lever) => (
          <div
            key={lever.id}
            className="flex items-center justify-between gap-2 rounded px-2.5 py-2 border border-paper-200 bg-white"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-medium text-[oklch(20%_0.01_240)] truncate">
                {lever.label}
              </span>
              <span className="text-[9px] text-[oklch(55%_0.01_240)] leading-relaxed">
                {lever.description}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {lever.enabled && (
                <span className="text-[10px] font-mono font-semibold text-[oklch(42%_0.14_145)]">
                  +{lever.delta}pp
                </span>
              )}
              {/* Toggle switch */}
              <button
                role="switch"
                aria-checked={lever.enabled}
                aria-label={`Toggle ${lever.label}`}
                onClick={() => onToggle(lever.id, !lever.enabled)}
                className={`relative w-8 h-4 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500 ${
                  lever.enabled ? "bg-brand-500" : "bg-paper-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                    lever.enabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
