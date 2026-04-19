"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth/provider";

/**
 * Auth-guarded chrome for every signed-in route. Unauthenticated visitors are
 * bounced to /login with the original path preserved in ?next so sign-in can
 * return them there.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [loading, session, pathname, router]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060609]">
        <div className="size-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
