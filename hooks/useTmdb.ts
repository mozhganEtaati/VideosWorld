"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTmdb } from "@/lib/apiClient";
import type {
  MediaType,
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
