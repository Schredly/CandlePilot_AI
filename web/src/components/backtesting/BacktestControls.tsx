"use client";

import { Play } from "lucide-react";
import { strategies, symbols, timeframes } from "@/lib/mock-backtesting";

export interface BacktestConfig {
  strategy: string;
  symbol: string;
  dateRange: string;
  timeframe: string;
}

interface BacktestControlsProps extends BacktestConfig {
  isRunning: boolean;
  onChange: (patch: Partial<BacktestConfig>) => void;
  onRun: () => void;
}

const selectCls =
  "w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50";

export function BacktestControls({
  strategy,
  symbol,
  dateRange,
  timeframe,
  isRunning,
  onChange,
  onRun,
}: BacktestControlsProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 md:p-6 backdrop-blur-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 items-end">
        <div>
          <label htmlFor="bt-strategy" className="block text-sm text-slate-400 mb-2">
            Strategy
          </label>
          <select
            id="bt-strategy"
            value={strategy}
            onChange={(e) => onChange({ strategy: e.target.value })}
            className={selectCls}
          >
            {strategies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bt-symbol" className="block text-sm text-slate-400 mb-2">
            Symbol
          </label>
          <select
            id="bt-symbol"
            value={symbol}
            onChange={(e) => onChange({ symbol: e.target.value })}
            className={selectCls}
          >
            {symbols.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bt-date" className="block text-sm text-slate-400 mb-2">
            Date Range
          </label>
          <input
            id="bt-date"
            type="text"
            value={dateRange}
            onChange={(e) => onChange({ dateRange: e.target.value })}
            className={selectCls}
          />
        </div>

        <div>
          <label htmlFor="bt-timeframe" className="block text-sm text-slate-400 mb-2">
            Timeframe
          </label>
          <select
            id="bt-timeframe"
            value={timeframe}
            onChange={(e) => onChange({ timeframe: e.target.value })}
            className={selectCls}
          >
            {timeframes.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Running…" : "Run Backtest"}
        </button>
      </div>
    </div>
  );
}
