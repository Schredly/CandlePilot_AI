/**
 * Scanner mock data and row/opportunity types.
 *
 * Timeframes are lowercase to match the filter select values. When CP-008
 * wires the real feed, this file's exports go away — components already
 * accept the data as props.
 */

export type ScannerTrend = "bullish" | "bearish";

export type ScannerTimeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface ScannerRow {
  symbol: string;
  lastPrice: number;
  /** Percent change vs previous close. */
  change: number;
  strategy: string;
  confidence: number;
  /** Percent above average volume for the rolling window. */
  volumeSpike: number;
  trend: ScannerTrend;
  timeframe: ScannerTimeframe;
}

export interface ScannerOpportunity {
  symbol: string;
  strategy: string;
  confidence: number;
  change: number;
  trend: ScannerTrend;
  /** One-line human-readable signal description. */
  signal: string;
}

export const mockScannerRows: ScannerRow[] = [
  { symbol: "BTCUSDT",   lastPrice: 67845.32, change:  2.4, strategy: "Breakout",    confidence: 94, volumeSpike: 245, trend: "bullish", timeframe: "15m" },
  { symbol: "ETHUSDT",   lastPrice:  3421.67, change:  3.2, strategy: "Momentum",    confidence: 91, volumeSpike: 189, trend: "bullish", timeframe: "5m"  },
  { symbol: "SOLUSDT",   lastPrice:   142.34, change: -1.8, strategy: "Reversal",    confidence: 87, volumeSpike: 156, trend: "bearish", timeframe: "1h"  },
  { symbol: "BNBUSDT",   lastPrice:   589.21, change:  1.5, strategy: "Swing Trade", confidence: 85, volumeSpike: 134, trend: "bullish", timeframe: "4h"  },
  { symbol: "ADAUSDT",   lastPrice:     0.5634, change:  4.1, strategy: "Breakout",    confidence: 82, volumeSpike: 298, trend: "bullish", timeframe: "15m" },
  { symbol: "DOTUSDT",   lastPrice:     7.89, change: -0.9, strategy: "Scalping",    confidence: 79, volumeSpike: 112, trend: "bearish", timeframe: "1m"  },
  { symbol: "MATICUSDT", lastPrice:     0.8745, change:  2.8, strategy: "Momentum",    confidence: 76, volumeSpike: 167, trend: "bullish", timeframe: "5m"  },
  { symbol: "AVAXUSDT",  lastPrice:    38.92, change: -2.1, strategy: "Reversal",    confidence: 74, volumeSpike: 145, trend: "bearish", timeframe: "1h"  },
  { symbol: "LINKUSDT",  lastPrice:    15.67, change:  1.2, strategy: "Swing Trade", confidence: 71, volumeSpike:  98, trend: "bullish", timeframe: "4h"  },
  { symbol: "ATOMUSDT",  lastPrice:     9.23, change:  3.6, strategy: "Breakout",    confidence: 69, volumeSpike: 203, trend: "bullish", timeframe: "15m" },
  { symbol: "NEARUSDT",  lastPrice:     5.43, change: -1.4, strategy: "Scalping",    confidence: 67, volumeSpike:  87, trend: "bearish", timeframe: "1m"  },
  { symbol: "UNIUSDT",   lastPrice:     8.92, change:  2.1, strategy: "Momentum",    confidence: 64, volumeSpike: 156, trend: "bullish", timeframe: "1d"  },
];

export const mockScannerOpportunities: ScannerOpportunity[] = [
  { symbol: "BTCUSDT", strategy: "Breakout", confidence: 94, change: 2.4, trend: "bullish", signal: "Strong buy pressure" },
  { symbol: "ETHUSDT", strategy: "Momentum", confidence: 91, change: 3.2, trend: "bullish", signal: "Volume surge detected" },
  { symbol: "ADAUSDT", strategy: "Breakout", confidence: 82, change: 4.1, trend: "bullish", signal: "Key resistance broken" },
];

export interface ScannerFooterStats {
  activeSignals: number;
  winRate: number;
}

export const mockScannerFooter: ScannerFooterStats = {
  activeSignals: 12,
  winRate: 87,
};
