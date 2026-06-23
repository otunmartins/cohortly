"use client";

import { useState, useTransition } from "react";
import type { EligibilityData, Criterion, ScenarioLever } from "@/types/eligibility";
import { EligibilityKpiHeader } from "./EligibilityKpiHeader";
import { CriteriaTable } from "./CriteriaTable";
import { ScenarioLevers } from "./ScenarioLevers";
import { DemographicBars } from "./DemographicBars";
import { SiteReadinessList } from "./SiteReadinessList";
import { removeCriterion } from "@/actions/eligibility";

interface Props {
  data: EligibilityData;
}

export function EligibilityClient({ data }: Props) {
  const [criteria, setCriteria] = useState<Criterion[]>(data.criteria);
  const [levers, setLevers] = useState<ScenarioLever[]>(data.levers);
  const [, startTransition] = useTransition();

  const basePoolPct = data.summary.poolPct;
  const modelledPoolPct =
    basePoolPct +
    levers.filter((l) => l.enabled).reduce((sum, l) => sum + l.delta, 0);

  function handleToggleLever(id: string, enabled: boolean) {
    setLevers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled } : l)),
    );
  }

  function handleUpdated(id: string, text: string) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c)),
    );
  }

  function handleDeleted(id: string) {
    startTransition(async () => {
      const result = await removeCriterion({ id, projectId: data.projectId });
      if (result.success) {
        setCriteria((prev) => prev.filter((c) => c.id !== id));
      }
    });
  }

  function handleAdded(criterion: Criterion) {
    setCriteria((prev) => [...prev, criterion]);
  }

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* KPI strip */}
      <EligibilityKpiHeader
        summary={data.summary}
        modelledPoolPct={modelledPoolPct}
      />

      {/* Main two-column layout */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left — criteria table (grows) */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">
          <CriteriaTable
            criteria={criteria}
            projectId={data.projectId}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
            onAdded={handleAdded}
          />
        </div>

        {/* Right rail */}
        <div className="w-72 shrink-0 flex flex-col gap-5 overflow-y-auto">
          <ScenarioLevers
            levers={levers}
            basePoolPct={basePoolPct}
            modelledPoolPct={modelledPoolPct}
            onToggle={handleToggleLever}
          />
          <div className="border-t border-paper-200" />
          <DemographicBars demographics={data.demographics} />
          <div className="border-t border-paper-200" />
          <SiteReadinessList sites={data.sites} />
        </div>
      </div>
    </div>
  );
}
