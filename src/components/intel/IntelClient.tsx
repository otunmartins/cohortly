"use client";

import type { IntelData } from "@/types/intel";
import { IntelKpiHeader } from "./IntelKpiHeader";
import { CompetingTrialsTable } from "./CompetingTrialsTable";
import { LabelDecisionsRail } from "./LabelDecisionsRail";
import { CliffWatch } from "./CliffWatch";
import { SiteOverlapHeatmap } from "./SiteOverlapHeatmap";

interface Props {
  data: IntelData;
}

export function IntelClient({ data }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* KPI strip */}
      <IntelKpiHeader kpis={data.kpis} />

      {/* Landscape header */}
      <div className="shrink-0">
        <h2 className="text-[14px] font-semibold text-[oklch(20%_0.01_240)]">
          {data.indication} · {data.therapeuticArea} · global · {data.outlookMonths}-month outlook
        </h2>
        <p className="text-[11px] text-[oklch(50%_0.01_240)] mt-0.5">{data.summary}</p>
      </div>

      {/* Main row: competing trials (left) + right rail */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Competing trials table */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          <CompetingTrialsTable trials={data.competingTrials} />
        </div>

        {/* Right rail: label decisions + cliff watch */}
        <div className="w-56 shrink-0 border border-paper-200 rounded-lg p-4 bg-paper-50 overflow-y-auto flex flex-col gap-4">
          <LabelDecisionsRail decisions={data.labelDecisions} />
          <div className="border-t border-paper-200" aria-hidden="true" />
          <CliffWatch items={data.cliffWatch} />
        </div>
      </div>

      {/* Bottom: site overlap heatmap */}
      <div className="shrink-0 border border-paper-200 rounded-lg p-4 bg-paper-50">
        <SiteOverlapHeatmap data={data.siteOverlap} />
      </div>
    </div>
  );
}
