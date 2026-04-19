"use client";

import { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiKeyRowProps {
  label: string;
  description: string;
  value: string;
  badge: string;
  badgeTone: "dev" | "live";
}

export function ApiKeyRow({ label, description, value, badge, badgeTone }: ApiKeyRowProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore clipboard failures (e.g. insecure context).
    }
  };

  const masked = "•".repeat(value.length);

  return (
    <div className="bg-secondary/50 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="min-w-0">
          <div className="text-foreground text-sm font-medium">{label}</div>
          <div className="text-muted-foreground text-xs">{description}</div>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium shrink-0",
            badgeTone === "dev"
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {badge}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm text-foreground break-all">
          {visible ? value : masked}
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide API key" : "Show API key"}
          className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors shrink-0"
        >
          {visible ? (
            <EyeOff className="w-5 h-5 text-foreground" />
          ) : (
            <Eye className="w-5 h-5 text-foreground" />
          )}
        </button>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy API key"
          className="p-2 bg-muted hover:bg-accent rounded-lg transition-colors shrink-0"
        >
          {copied ? (
            <Check className="w-5 h-5 text-primary" />
          ) : (
            <Copy className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
