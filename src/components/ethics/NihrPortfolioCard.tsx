import type { NihrPortfolio } from "@/types/ethics";
import { CheckCircle2, BookMarked } from "lucide-react";

interface Props {
  portfolio: NihrPortfolio;
  onAdopt: () => void;
}

export function NihrPortfolioCard({ portfolio, onAdopt }: Props) {
  return (
    <section
      aria-label="NIHR portfolio eligibility"
      className="rounded-md border border-paper-200 bg-white p-3 space-y-2"
    >
      <div className="flex items-center gap-1.5">
        <BookMarked size={12} className="text-brand-500" aria-hidden="true" />
        <p className="text-[11px] font-semibold text-[oklch(20%_0.01_240)]">NIHR portfolio</p>
        {portfolio.eligible && (
          <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded bg-green-50 text-green-700 flex items-center gap-0.5">
            <CheckCircle2 size={8} aria-hidden="true" />
            Eligible
          </span>
        )}
      </div>

      <dl className="space-y-1">
        <div className="flex items-start gap-2">
          <dt className="text-[10px] text-[oklch(55%_0.01_240)] w-16 shrink-0">Study type</dt>
          <dd className="text-[11px] text-[oklch(25%_0.01_240)] leading-tight">{portfolio.studyType}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="text-[10px] text-[oklch(55%_0.01_240)] w-16 shrink-0">Category</dt>
          <dd className="text-[11px] text-[oklch(25%_0.01_240)]">{portfolio.category}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="text-[10px] text-[oklch(55%_0.01_240)] w-16 shrink-0">Status</dt>
          <dd className="text-[11px] text-[oklch(25%_0.01_240)]">
            {portfolio.adopted ? "Adopted to portfolio" : "Not yet adopted"}
          </dd>
        </div>
      </dl>

      {!portfolio.adopted && portfolio.eligible && (
        <button
          onClick={onAdopt}
          className="w-full mt-1 py-1.5 text-[11px] font-semibold rounded-md border border-brand-500 text-brand-700 hover:bg-brand-50 transition-colors"
        >
          Adopt to portfolio
        </button>
      )}
    </section>
  );
}
