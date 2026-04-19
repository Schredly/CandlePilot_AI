import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileBottomNav } from "./MobileBottomNav";

interface AppShellProps {
  children: ReactNode;
}

/**
 * Application chrome: persistent sidebar (md+), top bar, scrollable main, and a
 * mobile bottom nav at <md. Every page composes its content inside this shell.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="size-full flex bg-[#060609] text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto pb-20 md:pb-0 scrollbar-thin">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
