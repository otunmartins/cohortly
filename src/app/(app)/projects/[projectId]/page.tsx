import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  return (
    <div className="p-6">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 text-[11px] text-[oklch(50%_0.01_240)] hover:text-brand-700 transition-colors mb-4"
      >
        <ChevronLeft size={12} />
        Back to Projects
      </Link>

      {project ? (
        <div>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-mono text-[11px] text-[oklch(55%_0.01_240)]">
                {project.code}
              </p>
              <h1 className="font-display text-[24px] text-[oklch(18%_0.01_240)] leading-tight mt-0.5">
                {project.title}
              </h1>
              <p className="text-[12px] text-[oklch(45%_0.01_240)] mt-1">
                {project.phase} · {project.indication} · {project.regions.join(" · ")}
              </p>
            </div>
          </div>

          <p className="mt-8 text-[12px] text-[oklch(55%_0.01_240)]">
            Project detail view — coming soon.
          </p>
        </div>
      ) : (
        <p className="text-[12px] text-[oklch(55%_0.01_240)]">
          Project not found.
        </p>
      )}
    </div>
  );
}
