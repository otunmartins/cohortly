import type { CumulativeSafety } from "@/types/safety";

interface Props {
  cumulative: CumulativeSafety;
}

export function CumulativeSafetyCard({ cumulative }: Props) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide mb-2">
        Cumulative · {cumulative.projectCode}
      </p>
      <div className="rounded border border-paper-200 bg-white p-2.5">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">SAEs</p>
            <p className="text-[20px] font-display font-semibold text-[oklch(15%_0.01_240)] tabular-nums leading-tight">
              {cumulative.totalSaes}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-[oklch(55%_0.01_240)]">SUSARs</p>
            <p className="text-[20px] font-display font-semibold text-[oklch(42%_0.22_25)] tabular-nums leading-tight">
              {cumulative.totalSusars}
            </p>
          </div>
        </div>
        <div className="border-t border-paper-200 mt-2.5 pt-2 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[9px] text-[oklch(55%_0.01_240)]">DSUR due</span>
            <span className="text-[10px] font-semibold font-mono text-[oklch(20%_0.01_240)]">
              {cumulative.dsurDue}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-[9px] text-[oklch(55%_0.01_240)]">DSMB next</span>
            <span className="text-[10px] font-semibold font-mono text-[oklch(20%_0.01_240)]">
              {cumulative.dsmbNext}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
