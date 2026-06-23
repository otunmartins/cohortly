"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export function FreeformTab() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  function handleGenerate() {
    if (prompt.trim().length < 20) return;
    router.push("/protocols/stub-001");
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="freeform-prompt"
          className="block text-[11px] font-semibold text-[oklch(20%_0.01_240)] mb-1.5"
        >
          Describe the trial you want to design
        </label>
        <textarea
          id="freeform-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={8}
          placeholder="e.g. A Phase III randomised double-blind placebo-controlled trial of 320 patients with NASH (F2–F3 fibrosis), evaluating semaglutide 2.4 mg weekly over 72 weeks. Primary endpoint: NASH resolution without worsening of fibrosis at week 52 per FDA 2023 NASH guidance. UK-first (MHRA ILAP), then IND filing."
          className="w-full px-3 py-2.5 rounded-lg border border-paper-200 bg-white text-[12px] text-[oklch(20%_0.01_240)] placeholder-[oklch(60%_0.01_240)] focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 resize-none transition-colors"
        />
        <p className="mt-1 text-[10px] text-[oklch(55%_0.01_240)]">
          Be as specific as possible — phase, indication, endpoint, population, duration, and jurisdiction help generate a more complete draft.
        </p>
      </div>

      <button
        type="button"
        disabled={prompt.trim().length < 20}
        onClick={handleGenerate}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white text-[12px] font-semibold hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Sparkles size={13} aria-hidden="true" />
        Generate draft protocol
      </button>
    </div>
  );
}
