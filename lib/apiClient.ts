/**
 * Client-side fetcher that talks to our own /api/tmdb proxy (which injects the
 * TMDB token server-side). Used by TanStack Query hooks.
 */
export async function fetchTmdb<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const search = new URLSearchParams();
  if (!("language" in params)) search.set("language", "fa-IR");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  const res = await fetch(`/api/tmdb/${path}${qs ? `?${qs}` : ""}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}
