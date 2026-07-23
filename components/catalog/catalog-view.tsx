"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RangeSlider } from "@/components/ui/range-slider";
import { CardGrid } from "@/components/media/card-grid";
import { Pagination } from "@/components/media/pagination";
import { useDiscover, useSearch } from "@/hooks/useTmdb";
import {
  SORT_OPTIONS,
  COUNTRY_OPTIONS,
  YEAR_RANGE,
  CONTENT_KINDS,
  initialKind,
  genreOptions,
  type CategoryDef,
  type ContentKind,
} from "@/constants/config";

interface CatalogViewProps {
  category: CategoryDef;
}

/** Interactive catalog: search, filters, responsive grid, pagination. */
export function CatalogView({ category }: CatalogViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // ---- state initialised from URL ----------------------------------------
  const [query, setQuery] = React.useState(params.get("q") ?? "");
  const [kind, setKind] = React.useState<ContentKind["value"]>(
    (params.get("kind") as ContentKind["value"]) ?? initialKind(category),
  );
  const [genre, setGenre] = React.useState(params.get("genre") ?? "");
  const [sort, setSort] = React.useState(
    params.get("sort") ?? category.params?.sort_by ?? "popularity.desc",
  );
  const [country, setCountry] = React.useState(params.get("country") ?? "");
  const [years, setYears] = React.useState<[number, number]>([
    Number(params.get("from")) || YEAR_RANGE.min,
    Number(params.get("to")) || YEAR_RANGE.max,
  ]);
  const [persianOnly, setPersianOnly] = React.useState(params.get("fa") === "1");
  const [highRated, setHighRated] = React.useState(params.get("top") === "1");
  const [page, setPage] = React.useState(Number(params.get("page")) || 1);
  const [expanded, setExpanded] = React.useState(false);

  // Resolve the selected kind → media type + its extra discover params.
  const activeKind =
    CONTENT_KINDS.find((k) => k.value === kind) ?? CONTENT_KINDS[0];
  const mediaType = activeKind.mediaType;

  const genres = React.useMemo(() => genreOptions(mediaType), [mediaType]);

  // ---- build TMDB query params -------------------------------------------
  const searching = query.trim().length > 0;

  const discoverParams = React.useMemo(() => {
    // category base first, then kind overrides (e.g. anime forces genre/lang)
    const base: Record<string, string | undefined> = {
      ...category.params,
      ...activeKind.params,
    };
    // TMDB uses different date fields for movies vs series.
    const dateField = mediaType === "tv" ? "first_air_date" : "primary_release_date";
    const dateParams: Record<string, string | undefined> = {};
    if (years[0] > YEAR_RANGE.min) dateParams[`${dateField}.gte`] = `${years[0]}-01-01`;
    if (years[1] < YEAR_RANGE.max) dateParams[`${dateField}.lte`] = `${years[1]}-12-31`;

    return {
      ...base,
      sort_by: sort,
      with_genres: genre || base.with_genres,
      with_origin_country: country || base.with_origin_country,
      with_original_language: persianOnly ? "fa" : base.with_original_language,
      "vote_average.gte": highRated ? "7" : undefined,
      "vote_count.gte": highRated ? "100" : undefined,
      ...dateParams,
      page,
    };
  }, [
    category.params,
    activeKind.params,
    mediaType,
    sort,
    genre,
    country,
    persianOnly,
    highRated,
    years,
    page,
  ]);

  const discoverQuery = useDiscover(mediaType, discoverParams, {
    enabled: !searching,
  });
  const searchQuery = useSearch(query, page);

  const active = searching ? searchQuery : discoverQuery;
  const items = active.data?.results ?? [];
  const totalPages = active.data?.total_pages ?? 0;

  // ---- sync state → URL (shareable) --------------------------------------
  const syncUrl = React.useCallback(() => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    sp.set("kind", kind);
    if (genre) sp.set("genre", genre);
    if (sort) sp.set("sort", sort);
    if (country) sp.set("country", country);
    if (years[0] > YEAR_RANGE.min) sp.set("from", String(years[0]));
    if (years[1] < YEAR_RANGE.max) sp.set("to", String(years[1]));
    if (persianOnly) sp.set("fa", "1");
    if (highRated) sp.set("top", "1");
    if (page > 1) sp.set("page", String(page));
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }, [query, kind, genre, sort, country, years, persianOnly, highRated, page, pathname, router]);

  React.useEffect(() => {
    syncUrl();
  }, [syncUrl]);

  const resetPage = () => setPage(1);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <h1 className="mb-6 text-right text-2xl font-extrabold">{category.title}</h1>

      {/* filter card */}
      <div className="mb-8 rounded-2xl bg-surface p-4">
        <div className="relative mb-4">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="جستجو براساس نام، بازیگر، کارگردان و…"
            className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <button
            type="button"
            onClick={() => resetPage()}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-bold text-accent-foreground hover:brightness-95"
          >
            <Search className="h-4 w-4" />
            جستجو
          </button>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 text-sm text-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            فیلترهای بیشتر
          </button>

          <Select
            options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
            value={sort}
            onChange={(v) => {
              setSort(v);
              resetPage();
            }}
            placeholder="مرتب سازی"
          />
          <Select
            options={genres}
            value={genre}
            onChange={(v) => {
              setGenre(v);
              resetPage();
            }}
            placeholder="انتخاب ژانر"
          />
          <Select
            options={CONTENT_KINDS.map((k) => ({ value: k.value, label: k.label }))}
            value={kind}
            onChange={(v) => {
              setKind(v as ContentKind["value"]);
              setGenre("");
              resetPage();
            }}
            placeholder="نوع"
          />
        </div>

        {expanded && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* year range */}
              <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
                <div className="mb-2 text-xs text-muted">بازهٔ سال ساخت</div>
                <RangeSlider
                  min={YEAR_RANGE.min}
                  max={YEAR_RANGE.max}
                  value={years}
                  onChange={(v) => {
                    setYears(v);
                    resetPage();
                  }}
                />
              </div>
              {/* country */}
              <Select
                options={COUNTRY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
                value={country}
                onChange={(v) => {
                  setCountry(v);
                  resetPage();
                }}
                placeholder="انتخاب کشور"
              />
            </div>

            {/* toggles — real, working TMDB filters */}
            <div className="mt-4 flex flex-wrap gap-3">
              <ToggleChip
                label="فقط فارسی‌زبان"
                checked={persianOnly}
                onChange={(v) => {
                  setPersianOnly(v);
                  resetPage();
                }}
              />
              <ToggleChip
                label="امتیاز بالا (۷+)"
                checked={highRated}
                onChange={(v) => {
                  setHighRated(v);
                  resetPage();
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* results */}
      <CardGrid
        items={items}
        mediaType={searching ? undefined : mediaType}
        loading={active.isLoading}
        emptyLabel={active.isError ? "خطا در دریافت اطلاعات" : "نتیجه‌ای یافت نشد"}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function ToggleChip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
