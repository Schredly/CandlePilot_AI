"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  /** Paths that should also highlight this item (dynamic routes, etc). */
  matchPrefixes?: string[];
}

const navItems: NavItem[] = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/scanner", icon: TrendingUp, label: "Scanner", matchPrefixes: ["/symbol"] },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/backtesting", icon: BarChart3, label: "Backtesting" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.matchPrefixes?.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ?? false;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-16 bg-[#0A0A0F] border-r border-white/5 flex-col items-center py-6 gap-8 shrink-0">
      <Link
        href="/"
        aria-label="CandlePilot AI home"
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-105 transition-transform"
      >
        <Sparkles className="w-5 h-5 text-white" />
      </Link>

      <nav className="flex flex-col gap-2" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              title={item.label}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5",
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
