"use client";

import { useState } from "react";
import { Bell, Plus, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AlertSignalType } from "./AlertCard";

const signalChoices: {
  value: AlertSignalType;
  label: string;
  icon: typeof TrendingUp;
  activeCls: string;
  iconCls: string;
}[] = [
  {
    value: "bullish",
    label: "Bullish",
    icon: TrendingUp,
    activeCls: "bg-emerald-600/20 border-emerald-600 text-emerald-200",
    iconCls: "text-emerald-400",
  },
  {
    value: "bearish",
    label: "Bearish",
    icon: TrendingDown,
    activeCls: "bg-rose-600/20 border-rose-600 text-rose-200",
    iconCls: "text-rose-400",
  },
  {
    value: "breakout",
    label: "Breakout",
    icon: Zap,
    activeCls: "bg-blue-600/20 border-blue-600 text-blue-200",
    iconCls: "text-blue-400",
  },
  {
    value: "reversal",
    label: "Reversal",
    icon: TrendingUp,
    activeCls: "bg-purple-600/20 border-purple-600 text-purple-200",
    iconCls: "text-purple-400",
  },
];

export function CreateAlertPanel() {
  const [signalType, setSignalType] = useState<AlertSignalType>("bullish");
  const [confidence, setConfidence] = useState<number[]>([75]);

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6 sticky top-6 gap-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <Bell className="size-5 text-blue-400" />
          </div>
          <h2 className="text-slate-100">Create New Alert</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-slate-300 text-xs">
              Symbol
            </Label>
            <Input
              id="symbol"
              placeholder="e.g., BTC/USDT"
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
            <Label htmlFor="price" className="text-slate-300 text-xs">
              Target Price
            </Label>
            <Input
              id="price"
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
              <Label htmlFor="alert-email" className="text-slate-300 text-xs">
                Email Notifications
              </Label>
              <Switch id="alert-email" />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="alert-push" className="text-slate-300 text-xs">
                Push Notifications
              </Label>
              <Switch id="alert-push" defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="alert-sms" className="text-slate-300 text-xs">
                SMS Alerts
              </Label>
              <Switch id="alert-sms" />
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-4">
            <Plus className="size-4" />
            Create Alert Rule
          </Button>
        </div>
      </div>
    </Card>
  );
}
