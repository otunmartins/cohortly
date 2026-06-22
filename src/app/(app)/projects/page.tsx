import { Suspense } from "react";
import { MOCK_PROJECTS, MOCK_ORG } from "@/lib/mock-data";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

function ProjectsSkeleton() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-lg bg-paper-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsClient projects={MOCK_PROJECTS} org={MOCK_ORG} />
    </Suspense>
  );
}
