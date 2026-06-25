"use client";

import { useState, useTransition } from "react";
import type { FeasibilityData, FeasibilityLever, ForecastPoint } from "@/types/feasibility";
import { FeasibilityKpiHeader } from "./FeasibilityKpiHeader";
import { EnrolmentForecastChart } from "./EnrolmentForecastChart";
import { ScenarioLevers } from "./ScenarioLevers";
import { SiteLandscape } from "./SiteLandscape";
import { CompetingTrialsList } from "./CompetingTrialsList";
import { runFeasibility } from "@/actions/feasibility";

interface Props {
  data: FeasibilityData;
}

function recomputeForecast(
  base: ForecastPoint[],
  levers: FeasibilityLever[],
): ForecastPoint[] {
  const sitesLever = levers.find((l) => l.id === "sites");
  const sfLever = levers.find((l) => l.id === "screen_fail");
  const adaptiveLever = levers.find((l) => l.id === "adaptive");

  const siteFactor = sitesLever ? sitesLever.value / 28 : 1;
  const sfFactor = sfLever ? (100 - sfLever.value) / 62 : 1;
  const adaptiveBoost = adaptiveLever?.value === 1 ? 1.05 : 1;

  const scale = siteFactor * sfFactor * adaptiveBoost;

  return base.map((p) => {
    const cap = 320;
    return {
      ...p,
      p10: Math.min(Math.round(p.p10 * scale), cap),
      p50: Math.min(Math.round(p.p50 * scale), cap),
      p90: Math.min(Math.round(p.p90 * scale), cap),
      ciLow: Math.min(Math.round(p.ciLow * scale), cap),
      ciHigh: Math.min(Math.round(p.ciHigh * scale), cap),
    };
  });
}

export function FeasibilityClient({ data }: Props) {
  const [levers, setLevers] = useState<FeasibilityLever[]>(data.levers);
  const [forecast, setForecast] = useState<ForecastPoint[]>(data.forecast);
  const [seed, setSeed] = useState(data.seed);
  const [isSimulating, startSimulating] = useTransition();

  const defaultLevers = data.levers;

  function handleSliderChange(id: string, value: number) {
    setLevers((prev) => prev.map((l) => (l.id === id ? { ...l, value } : l)));
  }

  function handleToggleChange(id: string, value: number) {
    setLevers((prev) => prev.map((l) => (l.id === id ? { ...l, value } : l)));
  }

  function handleReset() {
    setLevers(defaultLevers);
    setForecast(data.forecast);
  }

  function handleRunSimulation() {
    startSimulating(async () => {
      const result = await runFeasibility({
        projectId: data.projectId,
        scenario: Object.fromEntries(levers.map((l) => [l.id, l.value])),
      });
      if (result.success) {
        const newForecast = recomputeForecast(data.forecast, levers);
        setForecast(newForecast);
        setSeed({ runs: 1000, lastRunAt: new Date().toISOString() });
      }
    });
  }

  function handleResimulate() {
    handleRunSimulation();
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* KPI strip */}
      <FeasibilityKpiHeader kpis={data.kpis} />

      {/* Main area: chart + right rail */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: chart stacked above site landscape + competing trials */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 min-h-0">
          {/* Forecast chart */}
          <div className="flex-1 min-h-0 border border-paper-200 rounded-lg p-4 bg-paper-50">
            <EnrolmentForecastChart
              forecast={forecast}
              seed={seed}
              targetN={data.kpis.targetN}
              isSimulating={isSimulating}
              onResimulate={handleResimulate}
            />
          </div>

          {/* Bottom row: site landscape + competing trials */}
          <div className="flex gap-4 h-52 shrink-0">
            <div className="flex-1 min-w-0 border border-paper-200 rounded-lg p-4 bg-paper-50 overflow-hidden">
              <SiteLandscape sites={data.sites} />
            </div>
            <div className="flex-1 min-w-0 border border-paper-200 rounded-lg p-4 bg-paper-50 overflow-hidden">
              <CompetingTrialsList trials={data.competingTrials} />
            </div>
          </div>
        </div>

        {/* Right rail: scenario levers */}
        <div className="w-64 shrink-0 border border-paper-200 rounded-lg p-4 bg-paper-50 overflow-y-auto">
          <ScenarioLevers
            levers={levers}
            isSimulating={isSimulating}
            onSliderChange={handleSliderChange}
            onToggleChange={handleToggleChange}
            onRunSimulation={handleRunSimulation}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
}
