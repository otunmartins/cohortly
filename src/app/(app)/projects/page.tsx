import { Suspense } from "react";
import { getProjects, getOrganization } from "@/lib/data/projects";
import { ProjectsClient } from "@/components/projects/ProjectsClient";

const ORG_ID = "org_maple_001";

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

async function ProjectsContent() {
  const [projects, org] = await Promise.all([
    getProjects(ORG_ID),
    getOrganization(ORG_ID),
  ]);
  return <ProjectsClient projects={projects} org={org} />;
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsSkeleton />}>
      <ProjectsContent />
    </Suspense>
  );
}
