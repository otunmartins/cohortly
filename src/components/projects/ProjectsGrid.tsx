import type { MockProject } from "@/lib/mock-data";
import { ProjectCard } from "./ProjectCard";

interface Props {
  projects: MockProject[];
}

export function ProjectsGrid({ projects }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-[13px] font-medium text-[oklch(35%_0.01_240)]">
          No studies match these filters
        </p>
        <p className="text-[11px] text-[oklch(55%_0.01_240)] mt-1">
          Try adjusting your search or removing a filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
