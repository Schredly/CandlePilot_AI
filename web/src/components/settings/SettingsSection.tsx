import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
      </div>
      <div className="bg-card border border-border rounded-lg p-5 md:p-6">{children}</div>
    </section>
  );
}
