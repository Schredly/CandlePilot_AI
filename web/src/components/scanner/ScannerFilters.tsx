"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScannerFilterState {
  searchTerm: string;
  timeframe: string;
  strategy: string;
  confidence: number;
  sentiment: string;
}

interface ScannerFiltersProps extends ScannerFilterState {
  onChange: (next: Partial<ScannerFilterState>) => void;
}

const timeframeOptions = [
  { value: "all", label: "All Timeframes" },
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
];

const strategyOptions = [
  { value: "all", label: "All Strategies" },
  { value: "breakout", label: "Breakout" },
  { value: "reversal", label: "Reversal" },
  { value: "momentum", label: "Momentum" },
  { value: "scalping", label: "Scalping" },
  { value: "swing", label: "Swing Trade" },
];

const sentimentButtons: { value: ScannerFilterState["sentiment"]; label: string; activeCls: string; hoverCls: string }[] = [
  { value: "all", label: "All", activeCls: "bg-white/10 text-white", hoverCls: "hover:text-white" },
  { value: "bullish", label: "Bullish", activeCls: "bg-emerald-500/20 text-emerald-400", hoverCls: "hover:text-emerald-400" },
  { value: "bearish", label: "Bearish", activeCls: "bg-red-500/20 text-red-400", hoverCls: "hover:text-red-400" },
];

export function ScannerFilters({
  searchTerm,
  timeframe,
  strategy,
  confidence,
  sentiment,
  onChange,
}: ScannerFiltersProps) {
  return (
    <div className="border-b border-white/5 bg-[#0d0d12] px-4 md:px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search symbol…"
            value={searchTerm}
            onChange={(e) => onChange({ searchTerm: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          />
        </div>

        <select
          value={timeframe}
          onChange={(e) => onChange({ timeframe: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          aria-label="Timeframe"
        >
          {timeframeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          value={strategy}
          onChange={(e) => onChange({ strategy: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          aria-label="Strategy"
        >
          {strategyOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg">
          <span className="text-xs text-gray-400 whitespace-nowrap">Min Confidence</span>
          <input
            type="range"
            min={0}
            max={100}
            value={confidence}
            onChange={(e) => onChange({ confidence: Number(e.target.value) })}
            aria-label="Minimum confidence"
            className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <span className="text-sm text-white min-w-[3ch] tabular-nums">{confidence}%</span>
        </div>

        <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {sentimentButtons.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => onChange({ sentiment: btn.value })}
              className={cn(
                "px-3 sm:px-4 py-1.5 rounded-md text-xs transition-colors",
                sentiment === btn.value ? btn.activeCls : `text-gray-400 ${btn.hoverCls}`,
              )}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
