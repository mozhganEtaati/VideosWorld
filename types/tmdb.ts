/** Media kind used throughout the app. */
export type MediaType = "movie" | "tv";

/** Minimal shape a poster card needs to render (satisfied by list items,
 *  detail payloads, and stored favorites). */
export interface CardItem {
  id: number;
  media_type?: MediaType;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

/** A movie or TV item as returned in TMDB list endpoints. */
export interface TmdbListItem {
  id: number;
  media_type?: MediaType;
  title?: string; // movies
  name?: string; // tv
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string; // movies
  first_air_date?: string; // tv
  genre_ids?: number[];
  original_language?: string;
}

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbVideo {
  id: string;
  key: string;
  site: string; // "YouTube"
  type: string; // "Trailer"
  name: string;
  official: boolean;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbCountry {
  iso_3166_1: string;
  name: string;
}

/** Full detail payload (movie or tv) with appended videos/credits/recommendations. */
export interface TmdbDetail {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number; // movie
  episode_run_time?: number[]; // tv
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: TmdbGenre[];
  production_countries: TmdbCountry[];
  original_language: string;
  videos?: { results: TmdbVideo[] };
  credits?: { cast: TmdbCastMember[] };
  recommendations?: TmdbPaginated<TmdbListItem>;
  similar?: TmdbPaginated<TmdbListItem>;
}
