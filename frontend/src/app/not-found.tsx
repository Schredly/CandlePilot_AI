import Link from "next/link";
import { Compass } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#060609]">
      <SectionCard padding="lg" className="max-w-md text-center space-y-6">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Compass className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-white/95 text-2xl">Off the chart</h1>
          <p className="text-white/60 text-sm">
            The page you&apos;re looking for doesn&apos;t exist yet. Let&apos;s get you back on the grid.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:brightness-110 transition"
        >
          Return to dashboard
        </Link>
      </SectionCard>
    </main>
  );
}
