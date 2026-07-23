import { MediaCard } from "./media-card";
import { CardSkeleton } from "./card-skeleton";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

interface CardGridProps {
  items: TmdbListItem[];
  mediaType?: MediaType;
  loading?: boolean;
  emptyLabel?: string;
}

/** Responsive poster grid: 2 → 4 → 5 columns (all divide the 20-per-page
 *  TMDB result count, so every page renders full rows). */
export function CardGrid({
  items,
  mediaType,
  loading,
  emptyLabel = "نتیجه‌ای یافت نشد",
}: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} mediaType={mediaType} />
      ))}
    </div>
  );
}
