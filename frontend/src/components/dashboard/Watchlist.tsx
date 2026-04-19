import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { mockWatchlist, type WatchlistRow } from "@/lib/mock-dashboard";

interface WatchlistProps {
  items?: WatchlistRow[];
}

export function Watchlist({ items = mockWatchlist }: WatchlistProps) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-baseline gap-2">
          <h3 className="text-white/90">Watchlist</h3>
          <span className="text-xs text-white/40 tabular-nums">{items.length}</span>
        </div>
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

        {items.length === 0 && (
          <li className="text-sm text-white/40 py-6 text-center">Your watchlist is empty.</li>
        )}
      </ul>
    </SectionCard>
  );
}
