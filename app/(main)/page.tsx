import { CarouselRow } from "@/components/media/carousel-row";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HOME_CATEGORIES } from "@/constants/config";
import { getCategoryItems } from "@/services/tmdb/catalog";
import type { TmdbListItem } from "@/types/tmdb";

export const revalidate = 60;

export default async function HomePage() {
  // Fetch every category row in parallel; tolerate individual failures.
  const results = await Promise.allSettled(
    HOME_CATEGORIES.map((cat) => getCategoryItems(cat)),
  );

  const rows = HOME_CATEGORIES.map((cat, i) => {
    const r = results[i];
    const items: TmdbListItem[] =
      r.status === "fulfilled" ? r.value.results : [];
    return { cat, items };
  });

  const heroItems = rows[0]?.items.slice(0, 8) ?? [];

  return (
    <div>
      <HeroCarousel items={heroItems} mediaType={HOME_CATEGORIES[0].mediaType} />

      <div className="mx-auto max-w-[1400px] px-4">
        {rows.map(({ cat, items }) => (
          <CarouselRow
            key={cat.slug}
            title={cat.title}
            items={items}
            mediaType={cat.mediaType}
            viewAllHref={`/category/${cat.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
