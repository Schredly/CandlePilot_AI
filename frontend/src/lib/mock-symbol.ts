/**
 * Symbol detail mock data: signal card, multi-timeframe alignment,
 * AI explanation, recent alerts, on-chart patterns, and support/resistance
 * levels. The per-symbol candle series lives in mock-candles.ts.
 */

import type { Candle } from "./types";
import { generateMockCandles } from "./mock-candles";

export interface SignalSummary {
  direction: "LONG" | "SHORT" | "NEUTRAL";
  confidence: number;
  entry: number;
  stop: number;
  target: number;
}

export interface TimeframeAlignment {
  timeframe: string;
  trend: "bullish" | "bearish" | "neutral";
  strength: number;
}

export interface RecentAlert {
  time: string;
  message: string;
  type: "signal" | "pattern" | "level";
}

/**
 * A pattern detection anchored to a specific bar by Unix-seconds timestamp.
 * Using a timestamp (not an array index) keeps data stable across feeds and
 * matches what the backend will emit once CP-009 wires the pattern engine.
 */
export interface PatternMarker {
  time: number;
  type: string;
  /** Hex color — TradingView markers render this directly. */
  color: string;
}

export interface PriceLevel {
  value: number;
  kind: "support" | "resistance";
  label: string;
}

export interface SymbolDetailData {
  ticker: string;
  companyName: string;
  candles: Candle[];
  signal: SignalSummary;
  timeframes: TimeframeAlignment[];
  explanation: string;
  alerts: RecentAlert[];
  patterns: PatternMarker[];
  levels: PriceLevel[];
  /** Last close vs. previous close. */
  priceDelta: number;
  pctDelta: number;
}

const KNOWN_COMPANIES: Record<string, string> = {
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

export function companyName(symbol: string): string {
  return KNOWN_COMPANIES[symbol] ?? symbol;
}

/** Build a deterministic detail payload for a ticker. */
export function getMockSymbolDetail(rawTicker: string): SymbolDetailData {
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

  // Anchor markers to specific bars in the generated series.
  const patterns: PatternMarker[] = [
    { time: candles[Math.floor(candles.length * 0.55)].time, type: "Bullish Engulfing", color: "#10b981" },
    { time: candles[Math.floor(candles.length * 0.72)].time, type: "Higher High", color: "#3b82f6" },
  ];

  const levels: PriceLevel[] = [
    { value: signal.target, kind: "resistance", label: "Target" },
    { value: signal.stop, kind: "support", label: "Stop" },
  ];

  return {
    ticker,
    companyName: companyName(ticker),
    candles,
    signal,
    timeframes,
    explanation,
    alerts,
    patterns,
    levels,
    priceDelta,
    pctDelta,
  };
}
