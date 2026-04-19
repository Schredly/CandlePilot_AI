"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Sparkles, Settings as SettingsIcon, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, useInitials } from "@/lib/auth/provider";

/**
 * Returns a short "HH:MM:SS EST" clock string using America/New_York timezone.
 * Markets trade on ET so this is the meaningful reference for traders.
 */
function useEtClock(): string {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()).replace(/^24/, "00"));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

/**
 * Returns true during standard US equity session (9:30am–4:00pm ET, Mon–Fri).
 * Doesn't account for market holidays — purely a visual hint.
 */
function useMarketOpen(): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        hour12: false,
      });
      const parts = fmt.formatToParts(new Date());
      const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const isWeekday = !["Sat", "Sun"].includes(weekday);
      const minutes = hour * 60 + minute;
      setOpen(isWeekday && minutes >= 9 * 60 + 30 && minutes < 16 * 60);
    };
    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return open;
}

export function TopBar() {
  const time = useEtClock();
  const isOpen = useMarketOpen();
  const { session, signOut } = useAuth();
  const initials = useInitials();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <header className="h-14 md:h-16 bg-[#0A0A0F] border-b border-white/5 px-4 md:px-6 flex items-center justify-between gap-3">
      {/* Mobile-only logo */}
      <Link
        href="/"
        aria-label="CandlePilot AI home"
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0"
      >
        <Sparkles className="w-4 h-4 text-white" />
      </Link>

      {/* Market status — hidden on smallest screens to preserve search space */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <div
          className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-white/30"}`}
          aria-label={isOpen ? "Markets open" : "Markets closed"}
        />
        <span className="text-sm text-white/60">{isOpen ? "Markets Open" : "Markets Closed"}</span>
        <span className="text-sm text-white/40">•</span>
        <span className="text-sm text-white tabular-nums" suppressHydrationWarning>
          {time || "--:--:--"} EST
        </span>
      </div>

      <div className="flex-1 max-w-md mx-2 md:mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search symbols, strategies…"
            aria-label="Search"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <Link
          href="/alerts"
          aria-label="Alerts"
          className="relative w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Bell className="w-4 h-4 text-white/60" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:brightness-110 transition text-white text-xs font-medium"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56 bg-[#0F0F14] border-white/10">
            {session && (
              <>
                <DropdownMenuLabel className="py-2">
                  <div className="text-sm text-white/90 truncate">{session.user.name}</div>
                  <div className="text-xs text-white/40 truncate">{session.user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
              </>
            )}
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
