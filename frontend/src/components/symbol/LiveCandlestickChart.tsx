"use client";

import { WifiOff, Loader2, Activity } from "lucide-react";
import { CandlestickChart } from "./CandlestickChart";
import { useLiveCandles, type LiveStatus } from "@/lib/realtime/use-live-candles";
import type { Candle } from "@/lib/types";
import type { PatternMarker, PriceLevel } from "@/lib/mock-symbol";

interface LiveCandlestickChartProps {
  symbol: string;
  timeframe: string;
  /** Prerendered series — rendered instantly while the live feed connects. */
  initial: Candle[];
  patterns?: PatternMarker[];
  levels?: PriceLevel[];
}

const STATUS_STYLES: Record<LiveStatus, { label: string; className: string; Icon: typeof Activity }> = {
  connecting: { label: "Connecting", className: "text-amber-400 bg-amber-500/10", Icon: Loader2 },
  open:         { label: "Live",        className: "text-emerald-400 bg-emerald-500/10", Icon: Activity },
  reconnecting: { label: "Reconnecting",className: "text-amber-400 bg-amber-500/10", Icon: Loader2 },
  closed:       { label: "Offline",     className: "text-zinc-400 bg-zinc-800/70",  Icon: WifiOff },
};

export function LiveCandlestickChart({
  symbol,
  timeframe,
  initial,
  patterns,
  levels,
}: LiveCandlestickChartProps) {
  const { candles, status } = useLiveCandles(symbol, timeframe, { initial });
  const { label, className, Icon } = STATUS_STYLES[status];
  const spin = status === "connecting" || status === "reconnecting";

  return (
    <div className="relative h-full">
      <div
        className={`absolute top-2 right-2 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md text-xs ${className}`}
        role="status"
        aria-live="polite"
      >
        <Icon className={`w-3 h-3 ${spin ? "animate-spin" : ""}`} />
        <span>{label}</span>
      </div>

      <CandlestickChart data={candles} patterns={patterns} levels={levels} />
    </div>
  );
}
