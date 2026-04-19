"use client";

import { Bell, Clock, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCard } from "@/components/alerts/AlertCard";
import { CreateAlertPanel } from "@/components/alerts/CreateAlertPanel";
import { CreateAlertDialog } from "@/components/alerts/CreateAlertDialog";
import { SavedAlertRule } from "@/components/alerts/SavedAlertRule";
import { NotificationPreferences } from "@/components/alerts/NotificationPreferences";
import { useAlertsStore } from "@/hooks/use-alerts-store";

const emptyCopy =
  "bg-slate-900/30 border border-slate-800 rounded-lg text-center text-sm text-slate-500 py-10";

export default function AlertsPage() {
  const {
    newAlerts,
    triggeredAlerts,
    rules,
    createRule,
    toggleRule,
    deleteRule,
    dismissNewAlert,
    deleteTriggeredAlert,
  } = useAlertsStore();

  return (
    <div className="min-h-full bg-slate-950/40 text-slate-100 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 md:p-3 rounded-xl">
                <Bell className="size-5 md:size-6 text-white" />
              </div>
              <h1 className="text-slate-100">Alerts Center</h1>
            </div>
            <p className="text-slate-400 text-sm md:text-base">
              Manage all your trading alerts and notification preferences
            </p>
          </div>
          <CreateAlertDialog onCreate={createRule} />
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
                  {newAlerts.length > 0 && (
                    <Badge className="ml-2 bg-blue-600 text-white border-0">{newAlerts.length}</Badge>
                  )}
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
                  <AlertCard key={alert.id} {...alert} onDismiss={dismissNewAlert} />
                ))}
                {newAlerts.length === 0 && (
                  <div className={emptyCopy}>
                    No new alerts. We&apos;ll notify you when your rules trigger.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="triggered" className="mt-6 space-y-4">
                {triggeredAlerts.map((alert) => (
                  <AlertCard key={alert.id} {...alert} onDismiss={deleteTriggeredAlert} />
                ))}
                {triggeredAlerts.length === 0 && (
                  <div className={emptyCopy}>Nothing triggered recently.</div>
                )}
              </TabsContent>

              <TabsContent value="rules" className="mt-6 space-y-4">
                {rules.map((rule) => (
                  <SavedAlertRule
                    key={rule.id}
                    {...rule}
                    onToggle={toggleRule}
                    onDelete={deleteRule}
                  />
                ))}
                {rules.length === 0 && (
                  <div className={emptyCopy}>
                    No saved rules yet. Use <span className="text-blue-400">+ Create Alert</span> above to add one.
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <NotificationPreferences />
          </div>

          <aside className="lg:col-span-1">
            <CreateAlertPanel onCreate={createRule} />
          </aside>
        </div>
      </div>
    </div>
  );
}
