import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Padding = "sm" | "md" | "lg";

interface SectionCardProps extends HTMLAttributes<HTMLElement> {
  padding?: Padding;
  children: ReactNode;
}

const paddingMap: Record<Padding, string> = {
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-8 md:p-10",
};

/**
 * The premium dark-gradient card that frames every dashboard-style section.
 * Kept intentionally minimal — caller supplies its own heading, layout, and
 * any decorative elements (blur glows, badges) on top of this container.
 */
export function SectionCard({
  padding = "md",
  className,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-br from-[#0F0F14] to-[#0A0A0F] rounded-2xl border border-white/5",
        paddingMap[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}
