"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTmdb } from "@/lib/apiClient";
import type {
  MediaType,
  TmdbCredits,
  TmdbGenre,
  TmdbListItem,
  TmdbPaginated,
} from "@/types/tmdb";

type Params = Record<string, string | number | undefined>;

/** Generic discover query (used by the catalog page). */
export function useDiscover(
  mediaType: MediaType,
  params: Params,
  options?: { enabled?: boolean; initialData?: TmdbPaginated<TmdbListItem> },
) {
  return useQuery({
    queryKey: ["discover", mediaType, params],
    queryFn: () => fetchTmdb<TmdbPaginated<TmdbListItem>>(`discover/${mediaType}`, params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? true,
    initialData: options?.initialData,
  });
}

/** Multi search query. */
export function useSearch(query: string, page: number) {
  return useQuery({
    queryKey: ["search", query, page],
    queryFn: () =>
      fetchTmdb<TmdbPaginated<TmdbListItem>>("search/multi", {
        query,
        page,
        include_adult: "false",
      }),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}

export function useGenres(mediaType: MediaType) {
  return useQuery({
    queryKey: ["genres", mediaType],
    queryFn: () => fetchTmdb<{ genres: TmdbGenre[] }>(`genre/${mediaType}/list`),
    staleTime: 24 * 60 * 60 * 1000, // genres rarely change
  });
}

/**
 * A person's filmography (their cast credits) for one media type, deduped by
 * id and sorted by popularity (desc). Uses person/{id}/{movie|tv}_credits
 * because discover/tv cannot filter by cast.
 */
export function usePersonCredits(personId: number, mediaType: MediaType) {
  return useQuery({
    queryKey: ["person-credits", personId, mediaType],
    queryFn: async () => {
      const data = await fetchTmdb<TmdbCredits>(
        `person/${personId}/${mediaType === "tv" ? "tv" : "movie"}_credits`,
      );
      const seen = new Set<number>();
      return data.cast
        .filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        })
        .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
    },
    enabled: Number.isFinite(personId) && personId > 0,
    placeholderData: keepPreviousData,
  });
}
