export interface PerformancePoint {
  date: string;
  balance: number;
  drawdown: number;
}

export interface HeatmapRow {
  day: string;
  /** Hourly returns keyed h0–h23. */
  [hour: `h${number}`]: number | string;
}

export interface Trade {
  id: number;
  date: string;
  symbol: string;
  side: "LONG" | "SHORT";
  entry: number;
  exit: number;
  /** Percent return on the trade. */
  return: number;
  /** Dollar P&L. */
  pnl: number;
}

export const performanceData: PerformancePoint[] = [
  { date: "2024-01", balance: 10000, drawdown: 0 },
  { date: "2024-02", balance: 10500, drawdown: -2.1 },
  { date: "2024-03", balance: 11200, drawdown: -1.5 },
  { date: "2024-04", balance: 10800, drawdown: -3.6 },
  { date: "2024-05", balance: 12100, drawdown: -0.8 },
  { date: "2024-06", balance: 12800, drawdown: -1.2 },
  { date: "2024-07", balance: 13500, drawdown: -0.5 },
  { date: "2024-08", balance: 14200, drawdown: -2.3 },
  { date: "2024-09", balance: 15100, drawdown: -0.9 },
  { date: "2024-10", balance: 15800, drawdown: -1.1 },
  { date: "2024-11", balance: 16500, drawdown: -0.7 },
  { date: "2024-12", balance: 17200, drawdown: -0.4 },
];

export const heatmapData: HeatmapRow[] = [
  { day: "Mon", h0: 0.2, h1: -0.1, h2: 0.3, h3: 0.5, h4: 0.8, h5: 1.2, h6: 1.5, h7: 0.9, h8: 0.6, h9: 0.4, h10: 0.7, h11: 0.3, h12: 0.5, h13: 0.9, h14: 1.1, h15: 0.8, h16: 0.6, h17: 0.4, h18: 0.2, h19: 0.1, h20: -0.2, h21: 0.0, h22: 0.1, h23: 0.3 },
  { day: "Tue", h0: 0.1, h1: 0.0, h2: 0.2, h3: 0.4, h4: 0.6, h5: 0.9, h6: 1.3, h7: 1.6, h8: 1.2, h9: 0.8, h10: 0.5, h11: 0.7, h12: 0.9, h13: 1.0, h14: 0.8, h15: 0.6, h16: 0.4, h17: 0.3, h18: 0.1, h19: 0.0, h20: -0.1, h21: 0.1, h22: 0.2, h23: 0.1 },
  { day: "Wed", h0: 0.3, h1: 0.1, h2: 0.4, h3: 0.7, h4: 1.0, h5: 1.4, h6: 1.8, h7: 1.5, h8: 1.0, h9: 0.7, h10: 0.9, h11: 1.1, h12: 1.3, h13: 1.5, h14: 1.2, h15: 0.9, h16: 0.7, h17: 0.5, h18: 0.3, h19: 0.2, h20: 0.1, h21: 0.0, h22: 0.1, h23: 0.2 },
  { day: "Thu", h0: 0.2, h1: 0.1, h2: 0.3, h3: 0.6, h4: 0.9, h5: 1.1, h6: 1.4, h7: 1.7, h8: 1.3, h9: 0.9, h10: 0.8, h11: 1.0, h12: 1.2, h13: 1.4, h14: 1.1, h15: 0.8, h16: 0.6, h17: 0.4, h18: 0.2, h19: 0.1, h20: 0.0, h21: 0.1, h22: 0.2, h23: 0.3 },
  { day: "Fri", h0: 0.4, h1: 0.2, h2: 0.5, h3: 0.8, h4: 1.1, h5: 1.3, h6: 1.6, h7: 1.4, h8: 1.1, h9: 0.8, h10: 1.0, h11: 1.2, h12: 1.4, h13: 1.6, h14: 1.3, h15: 1.0, h16: 0.8, h17: 0.6, h18: 0.4, h19: 0.3, h20: 0.2, h21: 0.1, h22: 0.0, h23: 0.1 },
];

export const tradeHistory: Trade[] = [
  { id: 1, date: "2024-12-15 14:30", symbol: "BTC/USDT", side: "LONG", entry: 43250, exit: 43890, return: 1.48, pnl: 640 },
  { id: 2, date: "2024-12-14 09:15", symbol: "ETH/USDT", side: "SHORT", entry: 2240, exit: 2198, return: 1.87, pnl: 420 },
  { id: 3, date: "2024-12-13 16:45", symbol: "BTC/USDT", side: "LONG", entry: 42800, exit: 42450, return: -0.82, pnl: -350 },
  { id: 4, date: "2024-12-12 11:20", symbol: "SOL/USDT", side: "LONG", entry: 98.5, exit: 102.3, return: 3.86, pnl: 380 },
  { id: 5, date: "2024-12-11 08:00", symbol: "BTC/USDT", side: "SHORT", entry: 44100, exit: 43750, return: 0.79, pnl: 350 },
  { id: 6, date: "2024-12-10 13:30", symbol: "ETH/USDT", side: "LONG", entry: 2180, exit: 2245, return: 2.98, pnl: 650 },
];

export const strategies = [
  "RSI Momentum",
  "MACD Crossover",
  "Bollinger Breakout",
  "EMA Golden Cross",
  "Volume Spike",
] as const;

export const symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"] as const;

export const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D"] as const;
