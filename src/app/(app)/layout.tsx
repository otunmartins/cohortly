import { Sidebar } from "@/components/shell/Sidebar";
import { ShellClient } from "@/components/shell/ShellClient";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* TopBar + mobile sheet/tabs (all client-side state) */}
        <ShellClient />

        {/* Page content — pb-14 on mobile to clear bottom tab bar */}
        <main className="flex-1 overflow-y-auto pb-14 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
