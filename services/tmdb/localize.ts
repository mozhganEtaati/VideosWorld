import type { TmdbListItem, TmdbPaginated } from "@/types/tmdb";

// Persian/Arabic script range — used to detect a real Persian translation.
const PERSIAN_RE = /[؀-ۿ]/;

export function isPersianText(s: string | undefined | null): boolean {
  return !!s && PERSIAN_RE.test(s);
}

/**
 * Choose the best display string: Persian when TMDB has it, otherwise the
 * English title (readable Latin), otherwise the original as a last resort.
 */
export function pickTitle(
  fa?: string,
  en?: string,
  fallback?: string,
): string {
  if (isPersianText(fa)) return fa as string;
  if (en && en.trim()) return en;
  return fa || fallback || "";
}

/**
 * Merge English titles into a Persian list result: for each item, keep the
 * Persian title if present, else use the English one (matched by id).
 */
export function mergeListTitles<T extends TmdbListItem>(
  fa: TmdbPaginated<T>,
  en: TmdbPaginated<T>,
): TmdbPaginated<T> {
  const enById = new Map(en.results.map((r) => [r.id, r]));
  return {
    ...fa,
    results: fa.results.map((item) => {
      const e = enById.get(item.id);
      const next = { ...item };
      if (item.title !== undefined) {
        next.title = pickTitle(item.title, e?.title, item.original_title);
      }
      if (item.name !== undefined) {
        next.name = pickTitle(item.name, e?.name, item.original_name);
      }
      return next;
    }),
  };
}
