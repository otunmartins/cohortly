import { IntakeClient } from "@/components/protocol/IntakeClient";
import { WhatYoullGetRail } from "@/components/protocol/WhatYoullGetRail";

export default function ProtocolIntakePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
      {/* Main intake panel — client component (RHF, tabs, mode state) */}
      <div className="flex-1 min-w-0">
        <IntakeClient />
      </div>

      {/* Right rail — static RSC */}
      <div className="hidden lg:block shrink-0">
        <WhatYoullGetRail />
      </div>
    </div>
  );
}
