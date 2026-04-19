import type { ReactNode } from "react";

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0 last:pb-0 first:pt-0">
      <div className="flex-1 min-w-0">
        <div className="text-foreground text-sm">{label}</div>
        {description && (
          <div className="text-muted-foreground text-xs mt-0.5">{description}</div>
        )}
      </div>
      <div className="ml-2 shrink-0">{children}</div>
    </div>
  );
}
