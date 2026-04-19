import Link from "next/link";
import { Sparkles, Brain } from "lucide-react";

const topOpportunities = ["NVDA", "AAPL", "MSFT"] as const;

export function AISummary() {
  return (
    <section className="bg-gradient-to-br from-blue-950/20 via-[#0F0F14] to-purple-950/20 rounded-2xl border border-blue-500/20 p-5 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-white/90">AI Market Summary</h3>
          <Sparkles className="w-4 h-4 text-blue-400 ml-auto" />
        </div>

        <div className="space-y-4">
          <p className="text-white/70 text-sm leading-relaxed">
            Markets showing strong bullish momentum with tech sector leading gains.
            <span className="text-blue-400 font-medium"> SPY</span> and
            <span className="text-blue-400 font-medium"> QQQ</span> breaking key resistance levels.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">
              Bullish Trend
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium">
              High Confidence
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium">
              Volume Increasing
            </span>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="text-xs text-white/40 mb-2">Top Opportunities</div>
            <div className="flex gap-2">
              {topOpportunities.map((symbol) => (
                <Link
                  key={symbol}
                  href={`/symbol/${symbol}`}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-center hover:bg-white/10 transition-colors"
                >
                  <div className="text-white/90 text-sm font-medium">{symbol}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
