import { TrendingUp, Target, Shield, Clock, Sparkles, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignalSummary, TimeframeAlignment, RecentAlert } from "@/lib/mock-symbol";

export type { SignalSummary, TimeframeAlignment, RecentAlert };

interface IntelligencePanelProps {
  signal: SignalSummary;
  timeframes: TimeframeAlignment[];
  explanation: string;
  alerts: RecentAlert[];
}

const signalColor = (direction: SignalSummary["direction"]) =>
  direction === "LONG"
    ? "text-emerald-400"
    : direction === "SHORT"
      ? "text-red-400"
      : "text-zinc-400";

const signalSurface = (direction: SignalSummary["direction"]) =>
  direction === "LONG"
    ? "bg-emerald-500/10 border-emerald-500/30"
    : direction === "SHORT"
      ? "bg-red-500/10 border-red-500/30"
      : "bg-zinc-500/10 border-zinc-500/30";

const alertDot = (type: RecentAlert["type"]) =>
  type === "signal" ? "bg-violet-400" : type === "pattern" ? "bg-blue-400" : "bg-amber-400";

const tfTrendBar = (trend: TimeframeAlignment["trend"]) =>
  trend === "bullish" ? "bg-emerald-500" : trend === "bearish" ? "bg-red-500" : "bg-zinc-500";

const tfTrendText = (trend: TimeframeAlignment["trend"]) =>
  trend === "bullish" ? "text-emerald-400" : trend === "bearish" ? "text-red-400" : "text-zinc-400";

export function IntelligencePanel({
  signal,
  timeframes,
  explanation,
  alerts,
}: IntelligencePanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin">
      <section className={cn("border rounded-xl p-5", signalSurface(signal.direction))}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm text-zinc-400">Current Signal</h3>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs",
              signalColor(signal.direction),
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{signal.direction}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-zinc-500">Confidence Score</span>
            <span className="text-xl text-white tabular-nums">{signal.confidence}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-zinc-500">Entry</span>
            </div>
            <p className="text-white tabular-nums">${signal.entry.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-zinc-500">Stop</span>
            </div>
            <p className="text-white tabular-nums">${signal.stop.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-zinc-500">Target</span>
            </div>
            <p className="text-white tabular-nums">${signal.target.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm text-white">Multi-Timeframe Alignment</h3>
        </div>
        <div className="space-y-3">
          {timeframes.map((tf) => (
            <div key={tf.timeframe} className="flex items-center justify-between gap-3">
              <span className="text-xs text-zinc-400 w-8 shrink-0">{tf.timeframe}</span>
              <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn("h-full rounded-full", tfTrendBar(tf.trend))}
                  style={{ width: `${tf.strength}%` }}
                />
              </div>
              <span className={cn("text-xs tabular-nums w-10 text-right", tfTrendText(tf.trend))}>
                {tf.strength}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-sm text-white">AI Explanation</h3>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">{explanation}</p>
      </section>

      <section className="border border-zinc-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm text-white">Recent Alerts</h3>
        </div>
        <ul className="space-y-2">
          {alerts.map((alert, idx) => (
            <li
              key={idx}
              className="flex gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50"
            >
              <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", alertDot(alert.type))} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-300">{alert.message}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{alert.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
