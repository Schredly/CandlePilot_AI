"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrokerCardProps {
  name: string;
  logo: string;
  connected?: boolean;
  onToggle?: () => void;
}

export function BrokerCard({ name, logo, connected = false, onToggle }: BrokerCardProps) {
  return (
    <button
      type="button"
      aria-pressed={connected}
      onClick={onToggle}
      className={cn(
        "w-full text-left relative bg-secondary border rounded-lg p-4 transition-all hover:border-primary",
        connected ? "border-primary" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <span aria-hidden="true" className="text-lg">
              {logo}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-foreground text-sm font-medium">{name}</div>
            <div className="text-muted-foreground text-xs">
              {connected ? "Connected" : "Not connected"}
            </div>
          </div>
        </div>
        {connected && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </div>
    </button>
  );
}
