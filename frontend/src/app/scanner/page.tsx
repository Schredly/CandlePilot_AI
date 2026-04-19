"use client";

import { useState } from "react";
import { ScannerFilters, type ScannerFilterState } from "@/components/scanner/ScannerFilters";
import { ScannerTable } from "@/components/scanner/ScannerTable";
import { TopOpportunities } from "@/components/scanner/TopOpportunities";

const initialFilters: ScannerFilterState = {
  searchTerm: "",
  timeframe: "all",
  strategy: "all",
  confidence: 0,
  sentiment: "all",
};

export default function ScannerPage() {
  const [filters, setFilters] = useState<ScannerFilterState>(initialFilters);

  const updateFilters = (patch: Partial<ScannerFilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]">
      <div className="border-b border-white/5 bg-[#0d0d12] px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl tracking-tight text-white">Live Scanner</h1>
            <p className="text-sm text-gray-400 mt-0.5">Real-time market opportunities</p>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"
            role="status"
            aria-label="Live feed"
          >
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>
      </div>

      <ScannerFilters {...filters} onChange={updateFilters} />

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden min-h-0">
        <div className="flex-1 min-h-[400px] lg:min-h-0 overflow-hidden">
          <ScannerTable
            searchTerm={filters.searchTerm}
            strategy={filters.strategy}
            confidence={filters.confidence}
            sentiment={filters.sentiment}
          />
        </div>

        <aside className="w-full lg:w-80 shrink-0 lg:max-h-full">
          <TopOpportunities />
        </aside>
      </div>
    </div>
  );
}
