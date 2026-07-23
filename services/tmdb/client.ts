import "server-only";

const API_BASE = process.env.TMDB_API_BASE ?? "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
const API_KEY = process.env.TMDB_API_KEY;

export class TmdbConfigError extends Error {}
export class TmdbRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/**
 * Low-level TMDB fetch. Server-only: reads credentials from env and never
 * exposes them to the client. Requests Persian (`fa`) by default.
 */
export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  if (!TOKEN && !API_KEY) {
    throw new TmdbConfigError(
      "TMDB credentials missing: set TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY.",
    );
  }

  const url = new URL(`${API_BASE}/${path.replace(/^\//, "")}`);
  if (!("language" in params)) url.searchParams.set("language", "fa-IR");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: HeadersInit = { accept: "application/json" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  else url.searchParams.set("api_key", API_KEY as string);

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 }, // ISR-style caching for TMDB reads
  });

  if (!res.ok) {
    throw new TmdbRequestError(
      `TMDB request failed for ${path}`,
      res.status,
    );
  }
  return (await res.json()) as T;
}
