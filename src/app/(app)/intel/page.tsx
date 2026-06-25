import { notFound } from "next/navigation";
import { getIntelData } from "@/lib/data/intel";
import { IntelClient } from "@/components/intel/IntelClient";
import { MOCK_USER } from "@/lib/mock-data";

export default async function IntelPage() {
  const data = await getIntelData("NASH", MOCK_USER.organizationId);

  if (!data) notFound();

  return (
    <div className="flex flex-col h-full min-h-0 p-4">
      <IntelClient data={data} />
    </div>
  );
}
