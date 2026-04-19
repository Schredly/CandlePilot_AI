import { Bell, AlertTriangle, Info, CheckCircle, type LucideIcon } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import {
  mockDashboardAlerts,
  type DashboardAlert,
  type DashboardAlertKind,
} from "@/lib/mock-dashboard";

interface AlertsFeedProps {
  alerts?: DashboardAlert[];
}

const iconMap: Record<DashboardAlertKind, LucideIcon> = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap: Record<DashboardAlertKind, string> = {
  success: "text-green-400 bg-green-500/10",
  warning: "text-yellow-400 bg-yellow-500/10",
  info: "text-blue-400 bg-blue-500/10",
};

export function AlertsFeed({ alerts = mockDashboardAlerts }: AlertsFeedProps) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <h3 className="text-white/90">Active Alerts</h3>
        <Bell className="w-4 h-4 text-white/40" />
      </div>

      <ul className="space-y-2">
        {alerts.map((alert, index) => {
          const Icon = iconMap[alert.type];
          return (
            <li
              key={index}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-lg ${colorMap[alert.type]} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white/90 text-sm">{alert.message}</div>
                <div className="text-xs text-white/40 mt-1">{alert.time}</div>
              </div>
            </li>
          );
        })}

        {alerts.length === 0 && (
          <li className="text-sm text-white/40 py-6 text-center">No active alerts.</li>
        )}
      </ul>
    </SectionCard>
  );
}
