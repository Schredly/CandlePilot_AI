import Link from "next/link";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { mockSignals, type SignalRow } from "@/lib/mock-dashboard";

interface TopSignalsProps {
  signals?: SignalRow[];
}

export function TopSignals({ signals = mockSignals }: TopSignalsProps) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3 className="text-white/90">Top Signals Today</h3>
        <Zap className="w-4 h-4 text-yellow-400" />
      </div>

      <ul className="space-y-3">
        {signals.map((signal) => (
          <li key={signal.symbol}>
            <Link
              href={`/symbol/${signal.symbol}`}
              className="block bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-white">{signal.symbol}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-white/90 text-sm font-medium truncate">{signal.strategy}</div>
                    <div className="text-xs text-white/40 mt-0.5">{signal.trigger}</div>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 ${
                    signal.direction === "bullish"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {signal.direction === "bullish" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs font-medium capitalize">{signal.direction}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: `${signal.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-white/60 font-medium">{signal.confidence}%</span>
              </div>
            </Link>
          </li>
        ))}

        {signals.length === 0 && (
          <li className="text-sm text-white/40 py-6 text-center">No active signals right now.</li>
        )}
      </ul>
    </SectionCard>
  );
}
