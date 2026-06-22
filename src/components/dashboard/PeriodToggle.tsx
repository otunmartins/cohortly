"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Period } from "@/types/dashboard";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "today",   label: "Today" },
  { value: "week",    label: "Week" },
  { value: "quarter", label: "Quarter" },
];

export function PeriodToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("period") ?? "week") as Period;

  function select(value: Period) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center bg-paper-100 border border-paper-200 rounded-md p-0.5"
      role="group"
      aria-label="Dashboard period"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => select(value)}
          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
            current === value
              ? "bg-paper-50 text-[oklch(20%_0.01_240)] shadow-sm"
              : "text-[oklch(50%_0.01_240)] hover:text-[oklch(30%_0.01_240)]"
          }`}
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
