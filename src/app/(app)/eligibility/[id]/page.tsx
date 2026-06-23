import { notFound } from "next/navigation";
import { getEligibilityData } from "@/lib/data/eligibility";
import { EligibilityClient } from "@/components/eligibility/EligibilityClient";
import { MOCK_USER } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EligibilityPage({ params }: Props) {
  const { id } = await params;

  // Map route id to projectId (in production this would be a real lookup)
  const projectId =
    id === "map-204" || id === "proj_map_204" ? "proj_map_204" : id;

  const data = await getEligibilityData(projectId, MOCK_USER.organizationId);

  if (!data) notFound();

  return (
    <div className="flex flex-col h-full min-h-0 p-4 gap-0">
      <EligibilityClient data={data} />
    </div>
  );
}
