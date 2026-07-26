"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import { backdropUrl, posterUrl } from "@/services/tmdb/images";
import { yearOf, toPersianDigits } from "@/lib/jalali";
import { cn } from "@/lib/utils";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

interface HeroCarouselProps {
  items: TmdbListItem[];
  mediaType?: MediaType;
  /** Autoplay interval in ms. */
  interval?: number;
}

/** Featured-title hero: auto-advancing slideshow with a thumbnail strip. */
export function HeroCarousel({
  items,
  mediaType = "movie",
  interval = 5000,
}: HeroCarouselProps) {
  const slides = React.useMemo(() => items.slice(0, 8), [items]);
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const thumbRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Auto-advance while not paused (hover) and there is more than one slide.
  React.useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(
      () => setActive((a) => (a + 1) % slides.length),
      interval,
    );
    return () => clearInterval(id);
  }, [paused, slides.length, interval]);

  // Center the active thumbnail by scrolling ONLY the strip horizontally.
  // (scrollIntoView would scroll the whole page vertically and yank the user
  //  back to the top when they've scrolled down — so we avoid it.)
  React.useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[active];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const delta =
      thumbRect.left + thumbRect.width / 2 - (stripRect.left + stripRect.width / 2);
    strip.scrollBy({ left: delta, behavior: "smooth" });
  }, [active]);

  const featured = slides[active];
  if (!featured) return null;

  const title = featured.title ?? featured.name ?? "";
  const year = yearOf(featured.release_date ?? featured.first_air_date);
  const rating = featured.vote_average ? featured.vote_average.toFixed(1) : null;
  const href = `/${mediaType === "tv" ? "series" : "movie"}/${featured.id}`;
  const backdrop = backdropUrl(featured.backdrop_path);

  return (
    <section
      className="relative h-[420px] w-full overflow-hidden md:h-[520px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {backdrop && (
        // key → remount per slide so the crossfade replays
        <div key={featured.id} className="hero-fade absolute inset-0 animate-[heroFade_700ms_ease]">
          <Image src={backdrop} alt={title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-6">
        <h1 className="text-3xl font-extrabold text-white drop-shadow md:text-4xl">
          {title}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-white">
          {rating && (
            <span className="flex items-center gap-1 rounded-md bg-imdb px-2 py-1 text-xs font-bold text-black">
              <Star className="h-3 w-3 fill-black" />
              {toPersianDigits(rating)}
            </span>
          )}
          {year && (
            <span className="rounded-md bg-black/60 px-2 py-1 text-xs">
              {toPersianDigits(year)}
            </span>
          )}
          <Link
            href={href}
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:brightness-95"
          >
            <Play className="h-4 w-4 fill-current" />
            مشاهده
          </Link>
        </div>

        {/* thumbnail strip (extra vertical padding so the scaled + ringed
            active thumbnail isn't clipped by the scroll container) */}
        <div ref={stripRef} className="no-scrollbar -mt-2 flex gap-2 overflow-x-auto px-1 py-4">
          {slides.map((item, i) => {
            const thumb = posterUrl(item.poster_path);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setActive(i)}
                aria-label={item.title ?? item.name}
                className={cn(
                  "relative h-20 w-14 shrink-0 overflow-hidden rounded-lg ring-accent transition-all duration-200 ease-out motion-reduce:transition-none",
                  i === active
                    ? "z-10 scale-110 opacity-100 ring-2 shadow-[0_0_14px_rgba(156,232,0,0.55)]"
                    : "opacity-60 ring-0 hover:z-10 hover:scale-110 hover:opacity-100",
                )}
              >
                {thumb && (
                  <Image src={thumb} alt="" fill sizes="56px" className="object-cover" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
