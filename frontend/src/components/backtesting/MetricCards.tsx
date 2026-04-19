import { TrendingUp, TrendingDown, Activity, type LucideIcon } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  subLabel: string;
  tone: "positive" | "neutral" | "negative";
  icon: LucideIcon;
}

const metrics: Metric[] = [
  { label: "Win Rate", value: "68.5%", subLabel: "41 wins / 60 trades", tone: "positive", icon: TrendingUp },
  { label: "Avg Return", value: "+2.34%", subLabel: "Per trade", tone: "neutral", icon: Activity },
  { label: "Max Drawdown", value: "-8.2%", subLabel: "Apr 2024", tone: "negative", icon: TrendingDown },
];

const toneText = {
  positive: "text-emerald-400",
  neutral: "text-cyan-400",
  negative: "text-red-400",
} as const;

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <article
            key={m.label}
            className="bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800 rounded-xl p-5 md:p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{m.label}</span>
              <Icon className={`w-5 h-5 ${toneText[m.tone]}`} />
            </div>
            <div className={`text-2xl md:text-3xl font-semibold ${toneText[m.tone]}`}>{m.value}</div>
            <div className="text-xs text-slate-500 mt-1">{m.subLabel}</div>
          </article>
        );
      })}
    </div>
  );
}
