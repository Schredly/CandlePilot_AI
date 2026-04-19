import type { Metadata } from "next";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingRow } from "@/components/settings/SettingRow";
import { Toggle } from "@/components/settings/Toggle";
import { PlanCard } from "@/components/settings/PlanCard";
import { BrokerGrid } from "@/components/settings/BrokerGrid";
import { ApiKeyRow } from "@/components/settings/ApiKeyRow";
import { ProfileSection } from "@/components/settings/ProfileSection";

export const metadata: Metadata = { title: "Settings" };

const inputCls =
  "w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

export default function SettingsPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-6 md:mb-8">
          <h1 className="text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your CandlePilot AI preferences and integrations
          </p>
        </header>

        <div className="space-y-6 md:space-y-8">
          <SettingsSection title="Profile" description="Manage your account information">
            <ProfileSection />
          </SettingsSection>

          <SettingsSection title="Broker Integrations" description="Connect your trading accounts">
            <BrokerGrid />
          </SettingsSection>

          <SettingsSection title="Notifications" description="Configure how you receive alerts">
            <div className="space-y-1">
              <SettingRow label="Trade Alerts" description="Get notified when trades are executed">
                <Toggle defaultChecked aria-label="Toggle trade alerts" />
              </SettingRow>
              <SettingRow label="Price Alerts" description="Receive alerts for significant price movements">
                <Toggle defaultChecked aria-label="Toggle price alerts" />
              </SettingRow>
              <SettingRow label="Risk Warnings" description="Get notified when risk thresholds are exceeded">
                <Toggle defaultChecked aria-label="Toggle risk warnings" />
              </SettingRow>
              <SettingRow label="Email Notifications" description="Receive daily summaries via email">
                <Toggle aria-label="Toggle email notifications" />
              </SettingRow>
              <SettingRow label="Push Notifications" description="Enable browser push notifications">
                <Toggle defaultChecked aria-label="Toggle push notifications" />
              </SettingRow>
            </div>
          </SettingsSection>

          <SettingsSection title="Theme" description="Customize your interface appearance">
            <div className="space-y-1">
              <SettingRow label="Dark Mode" description="Use dark theme (currently enabled)">
                <Toggle defaultChecked aria-label="Toggle dark mode" />
              </SettingRow>
              <SettingRow label="Compact View" description="Reduce spacing and padding">
                <Toggle aria-label="Toggle compact view" />
              </SettingRow>
              <SettingRow label="Animation Effects" description="Enable smooth transitions and animations">
                <Toggle defaultChecked aria-label="Toggle animations" />
              </SettingRow>
            </div>
          </SettingsSection>

          <SettingsSection
            title="Default Risk Settings"
            description="Set your default risk management parameters"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="risk-pos" className="block text-foreground text-sm mb-2">
                  Maximum Position Size (%)
                </label>
                <input id="risk-pos" type="number" defaultValue={5} className={inputCls} />
                <p className="text-muted-foreground text-xs mt-1">
                  Maximum percentage of portfolio per position
                </p>
              </div>
              <div>
                <label htmlFor="risk-stop" className="block text-foreground text-sm mb-2">
                  Stop Loss (%)
                </label>
                <input id="risk-stop" type="number" defaultValue={2} className={inputCls} />
                <p className="text-muted-foreground text-xs mt-1">Default stop loss percentage</p>
              </div>
              <div>
                <label htmlFor="risk-tp" className="block text-foreground text-sm mb-2">
                  Take Profit (%)
                </label>
                <input id="risk-tp" type="number" defaultValue={10} className={inputCls} />
                <p className="text-muted-foreground text-xs mt-1">Default take profit percentage</p>
              </div>
              <div>
                <label htmlFor="risk-daily" className="block text-foreground text-sm mb-2">
                  Max Daily Loss (%)
                </label>
                <input id="risk-daily" type="number" defaultValue={3} className={inputCls} />
                <p className="text-muted-foreground text-xs mt-1">
                  Maximum allowed daily loss percentage
                </p>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Subscription Plan" description="Manage your subscription and billing">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 pt-3">
              <PlanCard
                name="Starter"
                price="Free"
                features={[
                  "Up to 5 active strategies",
                  "Basic market data",
                  "Email support",
                  "Community access",
                ]}
              />
              <PlanCard
                name="Professional"
                price="$49"
                features={[
                  "Unlimited strategies",
                  "Real-time market data",
                  "Priority support",
                  "Advanced analytics",
                  "Custom indicators",
                ]}
                current
                popular
              />
              <PlanCard
                name="Enterprise"
                price="$199"
                features={[
                  "Everything in Pro",
                  "Multi-account support",
                  "Dedicated support",
                  "Custom integrations",
                  "API access",
                ]}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            title="API Keys"
            description="Manage your API credentials for integrations"
          >
            <div className="space-y-5">
              <ApiKeyRow
                label="Development Key"
                description="For testing and development"
                value="cp_test_a7b9c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                badge="Dev"
                badgeTone="dev"
              />
              <ApiKeyRow
                label="Production Key"
                description="For live trading"
                value="cp_prod_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6"
                badge="Live"
                badgeTone="live"
              />
              <button
                type="button"
                className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors text-sm"
              >
                + Generate New API Key
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
