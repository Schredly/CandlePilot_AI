"use client";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Candle } from "@/lib/types";

interface Pattern {
  index: number;
  type: string;
  color: string;
}

interface SupportResistance {
  value: number;
  type: "support" | "resistance";
  label: string;
}

interface CandlestickChartProps {
  data: Candle[];
  patterns?: Pattern[];
  levels?: SupportResistance[];
}

/**
 * Candle glyph for a single bar. Recharts passes the bar's pixel bounds —
 * because our dataKey returns [low, high] the bar spans from low to high,
 * so (y, y+height) map to (highY, lowY) and we can place the OHLC body inside.
 */
interface CandleShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: Candle;
}

function CandleShape({ x = 0, y = 0, width = 0, height = 0, payload }: CandleShapeProps) {
  if (!payload) return null;
  const { open, close, high, low } = payload;
  const isGreen = close >= open;
  const color = isGreen ? "#10b981" : "#ef4444";
  const range = high - low || 1;
  const bodyTopPrice = Math.max(open, close);
  const bodyBottomPrice = Math.min(open, close);
  const bodyY = y + ((high - bodyTopPrice) / range) * height;
  const bodyHeight = Math.max(1, ((bodyTopPrice - bodyBottomPrice) / range) * height);
  const wickX = x + width / 2;

  return (
    <g>
      <line x1={wickX} y1={y} x2={wickX} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x} y={bodyY} width={width} height={bodyHeight} fill={color} stroke={color} strokeWidth={1} />
    </g>
  );
}

function ChartTooltip({ active, payload }: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) return null;
  const candle = payload[0]?.payload as Candle | undefined;
  if (!candle) return null;
  const isGreen = candle.close >= candle.open;

  return (
    <div className="bg-zinc-900/95 border border-zinc-700 rounded-lg p-3 backdrop-blur-sm">
      <p className="text-xs text-zinc-400 mb-2">{candle.time}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <span className="text-zinc-500">Open:</span>
        <span className="text-zinc-100 tabular-nums">${candle.open.toFixed(2)}</span>
        <span className="text-zinc-500">High:</span>
        <span className="text-zinc-100 tabular-nums">${candle.high.toFixed(2)}</span>
        <span className="text-zinc-500">Low:</span>
        <span className="text-zinc-100 tabular-nums">${candle.low.toFixed(2)}</span>
        <span className="text-zinc-500">Close:</span>
        <span className={`tabular-nums ${isGreen ? "text-emerald-400" : "text-red-400"}`}>
          ${candle.close.toFixed(2)}
        </span>
        <span className="text-zinc-500">Volume:</span>
        <span className="text-zinc-100 tabular-nums">{(candle.volume / 1_000_000).toFixed(2)}M</span>
      </div>
    </div>
  );
}

export function CandlestickChart({ data, patterns = [], levels = [] }: CandlestickChartProps) {
  const priceMin = Math.min(...data.map((d) => d.low)) * 0.995;
  const priceMax = Math.max(...data.map((d) => d.high)) * 1.005;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 pb-4 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#52525b"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={{ stroke: "#3f3f46" }}
              minTickGap={24}
            />
            <YAxis
              yAxisId="price"
              domain={[priceMin, priceMax]}
              stroke="#52525b"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={{ stroke: "#3f3f46" }}
              tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
            />
            <YAxis
              yAxisId="volume"
              orientation="right"
              stroke="#52525b"
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickLine={{ stroke: "#3f3f46" }}
              tickFormatter={(value) => `${(Number(value) / 1_000_000).toFixed(0)}M`}
            />
            <Tooltip content={<ChartTooltip />} />

            {levels.map((level) => (
              <ReferenceLine
                key={`${level.label}-${level.value}`}
                yAxisId="price"
                y={level.value}
                stroke={level.type === "resistance" ? "#ef4444" : "#10b981"}
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  value: level.label,
                  position: "right",
                  fill: level.type === "resistance" ? "#ef4444" : "#10b981",
                  fontSize: 11,
                }}
              />
            ))}

            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="url(#volumeGradient)"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            />

            {/* Candle bars: dataKey returns [low, high] range so the Bar shape spans the full candle. */}
            <Bar
              yAxisId="price"
              dataKey={(d: Candle) => [d.low, d.high]}
              shape={(props: unknown) => <CandleShape {...(props as CandleShapeProps)} />}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {patterns.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-2 border-t border-zinc-800">
          {patterns.map((pattern) => (
            <div
              key={`${pattern.type}-${pattern.index}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: `${pattern.color}33`, color: pattern.color }}
            >
              {pattern.type.toLowerCase().includes("bull") ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{pattern.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
