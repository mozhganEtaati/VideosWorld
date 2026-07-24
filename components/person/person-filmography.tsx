"use client";

import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RangeSlider } from "@/components/ui/range-slider";
import { CardGrid } from "@/components/media/card-grid";
import { Pagination } from "@/components/media/pagination";
import { usePersonCredits } from "@/hooks/useTmdb";
import { SORT_OPTIONS, YEAR_RANGE, genreOptions } from "@/constants/config";
import { yearOf } from "@/lib/jalali";
import type { MediaType, TmdbListItem } from "@/types/tmdb";

const PAGE_SIZE = 20;

/** Movie / series kind picker (person pages have no "anime" sub-kind). */
const KIND_OPTIONS = [
  { value: "movie", label: "فیلم" },
  { value: "tv", label: "سریال" },
];

interface PersonFilmographyProps {
  personId: number;
  name: string;
  initialKind: MediaType;
}

/** Numeric Gregorian year from a credit item, or 0 when it has no date. */
function yearNum(item: TmdbListItem): number {
  return Number(yearOf(item.release_date ?? item.first_air_date)) || 0;
}

/** Sortable timestamp from a credit item, or 0 when it has no date. */
function timeOf(item: TmdbListItem): number {
  const d = item.release_date ?? item.first_air_date;
  const t = d ? new Date(d).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
}

/**
 * Actor filmography: the actor's credits for one media type, narrowed with a
 * catalog-style filter card. Because the credits arrive as one fixed list
 * (discover cannot filter by cast for TV), every filter is applied client-side.
 */
export function PersonFilmography({
  personId,
  name,
  initialKind,
}: PersonFilmographyProps) {
  const [kind, setKind] = React.useState<MediaType>(initialKind);
  const [query, setQuery] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [sort, setSort] = React.useState<string>(SORT_OPTIONS[0].value);
  const [years, setYears] = React.useState<[number, number]>([
    YEAR_RANGE.min,
    YEAR_RANGE.max,
  ]);
  const [highRated, setHighRated] = React.useState(false);
  const [persianOnly, setPersianOnly] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = usePersonCredits(personId, kind);
  const all = React.useMemo(() => data ?? [], [data]);

  const genres = React.useMemo(() => genreOptions(kind), [kind]);
  const resetPage = () => setPage(1);

  // Any filter/sort change starts over from page 1 (like the catalog view).
  const changeKind = (next: MediaType) => {
    setKind(next);
    setGenre(""); // genre ids differ between movie and tv
    resetPage();
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const yearActive = years[0] > YEAR_RANGE.min || years[1] < YEAR_RANGE.max;

    const list = all.filter((item) => {
      if (q) {
        const title = (item.title ?? item.name ?? "").toLowerCase();
        const orig = (
          item.original_title ??
          item.original_name ??
          ""
        ).toLowerCase();
        if (!title.includes(q) && !orig.includes(q)) return false;
      }
      if (genre && !(item.genre_ids ?? []).includes(Number(genre))) return false;
      if (yearActive) {
        const y = yearNum(item);
        if (!y || y < years[0] || y > years[1]) return false;
      }
      if (highRated && (item.vote_average ?? 0) < 7) return false;
      if (persianOnly && item.original_language !== "fa") return false;
      return true;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "vote_average.desc":
          return (b.vote_average ?? 0) - (a.vote_average ?? 0);
        case "primary_release_date.desc":
          return timeOf(b) - timeOf(a);
        case "primary_release_date.asc":
          return timeOf(a) - timeOf(b);
        default: // popularity.desc
          return (b.popularity ?? 0) - (a.popularity ?? 0);
      }
    });
  }, [all, query, genre, years, highRated, persianOnly, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const heading =
    kind === "tv" ? `سریال‌های با حضور ${name}` : `فیلم‌های با حضور ${name}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <h1 className="mb-6 text-right text-2xl font-extrabold">{heading}</h1>

      {/* filter card — mirrors the catalog view, applied client-side */}
      <div className="mb-8 rounded-2xl bg-surface p-4">
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder={`جستجو در آثار ${name}`}
            className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 pr-11 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
            options={KIND_OPTIONS}
            value={kind}
            onChange={(v) => changeKind(v as MediaType)}
            placeholder="نوع"
          />
        </div>

        {expanded && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="rounded-xl border border-border bg-surface-2 px-4 py-3 md:w-1/2">
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

      <CardGrid
        items={pageItems}
        mediaType={kind}
        loading={isLoading}
        emptyLabel={isError ? "خطا در دریافت اطلاعات" : "نتیجه‌ای یافت نشد"}
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
