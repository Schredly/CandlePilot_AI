/**
 * Shared domain types for CandlePilot AI.
 * These mirror entities defined in ai-context/04_DATA_MODEL.md.
 */

export type Direction = "LONG" | "SHORT";
export type Sentiment = "bullish" | "bearish" | "neutral";
export type Timeframe = "1m" | "5m" | "15m" | "1H" | "4H" | "1D" | "1W";

export type PatternName =
  | "Hammer"
  | "Doji"
  | "Engulfing"
  | "Morning Star"
  | "Shooting Star"
  | "Breakout";

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Signal {
  id: string;
  symbol: string;
  direction: Direction;
  confidence: number;
  pattern: PatternName | string;
  timeframe: Timeframe;
  entry: number;
  stop: number;
  target: number;
  timestamp: string;
  change?: number;
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  confidence?: number;
  sparkline?: number[];
}

export interface Alert {
  id: string;
  symbol: string;
  signalType: "bullish" | "bearish" | "breakout" | "reversal";
  time: string;
  confidence: number;
  price: string;
  change: string;
  isNew?: boolean;
}

export interface StrategyOutput {
  name: string;
  setupScore: number;
  entry: number;
  stop: number;
  target: number;
  riskReward: number;
  notes: string;
}
