import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
      <div className="max-w-md text-center space-y-6 bg-gradient-to-br from-[#0F0F14] to-[#0A0A0F] border border-white/5 rounded-2xl p-8 md:p-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Compass className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-white/95 text-2xl">Off the chart</h1>
          <p className="text-white/60 text-sm">
            The page you're looking for doesn't exist yet. Let's get you back on the grid.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm hover:brightness-110 transition"
        >
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
