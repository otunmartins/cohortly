interface Props {
  n: number;
  label: string;
  onClick?: () => void;
}

export function Citation({ n, label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={`Citation ${n}: ${label}`}
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 text-[9px] font-semibold font-mono hover:bg-brand-100 transition-colors align-baseline mx-0.5 whitespace-nowrap"
    >
      [{n}] <span className="font-sans font-medium text-[9px] truncate max-w-[120px]">{label}</span>
    </button>
  );
}
