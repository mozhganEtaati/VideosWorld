import Link from "next/link";
import Image from "next/image";
import { Calendar, Captions, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import { posterUrl } from "@/services/tmdb/images";
import { yearOf, toPersianDigits } from "@/lib/jalali";
import type { CardItem, MediaType } from "@/types/tmdb";
import type { FavoriteItem } from "@/components/providers/user-provider";

interface MediaCardProps {
  item: CardItem;
  /** Falls back to item.media_type, then "movie". */
  mediaType?: MediaType;
  /** Caption under the title (e.g. episode/season, mock). */
  subtitle?: string;
  /** Badge flags shown in the poster corner. */
  hasSubtitle?: boolean;
  hasDub?: boolean;
}

/** Portrait poster card used in carousels and grids, with a favorite heart. */
export function MediaCard({
  item,
  mediaType,
  subtitle,
  hasSubtitle = true,
  hasDub = false,
}: MediaCardProps) {
  const type: MediaType = mediaType ?? item.media_type ?? "movie";
  const title = item.title ?? item.name ?? "بدون عنوان";
  const year = yearOf(item.release_date ?? item.first_air_date);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const poster = posterUrl(item.poster_path);
  const href = `/${type === "tv" ? "series" : "movie"}/${item.id}`;

  const favItem: FavoriteItem = {
    id: item.id,
    media_type: type,
    title: item.title,
    name: item.name,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_date: item.release_date,
    first_air_date: item.first_air_date,
  };

  return (
    <div className="group block w-full">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-2">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 12vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            بدون تصویر
          </div>
        )}

        {/* corner badges (top-left) */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {hasDub && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Mic className="h-4 w-4" />
            </span>
          )}
          {hasSubtitle && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm">
              <Captions className="h-4 w-4" />
            </span>
          )}
        </div>

        {rating && (
          <div className="absolute bottom-2 left-2 z-10">
            <Badge variant="imdb">IMDb {toPersianDigits(rating)}</Badge>
          </div>
        )}
        {year && (
          <div className="absolute bottom-2 right-2 z-10">
            <Badge variant="year">
              <Calendar className="h-3 w-3" />
              {toPersianDigits(year)}
            </Badge>
          </div>
        )}

        {/* click overlay (kept separate so the heart isn't nested in a link) */}
        <Link href={href} aria-label={title} className="absolute inset-0 z-0" />

        {/* favorite heart */}
        <FavoriteButton item={favItem} className="absolute right-2 top-2 z-20" />
      </div>

      <Link href={href} className="mt-2 block">
        <h3 className="line-clamp-2 text-center text-sm font-semibold text-foreground group-hover:text-accent">
          {title}
        </h3>
      </Link>
      {subtitle && <p className="mt-1 text-center text-xs text-muted">{subtitle}</p>}
    </div>
  );
}
