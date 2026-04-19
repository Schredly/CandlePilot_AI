import type { Metadata } from "next";
import { Bell, Clock, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCard, type AlertCardProps } from "@/components/alerts/AlertCard";
import { CreateAlertPanel } from "@/components/alerts/CreateAlertPanel";
import { SavedAlertRule, type SavedAlertRuleProps } from "@/components/alerts/SavedAlertRule";
import { NotificationPreferences } from "@/components/alerts/NotificationPreferences";

export const metadata: Metadata = { title: "Alerts" };

const newAlerts: AlertCardProps[] = [
  { symbol: "BTC/USDT", signalType: "bullish", time: "2 min ago", confidence: 92, price: "$68,450", change: "+2.4%", isNew: true },
  { symbol: "ETH/USDT", signalType: "breakout", time: "5 min ago", confidence: 87, price: "$3,245", change: "+3.1%", isNew: true },
  { symbol: "SOL/USDT", signalType: "bullish", time: "12 min ago", confidence: 78, price: "$142.50", change: "+1.8%", isNew: true },
];

const triggeredAlerts: AlertCardProps[] = [
  { symbol: "BTC/USDT", signalType: "reversal", time: "1 hour ago", confidence: 85, price: "$67,890", change: "-0.8%" },
  { symbol: "MATIC/USDT", signalType: "bearish", time: "2 hours ago", confidence: 73, price: "$0.82", change: "-1.5%" },
  { symbol: "AVAX/USDT", signalType: "breakout", time: "3 hours ago", confidence: 81, price: "$38.20", change: "+4.2%" },
  { symbol: "DOT/USDT", signalType: "bullish", time: "5 hours ago", confidence: 69, price: "$7.45", change: "+2.1%" },
];

const savedRules: SavedAlertRuleProps[] = [
  { symbol: "BTC/USDT", signalType: "bullish", targetPrice: "$70,000", minConfidence: 80, isActive: true, notificationChannels: ["Push", "Email"] },
  { symbol: "ETH/USDT", signalType: "breakout", targetPrice: "$3,500", minConfidence: 75, isActive: true, notificationChannels: ["Push"] },
  { symbol: "SOL/USDT", signalType: "bearish", minConfidence: 70, isActive: false, notificationChannels: ["Email", "SMS"] },
  { symbol: "MATIC/USDT", signalType: "reversal", targetPrice: "$1.00", minConfidence: 65, isActive: true, notificationChannels: ["Push"] },
];

export default function AlertsPage() {
  return (
    <div className="min-h-full bg-slate-950/40 text-slate-100 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 md:p-3 rounded-xl">
              <Bell className="size-5 md:size-6 text-white" />
            </div>
            <h1 className="text-slate-100">Alerts Center</h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base">
            Manage all your trading alerts and notification preferences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="bg-slate-900/50 border border-slate-800 p-1 w-full grid grid-cols-3">
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Bell className="size-4 mr-2" />
                  <span className="hidden sm:inline">New Alerts</span>
                  <span className="sm:hidden">New</span>
                  <Badge className="ml-2 bg-blue-600 text-white border-0">{newAlerts.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="triggered"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Clock className="size-4 mr-2" />
                  Triggered
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FileText className="size-4 mr-2" />
                  <span className="hidden sm:inline">Saved Rules</span>
                  <span className="sm:hidden">Rules</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new" className="mt-6 space-y-4">
                {newAlerts.map((alert) => (
                  <AlertCard key={`new-${alert.symbol}-${alert.time}`} {...alert} />
                ))}
              </TabsContent>

              <TabsContent value="triggered" className="mt-6 space-y-4">
                {triggeredAlerts.map((alert) => (
                  <AlertCard key={`trig-${alert.symbol}-${alert.time}`} {...alert} />
                ))}
              </TabsContent>

              <TabsContent value="rules" className="mt-6 space-y-4">
                {savedRules.map((rule) => (
                  <SavedAlertRule key={`rule-${rule.symbol}-${rule.signalType}`} {...rule} />
                ))}
              </TabsContent>
            </Tabs>

            <NotificationPreferences />
          </div>

          <aside className="lg:col-span-1">
            <CreateAlertPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
