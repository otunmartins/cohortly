import type { LabelDecision, Authority } from "@/types/intel";

const AUTHORITY_STYLE: Record<Authority, { bg: string; text: string }> = {
  FDA:  { bg: "bg-[oklch(96%_0.02_260)]", text: "text-[oklch(38%_0.12_260)]" },
  EMA:  { bg: "bg-[oklch(97%_0.01_185)]", text: "text-[oklch(38%_0.09_185)]" },
  MHRA: { bg: "bg-[oklch(97%_0.02_75)]",  text: "text-[oklch(45%_0.10_75)]"  },
};

interface Props {
  decisions: LabelDecision[];
}

export function LabelDecisionsRail({ decisions }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[11px] font-semibold text-[oklch(30%_0.01_240)]">
        Recent label decisions
      </h3>
      <div className="flex flex-col divide-y divide-paper-100">
        {decisions.map((d) => {
          const style = AUTHORITY_STYLE[d.authority];
          return (
            <div key={d.id} className="py-2 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                  {d.authority}
                </span>
                <span className="font-mono text-[9px] text-[oklch(55%_0.01_240)]">{d.date}</span>
              </div>
              <div className="text-[11px] font-medium text-[oklch(20%_0.01_240)]">{d.drug}</div>
              <div className="text-[10px] text-[oklch(50%_0.01_240)]">{d.decision}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
