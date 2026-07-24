"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import { profileUrl } from "@/services/tmdb/images";
import type { MediaType, TmdbCastMember } from "@/types/tmdb";

/** Horizontal cast list with scroll arrows: circular headshot + name + role. */
export function CastRow({
  cast,
  mediaType,
}: {
  cast: TmdbCastMember[];
  mediaType: MediaType;
}) {
  const people = cast.slice(0, 20);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  if (!people.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({
      left: dir * scrollerRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold">بازیگران</h2>
        </div>
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

      <div ref={scrollerRef} className="no-scrollbar flex gap-5 overflow-x-auto px-1 py-3">
        {people.map((person) => {
          const photo = profileUrl(person.profile_path);
          return (
            <Link
              key={person.id}
              href={`/person/${person.id}?name=${encodeURIComponent(
                person.name,
              )}&kind=${mediaType}`}
              className="group/person w-24 shrink-0 text-center"
            >
              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-2 ring-border transition-transform duration-200 group-hover/person:scale-105 group-hover/person:ring-accent">
                {photo ? (
                  <Image
                    src={photo}
                    alt={person.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-surface-2 text-xl font-bold text-muted">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-semibold text-foreground group-hover/person:text-accent">
                {person.name}
              </p>
              {person.character && (
                <p className="line-clamp-1 text-[11px] text-muted">
                  {person.character}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
