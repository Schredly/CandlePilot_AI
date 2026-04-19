/**
 * Dashboard mock data and widget-prop types.
 *
 * Each widget component accepts an optional data prop and falls back to the
 * export from this module when none is supplied. When CP-008 wires the real
 * market-data feed, the parent page will pass fetched data in and the mocks
 * become unused without any component changes.
 */

export interface MarketTile {
  symbol: string;
  name: string;
  price: string;
  change: string;
  trend: "up" | "down";
}

export interface SignalRow {
  symbol: string;
  strategy: string;
  confidence: number;
  direction: "bullish" | "bearish";
  /** Human-relative time e.g. "2m ago". */
  trigger: string;
}

export interface WatchlistRow {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

export type DashboardAlertKind = "success" | "warning" | "info";

export interface DashboardAlert {
  type: DashboardAlertKind;
  message: string;
  time: string;
}

export type AiSummaryTone = "emerald" | "blue" | "purple" | "amber";

export interface AiSummaryTag {
  label: string;
  tone: AiSummaryTone;
}

/** Narrative is a list of plain strings and ticker refs, rendered inline. */
export type AiSummarySegment = string | { ticker: string };

export interface AiSummary {
  narrative: AiSummarySegment[];
  tags: AiSummaryTag[];
  topOpportunities: string[];
}

export const mockMarkets: MarketTile[] = [
  { symbol: "SPY", name: "S&P 500 ETF", price: "512.45", change: "+1.24%", trend: "up" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF", price: "438.92", change: "+2.15%", trend: "up" },
  { symbol: "BTC", name: "Bitcoin", price: "67,234", change: "-0.82%", trend: "down" },
  { symbol: "VIX", name: "Volatility Index", price: "14.23", change: "-3.45%", trend: "down" },
];

export const mockSignals: SignalRow[] = [
  { symbol: "AAPL", strategy: "Breakout Pattern", confidence: 94, direction: "bullish", trigger: "2m ago" },
  { symbol: "TSLA", strategy: "RSI Divergence", confidence: 87, direction: "bearish", trigger: "5m ago" },
  { symbol: "NVDA", strategy: "Moving Average Cross", confidence: 91, direction: "bullish", trigger: "12m ago" },
  { symbol: "MSFT", strategy: "Volume Surge", confidence: 82, direction: "bullish", trigger: "18m ago" },
];

export const mockWatchlist: WatchlistRow[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "178.45", change: "+2.34%", isPositive: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "142.67", change: "+1.89%", isPositive: true },
  { symbol: "AMZN", name: "Amazon.com", price: "178.23", change: "-0.45%", isPositive: false },
  { symbol: "META", name: "Meta Platforms", price: "485.92", change: "+3.12%", isPositive: true },
  { symbol: "NFLX", name: "Netflix Inc.", price: "612.34", change: "-1.23%", isPositive: false },
  { symbol: "AMD", name: "AMD Inc.", price: "182.45", change: "+4.56%", isPositive: true },
];

export const mockDashboardAlerts: DashboardAlert[] = [
  { type: "success", message: "NVDA hit target price of $890", time: "2m ago" },
  { type: "warning", message: "High volatility detected in crypto markets", time: "15m ago" },
  { type: "info", message: "New signal generated for TSLA", time: "32m ago" },
  { type: "success", message: "SPY breakout confirmed above resistance", time: "1h ago" },
];

export const mockAiSummary: AiSummary = {
  narrative: [
    "Markets showing strong bullish momentum with tech sector leading gains. ",
    { ticker: "SPY" },
    " and ",
    { ticker: "QQQ" },
    " breaking key resistance levels.",
  ],
  tags: [
    { label: "Bullish Trend", tone: "emerald" },
    { label: "High Confidence", tone: "blue" },
    { label: "Volume Increasing", tone: "purple" },
  ],
  topOpportunities: ["NVDA", "AAPL", "MSFT"],
};
