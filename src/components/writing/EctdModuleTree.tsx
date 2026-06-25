import { CheckCircle2, Circle, Clock, FileEdit } from "lucide-react";
import type { CtdModule, CtdModuleStatus } from "@/types/writing";

interface Props {
  modules: CtdModule[];
  activeModuleId: string;
  onSelect: (id: string) => void;
}

function statusIcon(status: CtdModuleStatus) {
  switch (status) {
    case "complete":
      return <CheckCircle2 size={11} className="text-[oklch(55%_0.12_145)] shrink-0" aria-hidden="true" />;
    case "review":
      return <Clock size={11} className="text-[oklch(65%_0.13_75)] shrink-0" aria-hidden="true" />;
    case "draft":
      return <FileEdit size={11} className="text-[oklch(55%_0.10_185)] shrink-0" aria-hidden="true" />;
    default:
      return <Circle size={11} className="text-[oklch(70%_0.01_240)] shrink-0" aria-hidden="true" />;
  }
}

function ModuleRow({
  module,
  depth,
  activeModuleId,
  onSelect,
}: {
  module: CtdModule;
  depth: number;
  activeModuleId: string;
  onSelect: (id: string) => void;
}) {
  const isActive = module.id === activeModuleId;
  const hasChildren = (module.children?.length ?? 0) > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => onSelect(module.id)}
        aria-current={isActive ? "true" : undefined}
        className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
          isActive
            ? "bg-brand-50 text-brand-700"
            : "text-[oklch(30%_0.01_240)] hover:bg-paper-200"
        }`}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {statusIcon(module.status)}
        <span className="text-[11px] font-mono mr-1 shrink-0 text-[oklch(55%_0.01_240)]">
          {module.number}
        </span>
        <span className={`text-[11px] leading-tight truncate ${isActive ? "font-semibold" : ""}`}>
          {module.heading}
        </span>
      </button>
      {hasChildren &&
        module.children!.map((child) => (
          <ModuleRow
            key={child.id}
            module={child}
            depth={depth + 1}
            activeModuleId={activeModuleId}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}

export function EctdModuleTree({ modules, activeModuleId, onSelect }: Props) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[oklch(45%_0.01_240)] uppercase tracking-wide px-2 mb-1.5">
        eCTD Modules
      </p>
      <nav aria-label="eCTD module tree" className="space-y-0.5">
        {modules.map((m) => (
          <ModuleRow
            key={m.id}
            module={m}
            depth={0}
            activeModuleId={activeModuleId}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </div>
  );
}
