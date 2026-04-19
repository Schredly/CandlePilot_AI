import type { HeatmapRow } from "@/lib/mock-backtesting";

interface HeatmapChartProps {
  data: HeatmapRow[];
}

/**
 * Bucket-based color scale for hourly returns. Negative = red, positive = emerald
 * at increasing saturation. Kept as utility classes so Tailwind can pick them up
 * statically (no string interpolation into class names).
 */
function heatmapCell(value: number): string {
  if (value < 0) return "bg-red-500/20";
  if (value < 0.5) return "bg-emerald-500/20";
  if (value < 1) return "bg-emerald-500/40";
  if (value < 1.5) return "bg-emerald-500/60";
  return "bg-emerald-500/80";
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  return (
    <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 md:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">
        Performance Heatmap by Hour/Day
      </h3>
      <div className="overflow-x-auto scrollbar-thin">
        <div className="inline-block min-w-full">
          <div className="flex gap-1 mb-2 ml-12">
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="w-8 text-center text-xs text-slate-500">
                {i}
              </div>
            ))}
          </div>
          {data.map((row) => (
            <div key={row.day} className="flex gap-1 mb-1">
              <div className="w-10 text-sm text-slate-400 flex items-center">{row.day}</div>
              {Array.from({ length: 24 }, (_, i) => {
                const hourKey = `h${i}` as const;
                const value = Number(row[hourKey] ?? 0);
                return (
                  <div
                    key={i}
                    title={`${row.day} ${i.toString().padStart(2, "0")}:00 — ${value.toFixed(1)}`}
                    className={`w-8 h-8 rounded ${heatmapCell(value)} border border-slate-800 flex items-center justify-center hover:ring-1 hover:ring-cyan-400 transition-all group relative`}
                  >
                    <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100">
                      {value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
          <div className="flex items-center gap-3 md:gap-4 mt-4 text-xs text-slate-400">
            <span>Less profitable</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-red-500/20 rounded" />
              <div className="w-4 h-4 bg-emerald-500/20 rounded" />
              <div className="w-4 h-4 bg-emerald-500/40 rounded" />
              <div className="w-4 h-4 bg-emerald-500/60 rounded" />
              <div className="w-4 h-4 bg-emerald-500/80 rounded" />
            </div>
            <span>More profitable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
