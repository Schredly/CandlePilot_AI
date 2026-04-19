"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity, ChevronRight } from "lucide-react";
import type { ScannerFilterState } from "./ScannerFilters";
import { mockScannerRows, type ScannerRow } from "@/lib/mock-scanner";

const GRID = "grid-cols-[1.1fr_1fr_1.2fr_1fr_1fr_0.8fr_0.8fr]";

interface ScannerTableProps {
  filters: Pick<
    ScannerFilterState,
    "searchTerm" | "timeframe" | "strategy" | "confidence" | "sentiment"
  >;
  rows?: ScannerRow[];
}

/** Strategy select values (e.g. "swing") prefix-match row labels ("Swing Trade"). */
function matchesStrategyFilter(rowStrategy: string, selected: string): boolean {
  if (selected === "all") return true;
  return rowStrategy.toLowerCase().startsWith(selected.toLowerCase());
}

function applyFilters(
  rows: ScannerRow[],
  filters: ScannerTableProps["filters"],
): ScannerRow[] {
  const query = filters.searchTerm.trim().toLowerCase();
  return rows.filter((row) => {
    if (query && !row.symbol.toLowerCase().includes(query)) return false;
    if (filters.timeframe !== "all" && row.timeframe !== filters.timeframe) return false;
    if (!matchesStrategyFilter(row.strategy, filters.strategy)) return false;
    if (row.confidence < filters.confidence) return false;
    if (filters.sentiment !== "all" && row.trend !== filters.sentiment) return false;
    return true;
  });
}

function ConfidenceBar({ value }: { value: number }) {
  const fill =
    value >= 80 ? "bg-emerald-500" : value >= 70 ? "bg-yellow-500" : "bg-orange-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-full max-w-[60px] h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${fill}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm text-white tabular-nums">{value}%</span>
    </div>
  );
}

function VolumeBars({ spike }: { spike: number }) {
  const filled = Math.min(5, Math.floor(spike / 60));
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 items-end">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`w-1 rounded-full ${i < filled ? "bg-blue-500" : "bg-white/10"}`}
            style={{ height: `${12 + i * 3}px` }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-400 tabular-nums">+{spike}%</span>
    </div>
  );
}

function TrendBadge({ trend }: { trend: ScannerRow["trend"] }) {
  return trend === "bullish" ? (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 w-fit">
      <TrendingUp className="size-3.5 text-emerald-400" />
      <span className="text-xs text-emerald-400">Bull</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 w-fit">
      <TrendingDown className="size-3.5 text-red-400" />
      <span className="text-xs text-red-400">Bear</span>
    </div>
  );
}

function MobileRow({ row }: { row: ScannerRow }) {
  return (
    <Link
      href={`/symbol/${row.symbol}`}
      className="block px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="size-3.5 text-blue-400 shrink-0" />
          <span className="text-white font-medium">{row.symbol}</span>
          <TrendBadge trend={row.trend} />
        </div>
        <ChevronRight className="size-4 text-white/40 shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Price</div>
          <div className="text-white tabular-nums">${row.lastPrice.toLocaleString()}</div>
          <div className={`text-xs ${row.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {row.change >= 0 ? "+" : ""}
            {row.change}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Strategy</div>
          <div className="text-gray-300 text-sm">{row.strategy}</div>
          <div className="text-xs text-gray-500 mt-0.5 uppercase">{row.timeframe}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Confidence</div>
          <ConfidenceBar value={row.confidence} />
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Volume</div>
          <VolumeBars spike={row.volumeSpike} />
        </div>
      </div>
    </Link>
  );
}

export function ScannerTable({ filters, rows = mockScannerRows }: ScannerTableProps) {
  const filteredData = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  return (
    <div className="h-full flex flex-col bg-[#0d0d12] rounded-lg border border-white/5 overflow-hidden">
      {/* Desktop header */}
      <div className={`hidden md:grid ${GRID} gap-4 px-4 py-3 border-b border-white/5 bg-white/5`}>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Symbol</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Last Price</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Strategy</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Confidence</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Volume Spike</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Trend</div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">Action</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Mobile: card-style rows */}
        <div className="md:hidden">
          {filteredData.map((row) => (
            <MobileRow key={row.symbol} row={row} />
          ))}
        </div>

        {/* Desktop: grid rows */}
        <div className="hidden md:block">
          {filteredData.map((row) => (
            <div
              key={row.symbol}
              className={`grid ${GRID} gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors group`}
            >
              <div className="flex items-center gap-2">
                <span className="text-white">{row.symbol}</span>
                <Activity className="size-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex flex-col">
                <span className="text-white tabular-nums">${row.lastPrice.toLocaleString()}</span>
                <span className={`text-xs ${row.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {row.change >= 0 ? "+" : ""}
                  {row.change}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">{row.strategy}</span>
                <span className="text-[10px] uppercase text-gray-500 tracking-wider tabular-nums">
                  {row.timeframe}
                </span>
              </div>

              <div className="flex items-center">
                <ConfidenceBar value={row.confidence} />
              </div>

              <div className="flex items-center">
                <VolumeBars spike={row.volumeSpike} />
              </div>

              <div className="flex items-center">
                <TrendBadge trend={row.trend} />
              </div>

              <div className="flex items-center">
                <Link
                  href={`/symbol/${row.symbol}`}
                  className="px-3 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                >
                  View
                  <ChevronRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            No opportunities match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
