import type { Candle } from "./types";

/**
 * Deterministic candle series keyed by symbol so SSR and the client render the
 * same chart. Replaced by the real market-data feed in CP-008.
 *
 * Timestamps are contiguous hourly bars ending "now" (snapped to the hour), so
 * the chart always shows recent-looking data in the time axis.
 */
export function generateMockCandles(symbol: string, count = 120): Candle[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed = (seed * 31 + symbol.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const HOUR = 60 * 60;
  const nowSec = Math.floor(Date.now() / 1000);
  const endBar = nowSec - (nowSec % HOUR);
  const startBar = endBar - (count - 1) * HOUR;

  const candles: Candle[] = [];
  let price = 100 + rand() * 200;

  for (let i = 0; i < count; i++) {
    const open = price;
    const volatility = 2 + rand() * 3;
    const change = (rand() - 0.48) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + rand() * 1.5;
    const low = Math.min(open, close) - rand() * 1.5;
    const volume = 1_000_000 + rand() * 4_000_000;

    candles.push({
      time: startBar + i * HOUR,
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
