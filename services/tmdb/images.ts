import { IMAGE_SIZES } from "@/constants/config";

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ??
  process.env.TMDB_IMAGE_BASE ??
  "https://image.tmdb.org/t/p";

type Size = string;

/** Build a full TMDB image URL, or null when the path is missing. */
export function tmdbImage(path: string | null | undefined, size: Size): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export const posterUrl = (p: string | null | undefined) =>
  tmdbImage(p, IMAGE_SIZES.poster);
export const backdropUrl = (p: string | null | undefined) =>
  tmdbImage(p, IMAGE_SIZES.backdrop);
export const backdropOriginalUrl = (p: string | null | undefined) =>
  tmdbImage(p, IMAGE_SIZES.backdropOriginal);
export const thumbUrl = (p: string | null | undefined) =>
  tmdbImage(p, IMAGE_SIZES.thumb);
export const profileUrl = (p: string | null | undefined) =>
  tmdbImage(p, "w185");
