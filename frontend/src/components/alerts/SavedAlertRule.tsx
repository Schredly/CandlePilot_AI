import { Edit3, Trash2, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import type { AlertSignalType, SavedRule } from "@/lib/mock-alerts";

interface SavedAlertRuleProps extends SavedRule {
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export type { SavedAlertRuleProps };

function RuleIcon({ type }: { type: AlertSignalType }) {
  switch (type) {
    case "bullish":
      return <TrendingUp className="size-4 text-emerald-400" />;
    case "bearish":
      return <TrendingDown className="size-4 text-rose-400" />;
    case "breakout":
      return <Zap className="size-4 text-blue-400" />;
    case "reversal":
      return <TrendingUp className="size-4 text-purple-400" />;
  }
}

export function SavedAlertRule({
  id,
  symbol,
  signalType,
  targetPrice,
  minConfidence,
  isActive,
  notificationChannels,
  onToggle,
  onDelete,
}: SavedAlertRuleProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-4 gap-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-slate-800/50 p-2 rounded-lg shrink-0">
            <RuleIcon type={signalType} />
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-slate-100">{symbol}</h4>
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs capitalize">
                {signalType}
              </Badge>
              {!isActive && (
                <Badge className="bg-slate-700/50 text-slate-400 border-slate-600 text-xs">
                  Paused
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 md:gap-4 text-xs text-slate-400 flex-wrap">
              {targetPrice && <span>Target: {targetPrice}</span>}
              <span>Min: {minConfidence}%</span>
              <span className="flex items-center gap-1 flex-wrap">
                {notificationChannels.map((channel) => (
                  <Badge
                    key={channel}
                    className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-[10px] px-1 py-0"
                  >
                    {channel}
                  </Badge>
                ))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={isActive}
            onCheckedChange={onToggle ? () => onToggle(id) : undefined}
            aria-label={`${isActive ? "Pause" : "Activate"} ${symbol} rule`}
          />
          <Button
            size="sm"
            variant="outline"
            aria-label="Edit rule"
            className="border-slate-700 hover:bg-slate-800 h-8 px-2"
          >
            <Edit3 className="size-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label="Delete rule"
            onClick={onDelete ? () => onDelete(id) : undefined}
            className="border-slate-700 hover:bg-rose-900/20 hover:border-rose-800 h-8 px-2"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
