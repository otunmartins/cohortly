import type { RegUpdate } from "@/types/dashboard";

const AUTHORITY_STYLES: Record<RegUpdate["authority"], string> = {
  MHRA: "bg-[oklch(95%_0.04_280)] text-[oklch(40%_0.14_280)]",
  FDA:  "bg-[oklch(95%_0.03_220)] text-[oklch(38%_0.12_220)]",
  EMA:  "bg-[oklch(95%_0.04_160)] text-[oklch(40%_0.12_160)]",
  ICH:  "bg-accent-50 text-accent-700",
};

export function RegPulseItem({ update }: { update: RegUpdate }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-paper-100 last:border-0">
      <span
        className={`mt-0.5 shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide ${
          AUTHORITY_STYLES[update.authority]
        }`}
      >
        {update.authority}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[oklch(18%_0.01_240)] leading-snug">{update.body}</p>
        <span className="text-[9px] text-[oklch(60%_0.01_240)]">{update.age}</span>
      </div>
    </div>
  );
}
