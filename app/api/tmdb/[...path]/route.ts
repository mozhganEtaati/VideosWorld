import { NextResponse } from "next/server";
import { tmdbFetch, TmdbConfigError, TmdbRequestError } from "@/services/tmdb/client";
import { mergeListTitles } from "@/services/tmdb/localize";
import type { TmdbListItem, TmdbPaginated } from "@/types/tmdb";

function isList(data: unknown): data is TmdbPaginated<TmdbListItem> {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as { results?: unknown }).results)
  );
}

/**
 * Read-only proxy so client components (search, filters, pagination) can query
 * TMDB via TanStack Query without ever seeing the API token. Only a small set
 * of path prefixes is allowed.
 */
const ALLOWED_PREFIXES = [
  "movie/",
  "tv/",
  "discover/",
  "search/",
  "genre/",
  "trending/",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const tmdbPath = path.join("/");

  if (!ALLOWED_PREFIXES.some((p) => `${tmdbPath}/`.startsWith(p) || tmdbPath.startsWith(p))) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  const search = new URL(request.url).searchParams;
  const forwarded: Record<string, string> = {};
  search.forEach((value, key) => {
    forwarded[key] = value;
  });

  try {
    const data = await tmdbFetch(tmdbPath, forwarded);
    // For list responses, merge an English pass so titles without a Persian
    // name fall back to English instead of showing original/CJK script.
    if (isList(data)) {
      const en = await tmdbFetch<TmdbPaginated<TmdbListItem>>(tmdbPath, {
        ...forwarded,
        language: "en-US",
      });
      return NextResponse.json(mergeListTitles(data, en));
    }
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof TmdbConfigError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    if (err instanceof TmdbRequestError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
