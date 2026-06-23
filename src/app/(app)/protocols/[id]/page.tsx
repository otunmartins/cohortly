import { FlaskConical, Clock } from "lucide-react";

export default function ProtocolCopilotPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
        <FlaskConical size={20} className="text-brand-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[13px] font-semibold text-[oklch(15%_0.01_240)]">
          Draft generating…
        </p>
        <p className="text-[11px] text-[oklch(50%_0.01_240)] mt-1 max-w-xs">
          Cohortly is retrieving relevant guidance and drafting your SPIRIT-compliant protocol.
          You&apos;ll be notified in your Inbox when it&apos;s ready.
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] text-[oklch(55%_0.01_240)]">
        <Clock size={11} aria-hidden="true" />
        Typically ready in 2–5 minutes
      </div>
      <p className="text-[9px] font-mono text-[oklch(60%_0.01_240)] bg-paper-200 px-2 py-1 rounded">
        Protocol Copilot — coming in the next build
      </p>
    </div>
  );
}
