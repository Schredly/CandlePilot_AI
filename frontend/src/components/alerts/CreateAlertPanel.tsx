"use client";

import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AlertRuleForm } from "./AlertRuleForm";
import type { AlertRuleDraft } from "@/lib/mock-alerts";

interface CreateAlertPanelProps {
  onCreate: (draft: AlertRuleDraft) => void;
}

/**
 * Sticky side-panel version of the create-rule form. Renders on lg+ screens
 * where there's horizontal room. On smaller viewports the page falls back to
 * the CreateAlertDialog launched from the header.
 */
export function CreateAlertPanel({ onCreate }: CreateAlertPanelProps) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-6 sticky top-6 gap-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="bg-blue-600/20 p-2 rounded-lg">
            <Bell className="size-5 text-blue-400" />
          </div>
          <h2 className="text-slate-100">Create New Alert</h2>
        </div>

        <AlertRuleForm idPrefix="panel" onSubmit={onCreate} />
      </div>
    </Card>
  );
}
