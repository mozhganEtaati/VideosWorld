"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

/** Custom dark dropdown matching the reference filter selects. */
export function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <span className={cn(!selected && "text-muted")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>
      {open && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-right text-sm hover:bg-surface-2",
                  o.value === value && "bg-surface-2 text-accent",
                )}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
