import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { TopSignals } from "@/components/dashboard/TopSignals";
import { AISummary } from "@/components/dashboard/AISummary";
import { Watchlist } from "@/components/dashboard/Watchlist";
import { AlertsFeed } from "@/components/dashboard/AlertsFeed";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-6">
          <h1 className="text-white/95 mb-1">CandlePilot AI</h1>
          <p className="text-white/50 text-sm">Your intelligent trading copilot</p>
        </header>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
            <MarketOverview />
            <TopSignals />
            <AISummary />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4 md:space-y-6">
            <Watchlist />
            <AlertsFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
