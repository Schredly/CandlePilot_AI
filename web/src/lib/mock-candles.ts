import type { Candle } from "./types";

/**
 * Deterministic candle series keyed by symbol so every render (SSR + client)
 * produces the same chart. Will be replaced by a real market-data feed in
 * the market-data sprint.
 */
export function generateMockCandles(symbol: string, count = 60): Candle[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const candles: Candle[] = [];
  let price = 100 + rand() * 200;
  const startDate = new Date("2024-04-15T09:30:00Z");

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setHours(date.getHours() + i);

    const open = price;
    const volatility = 2 + rand() * 3;
    const change = (rand() - 0.48) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + rand() * 1.5;
    const low = Math.min(open, close) - rand() * 1.5;
    const volume = 1_000_000 + rand() * 4_000_000;

    candles.push({
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(volume),
    });

    price = close;
  }

  return candles;
}
