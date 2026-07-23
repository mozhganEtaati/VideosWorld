"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/jalali";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Windowed page list: first & last always shown, a sliding window around the
 * current page, and ellipses for the gaps (e.g. 1 2 3 4 5 … 500).
 */
function buildPages(current: number, total: number): (number | "...")[] {
  const siblings = 1;
  const slots = siblings * 2 + 5; // first, last, current, 2 siblings, 2 dots
  if (total <= slots) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblings * 2), "...", total];
  }
  if (showLeftDots && !showRightDots) {
    return [1, "...", ...range(total - (2 + siblings * 2), total)];
  }
  return [1, "...", ...range(left, right), "...", total];
}

/** Numbered pagination with prev/next arrows and accent-highlighted page. */
export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const total = Math.min(totalPages, 500); // TMDB serves at most 500 pages
  if (total <= 1) return null;

  const go = (p: number) => {
    onChange(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pages = buildPages(page, total);

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="صفحه‌بندی"
    >
      {/* RTL: › previous (right), ‹ next (left) */}
      <button
        type="button"
        aria-label="صفحه قبل"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => go(p)}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
              p === page
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-foreground hover:bg-surface-2",
            )}
          >
            {toPersianDigits(p)}
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="صفحه بعد"
        disabled={page >= total}
        onClick={() => go(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    </nav>
  );
}
