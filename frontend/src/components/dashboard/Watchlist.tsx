import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";

interface WatchlistRow {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const items: WatchlistRow[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "178.45", change: "+2.34%", isPositive: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "142.67", change: "+1.89%", isPositive: true },
  { symbol: "AMZN", name: "Amazon.com", price: "178.23", change: "-0.45%", isPositive: false },
  { symbol: "META", name: "Meta Platforms", price: "485.92", change: "+3.12%", isPositive: true },
  { symbol: "NFLX", name: "Netflix Inc.", price: "612.34", change: "-1.23%", isPositive: false },
  { symbol: "AMD", name: "AMD Inc.", price: "182.45", change: "+4.56%", isPositive: true },
];

export function Watchlist() {
  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3 className="text-white/90">Watchlist</h3>
        <button
          type="button"
          aria-label="Add to watchlist"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <Plus className="w-4 h-4 text-white/60" />
        </button>
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.symbol}>
            <Link
              href={`/symbol/${item.symbol}`}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Star className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                <div className="min-w-0">
                  <div className="text-white/90 text-sm font-medium">{item.symbol}</div>
                  <div className="text-xs text-white/40 truncate">{item.name}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-white/90 text-sm font-medium">${item.price}</div>
                <div
                  className={`text-xs font-medium ${
                    item.isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.change}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
