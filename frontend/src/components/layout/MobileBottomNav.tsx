"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  matchPrefixes?: string[];
}

const navItems: NavItem[] = [
  { href: "/", icon: LayoutDashboard, label: "Home" },
  { href: "/scanner", icon: TrendingUp, label: "Scanner", matchPrefixes: ["/symbol"] },
  { href: "/alerts", icon: Bell, label: "Alerts" },
  { href: "/backtesting", icon: BarChart3, label: "Backtest" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.matchPrefixes?.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ?? false;
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111217]/95 backdrop-blur border-t border-white/5 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary navigation"
    >
      <div className="flex justify-around items-center max-w-md mx-auto px-2 py-2">
        {navItems.map(({ href, icon: Icon, label, matchPrefixes }) => {
          const active = isActive(pathname, { href, icon: Icon, label, matchPrefixes });
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all",
                active
                  ? "bg-gradient-to-br from-amber-500/20 to-yellow-600/10 text-amber-400"
                  : "text-gray-500",
              )}
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
