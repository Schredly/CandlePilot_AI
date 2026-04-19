import type { Trade } from "@/lib/mock-backtesting";

interface TradeHistoryTableProps {
  trades: Trade[];
}

export function TradeHistoryTable({ trades }: TradeHistoryTableProps) {
  return (
    <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 md:p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold mb-4 text-slate-200">Trade History</h3>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Symbol</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Side</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Entry</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Exit</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Return %</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">PnL</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => {
              const positive = trade.return >= 0;
              const pnlPositive = trade.pnl >= 0;
              return (
                <tr
                  key={trade.id}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-slate-300">{trade.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-300">{trade.symbol}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        trade.side === "LONG"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-300 text-right tabular-nums">
                    ${trade.entry.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-300 text-right tabular-nums">
                    ${trade.exit.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm text-right tabular-nums ${
                      positive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {trade.return.toFixed(2)}%
                  </td>
                  <td
                    className={`py-3 px-4 text-sm text-right tabular-nums ${
                      pnlPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pnlPositive ? "+" : ""}${trade.pnl}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
