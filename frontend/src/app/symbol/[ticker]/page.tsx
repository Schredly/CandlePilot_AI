import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, MoreVertical } from "lucide-react";
import { CandlestickChart } from "@/components/symbol/CandlestickChart";
import { TradeJournal } from "@/components/symbol/TradeJournal";
import { IntelligencePanel } from "@/components/symbol/IntelligencePanel";
import { getMockSymbolDetail } from "@/lib/mock-symbol";

interface SymbolPageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: SymbolPageProps): Promise<Metadata> {
  const { ticker } = await params;
  return { title: ticker.toUpperCase() };
}

export default async function SymbolPage({ params }: SymbolPageProps) {
  const { ticker: rawTicker } = await params;
  const detail = getMockSymbolDetail(rawTicker);
  const { ticker, companyName, candles, signal, timeframes, explanation, alerts, patterns, levels, priceDelta, pctDelta } = detail;
  const up = priceDelta >= 0;
  const last = candles[candles.length - 1];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 gap-3">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <Link
              href="/scanner"
              aria-label="Back to scanner"
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl text-white">{ticker}</h1>
                <span className="text-sm text-zinc-500 truncate">{companyName}</span>
                <button
                  type="button"
                  aria-label="Add to watchlist"
                  className="p-1 hover:bg-zinc-800 rounded transition-colors"
                >
                  <Star className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
              <div className="flex items-baseline gap-2 md:gap-3 mt-1 flex-wrap">
                <span className={`text-lg md:text-xl tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
                  ${last.close.toFixed(2)}
                </span>
                <span className={`text-sm tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
                  {up ? "+" : ""}
                  {priceDelta.toFixed(2)} ({up ? "+" : ""}
                  {pctDelta.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="More options"
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
          >
            <MoreVertical className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 md:gap-6 p-4 md:p-6 overflow-hidden min-h-0">
        <div className="flex flex-col gap-4 md:gap-6 min-h-0">
          <div className="flex-1 border border-zinc-800 rounded-xl bg-zinc-900/30 p-4 md:p-5 overflow-hidden min-h-[340px]">
            <CandlestickChart data={candles} patterns={patterns} levels={levels} />
          </div>
          <TradeJournal />
        </div>

        <div className="min-h-0 lg:max-h-full">
          <IntelligencePanel
            signal={signal}
            timeframes={timeframes}
            explanation={explanation}
            alerts={alerts}
          />
        </div>
      </div>
    </div>
  );
}
