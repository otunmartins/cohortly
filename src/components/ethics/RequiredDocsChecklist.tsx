import type { RequiredDoc, DocStatus } from "@/types/ethics";
import { CheckCircle2, Clock, FileEdit, AlertCircle } from "lucide-react";

interface Props {
  docs: RequiredDoc[];
}

function statusIcon(status: DocStatus) {
  switch (status) {
    case "submitted":
      return <CheckCircle2 size={10} className="text-green-600 shrink-0" aria-label="Submitted" />;
    case "in-progress":
      return <Clock size={10} className="text-amber-500 shrink-0" aria-label="In progress" />;
    case "draft":
      return <FileEdit size={10} className="text-[oklch(55%_0.01_240)] shrink-0" aria-label="Draft" />;
    case "missing":
      return <AlertCircle size={10} className="text-red-500 shrink-0" aria-label="Missing" />;
  }
}

function statusLabel(status: DocStatus) {
  switch (status) {
    case "submitted":  return "Submitted";
    case "in-progress": return "In progress";
    case "draft":      return "Draft";
    case "missing":    return "Missing";
  }
}

export function RequiredDocsChecklist({ docs }: Props) {
  return (
    <section aria-label="Required documents">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[oklch(50%_0.01_240)] mb-2">
        Required documents
      </p>
      <ul className="space-y-1.5">
        {docs.map((doc) => (
          <li key={doc.id} className="flex items-start gap-1.5">
            <span className="mt-0.5">{statusIcon(doc.status)}</span>
            <div className="min-w-0">
              <p className={[
                "text-[11px] leading-tight truncate",
                doc.status === "missing" ? "text-red-600 font-medium" : "text-[oklch(25%_0.01_240)]",
              ].join(" ")}>
                {doc.label}
              </p>
              {doc.detail && (
                <p className="text-[10px] text-[oklch(55%_0.01_240)] truncate">{doc.detail}</p>
              )}
            </div>
            <span className={[
              "ml-auto text-[9px] font-medium px-1 py-0.5 rounded shrink-0",
              doc.status === "submitted"
                ? "bg-green-50 text-green-700"
                : doc.status === "missing"
                ? "bg-red-50 text-red-700"
                : doc.status === "in-progress"
                ? "bg-amber-50 text-amber-700"
                : "bg-paper-100 text-[oklch(50%_0.01_240)]",
            ].join(" ")}>
              {statusLabel(doc.status)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
