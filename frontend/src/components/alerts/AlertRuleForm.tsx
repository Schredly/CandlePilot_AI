"use client";

import { useState, type FormEvent } from "react";
import { Plus, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AlertRuleDraft, AlertSignalType } from "@/lib/mock-alerts";

interface AlertRuleFormProps {
  onSubmit: (draft: AlertRuleDraft) => void;
  /** Rendered below the primary action — useful for a modal's Close. */
  secondaryAction?: React.ReactNode;
  /** Internal id prefix for inputs so multiple instances on one page don't collide. */
  idPrefix?: string;
}

const signalChoices: {
  value: AlertSignalType;
  label: string;
  icon: typeof TrendingUp;
  activeCls: string;
  iconCls: string;
}[] = [
  { value: "bullish",  label: "Bullish",  icon: TrendingUp,   activeCls: "bg-emerald-600/20 border-emerald-600 text-emerald-200", iconCls: "text-emerald-400" },
  { value: "bearish",  label: "Bearish",  icon: TrendingDown, activeCls: "bg-rose-600/20 border-rose-600 text-rose-200",          iconCls: "text-rose-400"    },
  { value: "breakout", label: "Breakout", icon: Zap,          activeCls: "bg-blue-600/20 border-blue-600 text-blue-200",          iconCls: "text-blue-400"    },
  { value: "reversal", label: "Reversal", icon: TrendingUp,   activeCls: "bg-purple-600/20 border-purple-600 text-purple-200",    iconCls: "text-purple-400"  },
];

export function AlertRuleForm({ onSubmit, secondaryAction, idPrefix = "alert" }: AlertRuleFormProps) {
  const [symbol, setSymbol] = useState("");
  const [signalType, setSignalType] = useState<AlertSignalType>("bullish");
  const [targetPrice, setTargetPrice] = useState("");
  const [confidence, setConfidence] = useState<number[]>([75]);
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(true);
  const [sms, setSms] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = symbol.trim();
    if (!trimmed) return;

    const channels: string[] = [];
    if (push) channels.push("Push");
    if (email) channels.push("Email");
    if (sms) channels.push("SMS");

    onSubmit({
      symbol: trimmed,
      signalType,
      targetPrice: targetPrice.trim() ? targetPrice.trim() : undefined,
      minConfidence: confidence[0],
      notificationChannels: channels,
    });

    // Reset for the next use of this form instance.
    setSymbol("");
    setTargetPrice("");
    setSignalType("bullish");
    setConfidence([75]);
    setEmail(false);
    setPush(true);
    setSms(false);
  };

  const symbolId = `${idPrefix}-symbol`;
  const priceId = `${idPrefix}-price`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={symbolId} className="text-slate-300 text-xs">
          Symbol
        </Label>
        <Input
          id={symbolId}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., BTC/USDT"
          required
          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300 text-xs">Signal Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {signalChoices.map(({ value, label, icon: Icon, activeCls, iconCls }) => {
            const selected = signalType === value;
            return (
              <Button
                key={value}
                type="button"
                variant="outline"
                onClick={() => setSignalType(value)}
                aria-pressed={selected}
                className={cn(
                  "border-slate-700 justify-start gap-2 transition-colors",
                  selected ? activeCls : "hover:bg-slate-800",
                )}
              >
                <Icon className={cn("size-4", iconCls)} />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={priceId} className="text-slate-300 text-xs">
          Target Price
        </Label>
        <Input
          id={priceId}
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-slate-300 text-xs">Min Confidence</Label>
          <span className="text-slate-400 text-xs tabular-nums">{confidence[0]}%</span>
        </div>
        <Slider
          value={confidence}
          onValueChange={setConfidence}
          max={100}
          step={5}
          className="[&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-500"
        />
      </div>

      <div className="space-y-1 pt-2">
        <div className="flex items-center justify-between py-2">
          <Label htmlFor={`${idPrefix}-email`} className="text-slate-300 text-xs">
            Email Notifications
          </Label>
          <Switch id={`${idPrefix}-email`} checked={email} onCheckedChange={setEmail} />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label htmlFor={`${idPrefix}-push`} className="text-slate-300 text-xs">
            Push Notifications
          </Label>
          <Switch id={`${idPrefix}-push`} checked={push} onCheckedChange={setPush} />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label htmlFor={`${idPrefix}-sms`} className="text-slate-300 text-xs">
            SMS Alerts
          </Label>
          <Switch id={`${idPrefix}-sms`} checked={sms} onCheckedChange={setSms} />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <Plus className="size-4" />
          Create Alert Rule
        </Button>
        {secondaryAction}
      </div>
    </form>
  );
}
