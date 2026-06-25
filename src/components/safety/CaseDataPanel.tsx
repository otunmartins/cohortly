import type { SafetyCase } from "@/types/safety";

interface Props {
  safetyCase: SafetyCase;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-widest text-[oklch(55%_0.01_240)] mb-1.5">
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[10px] text-[oklch(55%_0.01_240)] shrink-0">{label}</span>
      <span className="text-[11px] text-[oklch(15%_0.01_240)] font-medium text-right">{value}</span>
    </div>
  );
}

export function CaseDataPanel({ safetyCase }: Props) {
  const { demographics, event, concomitantMeds, relevantHistory, clock } = safetyCase;

  const clockColour = safetyCase.clock.overdue
    ? "text-[oklch(42%_0.22_25)]"
    : clock.daysRemaining <= 3
    ? "text-[oklch(55%_0.16_75)]"
    : "text-[oklch(42%_0.12_145)]";

  return (
    <div className="h-full overflow-y-auto p-3 space-y-4 text-[13px]">
      {/* Case header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {safetyCase.expedited && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[oklch(94%_0.10_25)] text-[oklch(35%_0.18_25)] text-[9px] font-semibold uppercase tracking-wide">
              Expedited
            </span>
          )}
          {safetyCase.isSusar && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[oklch(92%_0.12_25)] text-[oklch(32%_0.18_25)] text-[9px] font-semibold uppercase tracking-wide">
              SUSAR
            </span>
          )}
        </div>
        <p className="text-[11px] font-semibold text-[oklch(20%_0.01_240)]">
          {safetyCase.projectCode} · Site {safetyCase.siteCode} · {safetyCase.studyDrug} {safetyCase.studyDose}
        </p>
        <p className="text-[10px] text-[oklch(55%_0.01_240)] font-mono">
          {safetyCase.saeRef} · Subject {safetyCase.subjectRef}
        </p>

        {/* Reporting clock */}
        <div
          className={`flex items-center gap-1.5 mt-1 p-1.5 rounded bg-paper-100 border border-paper-200 ${clockColour}`}
          role="status"
          aria-label={`Reporting clock: ${clock.daysRemaining}d ${clock.hoursRemaining}h remaining`}
        >
          <span className="text-[10px] font-semibold font-mono">
            {clock.overdue ? "OVERDUE" : `${clock.daysRemaining}d ${clock.hoursRemaining}h`}
          </span>
          <span className="text-[9px] text-[oklch(55%_0.01_240)] ml-auto">{clock.clockType} clock</span>
        </div>
      </div>

      <div className="border-t border-paper-200" />

      {/* Demographics */}
      <div>
        <SectionLabel>Demographics</SectionLabel>
        <div className="space-y-1">
          <Row label="Sex" value={demographics.sex} />
          <Row label="Age" value={`${demographics.age} yrs`} />
          <Row label="Ethnicity" value={demographics.ethnicity} />
          <Row label="BMI" value={`${demographics.bmi} kg/m²`} />
          <Row label="NAS score" value={demographics.nasScore} />
          <Row label="Fibrosis" value={demographics.fibrosisStage} />
        </div>
      </div>

      <div className="border-t border-paper-200" />

      {/* Event */}
      <div>
        <SectionLabel>Event</SectionLabel>
        <div className="space-y-1">
          <div>
            <p className="text-[11px] font-semibold text-[oklch(15%_0.01_240)]">{event.pt}</p>
            <p className="text-[9px] font-mono text-[oklch(55%_0.01_240)]">MedDRA PT {event.ptCode}</p>
          </div>
          <Row label="SOC" value={event.soc.split(" ")[0] + "…"} />
          <Row label="Onset" value={event.onsetDate} />
          <Row label="Severity" value={event.severity.charAt(0).toUpperCase() + event.severity.slice(1)} />
          <Row label="Outcome" value={event.outcome.charAt(0).toUpperCase() + event.outcome.slice(1)} />
          <Row label="Causality" value={event.causality.charAt(0).toUpperCase() + event.causality.slice(1)} />
        </div>
      </div>

      <div className="border-t border-paper-200" />

      {/* Concomitant meds */}
      <div>
        <SectionLabel>Concomitant Meds</SectionLabel>
        <ul className="space-y-1">
          {concomitantMeds.map((med) => (
            <li key={med.name} className="text-[10px] text-[oklch(25%_0.01_240)]">
              <span className="font-medium">{med.name}</span>
              {" "}
              <span className="text-[oklch(55%_0.01_240)]">{med.dose}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-paper-200" />

      {/* Relevant history */}
      <div>
        <SectionLabel>Relevant History</SectionLabel>
        <ul className="space-y-1">
          {relevantHistory.map((h) => (
            <li key={h.condition} className="text-[10px] text-[oklch(25%_0.01_240)]">
              {h.condition}
              {h.year > 0 && (
                <span className="text-[oklch(55%_0.01_240)] font-mono ml-1">({h.year})</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
