import Link from "next/link";
import { Bell, TrendingUp, TrendingDown, ArrowRight, Trash2, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AlertEvent, AlertSignalType } from "@/lib/mock-alerts";

export type { AlertSignalType };

interface AlertCardProps extends AlertEvent {
  /** When set, the trash button fires this with the alert id. */
  onDismiss?: (id: string) => void;
}

function signalColor(type: AlertSignalType): string {
  switch (type) {
    case "bullish":
    case "breakout":
      return "text-emerald-400";
    case "bearish":
    case "reversal":
      return "text-rose-400";
  }
}

function SignalIcon({ type }: { type: AlertSignalType }) {
  switch (type) {
    case "bullish":
    case "breakout":
      return <TrendingUp className="size-4" />;
    case "bearish":
    case "reversal":
      return <TrendingDown className="size-4" />;
    default:
      return <Bell className="size-4" />;
  }
}

function confidenceChip(confidence: number): string {
  if (confidence >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (confidence >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-slate-500/20 text-slate-400 border-slate-500/30";
}

/** Turn "BTC/USDT" into a route slug like "BTCUSDT". */
function toSymbolSlug(symbol: string): string {
  return symbol.replace("/", "");
}

export function AlertCard({
  id,
  symbol,
  signalType,
  time,
  confidence,
  price,
  change,
  isNew,
  onDismiss,
}: AlertCardProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-200 p-4 gap-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-3">
            <div className={`${signalColor(signalType)} bg-slate-800/50 p-2 rounded-lg shrink-0`}>
              <SignalIcon type={signalType} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-slate-100">{symbol}</h3>
                {isNew && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    NEW
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 capitalize">{signalType} Signal</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs flex-wrap">
            <div>
              <span className="text-slate-500">Time:</span>
              <span className="text-slate-300 ml-1">{time}</span>
            </div>
            {price && (
              <div>
                <span className="text-slate-500">Price:</span>
                <span className="text-slate-300 ml-1">{price}</span>
              </div>
            )}
            {change && (
              <span className={change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}>
                {change}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Confidence:</span>
            <Badge className={`${confidenceChip(confidence)} text-xs border`}>
              {confidence}%
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Button
            asChild
            size="sm"
            aria-label="Open symbol"
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
          >
            <Link href={`/symbol/${toSymbolSlug(symbol)}`}>
              <ArrowRight className="size-3" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label="Edit"
            className="border-slate-700 hover:bg-slate-800 h-8 px-3"
          >
            <Edit3 className="size-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            aria-label="Dismiss"
            onClick={onDismiss ? () => onDismiss(id) : undefined}
            className="border-slate-700 hover:bg-rose-900/20 hover:border-rose-800 h-8 px-3"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
