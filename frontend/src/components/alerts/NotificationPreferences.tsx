import { Mail, Smartphone, MessageSquare, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NotificationPreferences() {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6 gap-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="bg-purple-600/20 p-2 rounded-lg">
            <Bell className="size-5 text-purple-400" />
          </div>
          <h3 className="text-slate-100">Notification Preferences</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-blue-400" />
              <div>
                <Label htmlFor="pref-email" className="text-slate-200">
                  Email Notifications
                </Label>
                <p className="text-xs text-slate-400 mt-1">Receive alerts via email</p>
              </div>
            </div>
            <Switch id="pref-email" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <Smartphone className="size-5 text-emerald-400" />
              <div>
                <Label htmlFor="pref-push" className="text-slate-200">
                  Push Notifications
                </Label>
                <p className="text-xs text-slate-400 mt-1">Mobile and browser push alerts</p>
              </div>
            </div>
            <Switch id="pref-push" defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-800">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-purple-400" />
              <div>
                <Label htmlFor="pref-sms" className="text-slate-200">
                  SMS Alerts
                </Label>
                <p className="text-xs text-slate-400 mt-1">Critical alerts via SMS</p>
              </div>
            </div>
            <Switch id="pref-sms" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <Label htmlFor="pref-email-addr" className="text-slate-300 text-xs">
            Email Address
          </Label>
          <Input
            id="pref-email-addr"
            type="email"
            placeholder="your@email.com"
            defaultValue="trader@candlepilot.ai"
            className="bg-slate-800/50 border-slate-700 text-slate-100"
          />

          <Label htmlFor="pref-phone" className="text-slate-300 text-xs mt-4">
            Phone Number
          </Label>
          <Input
            id="pref-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="bg-slate-800/50 border-slate-700 text-slate-100"
          />

          <Button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 mt-4">
            Save Preferences
          </Button>
        </div>
      </div>
    </Card>
  );
}
