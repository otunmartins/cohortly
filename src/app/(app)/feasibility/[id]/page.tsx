import { notFound } from "next/navigation";
import { getFeasibilityData } from "@/lib/data/feasibility";
import { FeasibilityClient } from "@/components/feasibility/FeasibilityClient";
import { MOCK_USER } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FeasibilityPage({ params }: Props) {
  const { id } = await params;

  const projectId =
    id === "map-204" || id === "proj_map_204" ? "proj_map_204" : id;

  const data = await getFeasibilityData(projectId, MOCK_USER.organizationId);

  if (!data) notFound();

  return (
    <div className="flex flex-col h-full min-h-0 p-4 gap-0">
      <FeasibilityClient data={data} />
    </div>
  );
}
