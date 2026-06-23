import { getProtocolDocument } from "@/lib/data/protocol";
import { ProtocolEditor } from "@/components/protocol/ProtocolEditor";
import { MOCK_USER } from "@/lib/mock-data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProtocolCopilotPage({ params }: Props) {
  const { id } = await params;
  const doc = await getProtocolDocument(MOCK_USER.organizationId, id);

  return <ProtocolEditor doc={doc} />;
}
