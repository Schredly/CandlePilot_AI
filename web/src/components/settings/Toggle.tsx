"use client";

import { useState } from "react";
import * as Switch from "@radix-ui/react-switch";

interface ToggleProps {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
}

/**
 * Uncontrolled pill switch matching the settings design. Layered over Radix for
 * accessibility while preserving the Figma visual (muted track → primary when on).
 */
export function Toggle({ defaultChecked = false, onCheckedChange, ...rest }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handle = (next: boolean) => {
    setChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={handle}
      aria-label={rest["aria-label"]}
      className="w-11 h-6 bg-muted rounded-full relative transition-colors data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
  );
}
