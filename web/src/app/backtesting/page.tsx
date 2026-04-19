"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import {
  BacktestControls,
  type BacktestConfig,
} from "@/components/backtesting/BacktestControls";
import { MetricCards } from "@/components/backtesting/MetricCards";
import { PerformanceChart } from "@/components/backtesting/PerformanceChart";
import { HeatmapChart } from "@/components/backtesting/HeatmapChart";
import { TradeHistoryTable } from "@/components/backtesting/TradeHistoryTable";
import {
  heatmapData,
  performanceData,
  strategies,
  symbols,
  timeframes,
  tradeHistory,
} from "@/lib/mock-backtesting";

const initialConfig: BacktestConfig = {
  strategy: strategies[0],
  symbol: symbols[0],
  dateRange: "2024-01-01 - 2024-12-31",
  timeframe: timeframes[3],
};

export default function BacktestingPage() {
  const [config, setConfig] = useState<BacktestConfig>(initialConfig);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    // Simulated backtest delay — real implementation will stream results from the engine.
    window.setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto space-y-4 md:space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Backtesting Lab
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">
              Test strategies on historical data
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <Activity className="w-4 h-4" />
            <span>CandlePilot AI</span>
          </div>
        </header>

        <BacktestControls
          {...config}
          isRunning={isRunning}
          onChange={(patch) => setConfig((prev) => ({ ...prev, ...patch }))}
          onRun={handleRun}
        />

        <MetricCards />
        <PerformanceChart data={performanceData} />
        <HeatmapChart data={heatmapData} />
        <TradeHistoryTable trades={tradeHistory} />
      </div>
    </div>
  );
}
