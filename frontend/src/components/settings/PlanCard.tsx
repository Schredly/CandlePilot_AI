import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  current?: boolean;
  popular?: boolean;
}

export function PlanCard({ name, price, features, current = false, popular = false }: PlanCardProps) {
  return (
    <article
      className={cn(
        "relative bg-secondary border rounded-lg p-6 transition-all",
        current ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-foreground mb-2">{name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-2xl text-foreground font-semibold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground text-sm">/month</span>}
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <span className="text-muted-foreground text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled={current}
        className={cn(
          "w-full py-2 px-4 rounded-lg transition-colors",
          current
            ? "bg-muted text-muted-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:opacity-90",
        )}
      >
        {current ? "Current Plan" : "Upgrade"}
      </button>
    </article>
  );
}
