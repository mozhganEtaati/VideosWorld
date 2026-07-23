"use client";

import * as React from "react";
import { Play, X } from "lucide-react";

interface TrailerButtonProps {
  youtubeKey: string | null;
}

/** Opens the YouTube trailer in a lightweight modal. Hidden when no trailer. */
export function TrailerButton({ youtubeKey }: TrailerButtonProps) {
  const [open, setOpen] = React.useState(false);
  if (!youtubeKey) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-foreground px-6 py-2 text-sm font-bold text-background hover:opacity-90"
      >
        <Play className="h-4 w-4 fill-current" />
        پخش تریلر
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن"
              className="absolute left-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
              title="تریلر"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
