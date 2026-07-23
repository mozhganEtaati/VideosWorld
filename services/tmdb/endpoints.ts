import "server-only";
import { tmdbFetch } from "./client";
import { mergeListTitles, pickTitle } from "./localize";
import type {
  MediaType,
  TmdbDetail,
  TmdbGenre,
  TmdbListItem,
  TmdbPaginated,
} from "@/types/tmdb";

type Params = Record<string, string | number | undefined>;
type List = TmdbPaginated<TmdbListItem>;

/**
 * Fetch a list in Persian and English, then merge titles so items without a
 * Persian name fall back to English instead of showing CJK/original script.
 */
async function localizedList(path: string, params: Params = {}): Promise<List> {
  const [fa, en] = await Promise.all([
    tmdbFetch<List>(path, params),
    tmdbFetch<List>(path, { ...params, language: "en-US" }),
  ]);
  return mergeListTitles(fa, en);
}

/** Named list endpoints (now_playing, on_the_air, top_rated, ...). */
export function getList(
  mediaType: MediaType,
  list: string,
  page = 1,
): Promise<List> {
  return localizedList(`${mediaType}/${list}`, { page });
}

/** Discover endpoint with arbitrary filter params. */
export function discover(mediaType: MediaType, params: Params = {}): Promise<List> {
  return localizedList(`discover/${mediaType}`, params);
}

/** Multi search across movies and tv. */
export function searchMulti(query: string, page = 1): Promise<List> {
  return localizedList("search/multi", { query, page, include_adult: "false" });
}

/** Search a single media type. */
export function search(mediaType: MediaType, query: string, page = 1): Promise<List> {
  return localizedList(`search/${mediaType}`, { query, page, include_adult: "false" });
}

/** Full detail payload with videos, credits, and recommendations. */
export async function getDetail(
  mediaType: MediaType,
  id: number | string,
): Promise<TmdbDetail> {
  const [fa, en] = await Promise.all([
    tmdbFetch<TmdbDetail>(`${mediaType}/${id}`, {
      append_to_response: "videos,credits,recommendations,similar",
    }),
    tmdbFetch<TmdbDetail>(`${mediaType}/${id}`, {
      append_to_response: "recommendations,similar",
      language: "en-US",
    }),
  ]);

  if (fa.title !== undefined) fa.title = pickTitle(fa.title, en.title, fa.original_title);
  if (fa.name !== undefined) fa.name = pickTitle(fa.name, en.name, fa.original_name);
  if (fa.recommendations && en.recommendations) {
    fa.recommendations = mergeListTitles(fa.recommendations, en.recommendations);
  }
  if (fa.similar && en.similar) {
    fa.similar = mergeListTitles(fa.similar, en.similar);
  }
  return fa;
}

export function getGenres(mediaType: MediaType): Promise<{ genres: TmdbGenre[] }> {
  return tmdbFetch(`genre/${mediaType}/list`);
}

export function getRecommendations(
  mediaType: MediaType,
  id: number | string,
  page = 1,
): Promise<List> {
  return localizedList(`${mediaType}/${id}/recommendations`, { page });
}
