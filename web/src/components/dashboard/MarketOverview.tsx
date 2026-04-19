"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketTile {
  symbol: string;
  name: string;
  price: string;
  change: string;
  trend: "up" | "down";
}

const markets: MarketTile[] = [
  { symbol: "SPY", name: "S&P 500 ETF", price: "512.45", change: "+1.24%", trend: "up" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", price: "438.92", change: "+2.15%", trend: "up" },
  { symbol: "BTC", name: "Bitcoin", price: "67,234", change: "-0.82%", trend: "down" },
  { symbol: "VIX", name: "Volatility Index", price: "14.23", change: "-3.45%", trend: "down" },
];

/**
 * Deterministic pseudo-random so SSR and client render the same sparkline.
 * Real implementation will hydrate from market data feed; this keeps hydration clean.
 */
function seededSparkline(trend: "up" | "down", seed: number): { value: number }[] {
  const base = 100;
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: 24 }, (_, i) => ({
    value: base + (trend === "up" ? i * 2 + rand() * 3 : -i * 2 - rand() * 3),
  }));
}

export function MarketOverview() {
  return (
    <section className="bg-gradient-to-br from-[#0F0F14] to-[#0A0A0F] rounded-2xl border border-white/5 p-5 md:p-6">
      <h3 className="text-white/90 mb-4 md:mb-5">Market Overview</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {markets.map((market, idx) => (
          <article
            key={market.symbol}
            className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-white/90 font-medium">{market.symbol}</div>
                <div className="text-xs text-white/40 mt-0.5">{market.name}</div>
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${
                  market.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {market.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {market.change}
              </div>
            </div>

            <div className="text-2xl text-white mb-3">${market.price}</div>

            <ResponsiveContainer width="100%" height={40}>
              <AreaChart data={seededSparkline(market.trend, idx + 7)}>
                <defs>
                  <linearGradient id={`gradient-${market.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={market.trend === "up" ? "#10b981" : "#ef4444"}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={market.trend === "up" ? "#10b981" : "#ef4444"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={market.trend === "up" ? "#10b981" : "#ef4444"}
                  fill={`url(#gradient-${market.symbol})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </article>
        ))}
      </div>
    </section>
  );
}
