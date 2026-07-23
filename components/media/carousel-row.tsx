"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "./media-card";
import { CardSkeleton } from "./card-skeleton";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

interface CarouselRowProps {
  title: string;
  items: TmdbListItem[];
  mediaType?: MediaType;
  viewAllHref?: string;
  loading?: boolean;
}

/** Titled horizontal scroller with "view all" link and arrow controls. */
export function CarouselRow({
  title,
  items,
  mediaType,
  viewAllHref,
  loading,
}: CarouselRowProps) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * scrollerRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
            >
              مشاهده همه
            </Link>
          )}
          <div className="hidden items-center gap-1 sm:flex">
            {/* RTL: › (right) goes back toward the start, ‹ (left) reveals more */}
            <button
              type="button"
              aria-label="قبلی"
              onClick={() => scrollBy(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-2"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="بعدی"
              onClick={() => scrollBy(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-36 shrink-0 sm:w-40 md:w-44">
                <CardSkeleton />
              </div>
            ))
          : items.map((item) => (
              <div key={item.id} className="w-36 shrink-0 sm:w-40 md:w-44">
                <MediaCard item={item} mediaType={mediaType} />
              </div>
            ))}
      </div>
    </section>
  );
}
