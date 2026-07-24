"use client";

import * as React from "react";
import { Play, X } from "lucide-react";

/**
 * Shared open/closed state so the hero "پخش تریلر" button and the collapsible
 * trailer panel (rendered lower in the page) can talk to each other without
 * prop-drilling through the server-rendered layout in between.
 */
const TrailerRevealContext = React.createContext<{
  open: boolean;
  toggle: () => void;
  close: () => void;
} | null>(null);

function useTrailerReveal() {
  const ctx = React.useContext(TrailerRevealContext);
  if (!ctx) {
    throw new Error("useTrailerReveal must be used within <TrailerRevealProvider>");
  }
  return ctx;
}

export function TrailerRevealProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(
    () => ({
      open,
      toggle: () => setOpen((o) => !o),
      close: () => setOpen(false),
    }),
    [open],
  );
  return (
    <TrailerRevealContext.Provider value={value}>
      {children}
    </TrailerRevealContext.Provider>
  );
}

/** Hero trigger. Reveals the trailer panel in-page; does not play a real video. */
export function TrailerToggleButton({ className }: { className?: string }) {
  const { open, toggle } = useTrailerReveal();
  return (
    <button type="button" onClick={toggle} aria-expanded={open} className={className}>
      <Play className="h-4 w-4 fill-current" />
      پخش تریلر
    </button>
  );
}

/**
 * Collapsible wrapper around the decorative trailer. Hidden until the hero
 * button is pressed. The close affordance lives on the player itself
 * (see {@link TrailerCloseButton}).
 */
export function TrailerPanel({ children }: { children: React.ReactNode }) {
  const { open } = useTrailerReveal();
  if (!open) return null;
  return <div className="scroll-mt-24">{children}</div>;
}

/** Close (X) button pinned inside the player; collapses the panel back to hidden. */
export function TrailerCloseButton() {
  const { close } = useTrailerReveal();
  return (
    <button
      type="button"
      onClick={close}
      aria-label="بستن تریلر"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
