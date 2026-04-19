import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Star, MoreVertical } from "lucide-react";
import { CandlestickChart } from "@/components/symbol/CandlestickChart";
import { TradeJournal } from "@/components/symbol/TradeJournal";
import {
  IntelligencePanel,
  type RecentAlert,
  type SignalSummary,
  type TimeframeAlignment,
} from "@/components/symbol/IntelligencePanel";
import { generateMockCandles } from "@/lib/mock-candles";

interface SymbolPageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateMetadata({ params }: SymbolPageProps): Promise<Metadata> {
  const { ticker } = await params;
  return { title: ticker.toUpperCase() };
}

/** Placeholder until a real company-name directory is wired in. */
function companyName(symbol: string): string {
  const known: Record<string, string> = {
    AAPL: "Apple Inc.",
    TSLA: "Tesla, Inc.",
    NVDA: "NVIDIA Corp.",
    MSFT: "Microsoft Corp.",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com, Inc.",
    META: "Meta Platforms",
    NFLX: "Netflix, Inc.",
    AMD: "AMD, Inc.",
    SPY: "S&P 500 ETF",
    QQQ: "Nasdaq 100 ETF",
  };
  return known[symbol] ?? symbol;
}

export default async function SymbolPage({ params }: SymbolPageProps) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();
  const candles = generateMockCandles(ticker);
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2] ?? last;
  const priceDelta = last.close - prev.close;
  const pctDelta = (priceDelta / prev.close) * 100;
  const up = priceDelta >= 0;

  const signal: SignalSummary = {
    direction: up ? "LONG" : "SHORT",
    confidence: 87,
    entry: Number((last.close + 0.1).toFixed(2)),
    stop: Number((last.close * 0.985).toFixed(2)),
    target: Number((last.close * 1.035).toFixed(2)),
  };

  const timeframes: TimeframeAlignment[] = [
    { timeframe: "1H", trend: "bullish", strength: 85 },
    { timeframe: "4H", trend: "bullish", strength: 78 },
    { timeframe: "1D", trend: "neutral", strength: 55 },
    { timeframe: "1W", trend: "bullish", strength: 72 },
  ];

  const explanation =
    "Strong bullish momentum detected across multiple timeframes. Price broke above key resistance with increasing volume. RSI showing strength but not overbought. MACD crossover confirms uptrend. Risk/reward ratio favors long position with tight stop below recent support.";

  const alerts: RecentAlert[] = [
    { time: "2 min ago", message: "Bullish engulfing pattern confirmed on 1H chart", type: "pattern" },
    { time: "15 min ago", message: `Price broke above resistance at $${signal.entry}`, type: "level" },
    { time: "1 hour ago", message: `${signal.direction} signal generated (${signal.confidence}% confidence)`, type: "signal" },
    { time: "2 hours ago", message: "Volume spike detected (+145%)", type: "pattern" },
  ];

  const patterns = [
    { index: 45, type: "Bullish Engulfing", color: "#10b981" },
    { index: 32, type: "Higher High", color: "#3b82f6" },
  ];

  const levels = [
    { value: signal.target, type: "resistance" as const, label: "Target" },
    { value: signal.stop, type: "support" as const, label: "Stop" },
  ];

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
                <span className="text-sm text-zinc-500 truncate">{companyName(ticker)}</span>
                <button
                  type="button"
                  aria-label="Add to watchlist"
                  className="p-1 hover:bg-zinc-800 rounded transition-colors"
                >
                  <Star className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
              <div className="flex items-baseline gap-2 md:gap-3 mt-1 flex-wrap">
                <span className={`text-lg md:text-xl ${up ? "text-emerald-400" : "text-red-400"}`}>
                  ${last.close.toFixed(2)}
                </span>
                <span className={`text-sm ${up ? "text-emerald-400" : "text-red-400"}`}>
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
          <div className="flex-1 border border-zinc-800 rounded-xl bg-zinc-900/30 p-4 md:p-5 overflow-hidden min-h-[320px]">
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
