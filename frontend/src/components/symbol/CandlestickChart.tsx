"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  createSeriesMarkers,
  CandlestickSeries,
  HistogramSeries,
  ColorType,
  CrosshairMode,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Candle } from "@/lib/types";
import type { PatternMarker, PriceLevel } from "@/lib/mock-symbol";

interface CandlestickChartProps {
  data: Candle[];
  patterns?: PatternMarker[];
  levels?: PriceLevel[];
}

const UP_COLOR = "#10b981";
const DOWN_COLOR = "#ef4444";
const GRID_COLOR = "#27272a";
const TEXT_COLOR = "#71717a";
const BORDER_COLOR = "#3f3f46";

export function CandlestickChart({ data, patterns = [], levels = [] }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // Initialize the chart once when the container mounts.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: TEXT_COLOR,
        fontSize: 11,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: GRID_COLOR, style: LineStyle.Dashed },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: BORDER_COLOR, textColor: TEXT_COLOR },
      timeScale: {
        borderColor: BORDER_COLOR,
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: UP_COLOR,
      downColor: DOWN_COLOR,
      borderVisible: false,
      wickUpColor: UP_COLOR,
      wickDownColor: DOWN_COLOR,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  // Sync candle + volume data whenever props change.
  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!chart || !candleSeries || !volumeSeries) return;

    candleSeries.setData(
      data.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    );

    volumeSeries.setData(
      data.map((c) => ({
        time: c.time as UTCTimestamp,
        value: c.volume,
        color: c.close >= c.open ? `${UP_COLOR}55` : `${DOWN_COLOR}55`,
      })),
    );

    chart.timeScale().fitContent();
  }, [data]);

  // Sync pattern markers.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    if (!candleSeries) return;

    const markersApi = createSeriesMarkers(
      candleSeries,
      patterns.map((p) => ({
        time: p.time as UTCTimestamp,
        position: "aboveBar" as const,
        color: p.color,
        shape: "arrowDown" as const,
        text: p.type,
      })),
    );

    return () => {
      markersApi.detach();
    };
  }, [patterns]);

  // Sync support / resistance price lines.
  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    if (!candleSeries) return;

    const lines = levels.map((level) =>
      candleSeries.createPriceLine({
        price: level.value,
        color: level.kind === "resistance" ? DOWN_COLOR : UP_COLOR,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: level.label,
      }),
    );

    return () => {
      for (const line of lines) {
        candleSeries.removePriceLine(line);
      }
    };
  }, [levels]);

  return (
    <div className="h-full flex flex-col">
      <div ref={containerRef} className="flex-1 min-h-[280px]" />

      {patterns.length > 0 && (
        <div className="flex gap-2 flex-wrap pt-3 border-t border-zinc-800 mt-2">
          {patterns.map((pattern) => (
            <div
              key={`${pattern.type}-${pattern.time}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor: `${pattern.color}33`, color: pattern.color }}
            >
              {pattern.type.toLowerCase().includes("bear") ? (
                <TrendingDown className="w-3 h-3" />
              ) : (
                <TrendingUp className="w-3 h-3" />
              )}
              <span>{pattern.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
