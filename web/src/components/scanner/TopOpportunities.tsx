import Link from "next/link";
import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react";

interface Opportunity {
  symbol: string;
  strategy: string;
  confidence: number;
  change: number;
  trend: "bullish" | "bearish";
  signal: string;
}

const topOpportunities: Opportunity[] = [
  { symbol: "BTCUSDT", strategy: "Breakout", confidence: 94, change: 2.4, trend: "bullish", signal: "Strong buy pressure" },
  { symbol: "ETHUSDT", strategy: "Momentum", confidence: 91, change: 3.2, trend: "bullish", signal: "Volume surge detected" },
  { symbol: "ADAUSDT", strategy: "Breakout", confidence: 82, change: 4.1, trend: "bullish", signal: "Key resistance broken" },
];

export function TopOpportunities() {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <Zap className="size-4 text-yellow-400" />
        <h2 className="text-sm text-white">Top Opportunities</h2>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-thin">
        {topOpportunities.map((opp, index) => (
          <article
            key={opp.symbol}
            className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 p-4 hover:border-blue-500/40 transition-all group"
          >
            {/* Rank badge */}
            <div className="absolute -top-2 -left-2 size-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <span className="text-xs text-black font-medium">{index + 1}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">{opp.symbol}</span>
                    {opp.trend === "bullish" ? (
                      <TrendingUp className="size-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="size-3.5 text-red-400" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{opp.strategy}</span>
                </div>
                <div className={`text-sm ${opp.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {opp.change >= 0 ? "+" : ""}
                  {opp.change}%
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-white">{opp.confidence}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${opp.confidence}%` }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-white/10">
                <Target className="size-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-xs text-gray-300">{opp.signal}</span>
              </div>

              <Link
                href={`/symbol/${opp.symbol}`}
                className="block w-full py-2 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm text-center hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Analyze Signal
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="text-center">
          <div className="text-xs text-gray-400">Active Signals</div>
          <div className="text-lg text-emerald-400">12</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400">Win Rate</div>
          <div className="text-lg text-blue-400">87%</div>
        </div>
      </div>
    </div>
  );
}
