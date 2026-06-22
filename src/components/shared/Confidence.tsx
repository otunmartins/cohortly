interface Props {
  value: number;
  showLabel?: boolean;
}

export function Confidence({ value, showLabel = true }: Props) {
  const color =
    value >= 85
      ? "bg-success"
      : value >= 60
      ? "bg-warn"
      : "bg-danger";

  const textColor =
    value >= 85
      ? "text-[oklch(42%_0.14_145)]"
      : value >= 60
      ? "text-[oklch(52%_0.13_75)]"
      : "text-[oklch(48%_0.18_25)]";

  return (
    <div className="flex items-center gap-1.5 min-w-[52px]" aria-label={`Confidence ${value}%`}>
      <div className="flex-1 h-1 rounded-full bg-paper-200 overflow-hidden w-10">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-[10px] font-mono font-semibold tabular-nums ${textColor}`}>
          {value}%
        </span>
      )}
    </div>
  );
}
