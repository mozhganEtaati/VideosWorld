# Actor Filmography Page — Design

**Date:** 2026-07-24
**Status:** Approved (design), pending implementation plan

## Purpose

On a title's detail page, clicking a cast member should take the user to a
dedicated page showing **that actor's filmography** — their movies (if the
current title is a movie) or their series (if it's a series) — with the actor's
name shown in a catalog-style search box.

This turns the cast list from static decoration into a navigation surface for
discovering more content by the same actor.

## User-facing behavior

1. On `/movie/[id]` or `/series/[id]`, each cast member headshot + name is
   clickable.
2. Clicking navigates to `/person/[id]?name=<actor>&kind=<movie|tv>` where
   `kind` matches the media type of the title the user came from.
3. The person page shows:
   - A heading: «فیلم‌های با حضور {name}» (movie) or «سریال‌های با حضور {name}» (tv).
   - A catalog-style **search box pre-filled with the actor's name, read-only**.
   - A **movie / series toggle** (initial value from the `kind` URL param).
   - A responsive grid of the actor's credits for the selected media type,
     sorted by popularity (desc), duplicates removed.
   - Client-side pagination (20 items/page) reusing the existing `Pagination`.

## Key technical constraint (verified against TMDB)

- `discover/movie?with_cast={id}` **works** (paginated, localizable).
- `discover/tv?with_cast={id}` **silently ignores** the filter and returns
  generic popular TV — so discover cannot filter series by actor.
- `person/{id}/movie_credits` and `person/{id}/tv_credits` **both work** and are
  symmetric for movies and TV. Response shape is `{ cast: [...], crew: [...] }`
  (NOT the paginated `{ results, page, total_pages }` shape).

**Decision:** use `person/{id}/{movie|tv}_credits` for both media types (unified,
correct for TV). Pagination is done client-side since credits arrive in one payload.

## Components & changes

### 1. API proxy — `app/api/tmdb/[...path]/route.ts`
- Add `"person/"` to `ALLOWED_PREFIXES`.
- Credits responses have `cast`, not `results`, so the existing list en-merge is
  skipped for them. Add a branch that, for a credits response, fetches the
  English pass and merges `cast` titles (Persian kept when present, else English)
  by id — mirroring the existing list behavior.

### 2. Localization helper — `services/tmdb/localize.ts`
- Add `mergeCreditTitles(fa, en)` that merges a `{ cast: TmdbListItem[] }` payload
  by id using the existing `pickTitle` logic. Reuses `pickTitle`; no new title logic.

### 3. Data hook — `hooks/useTmdb.ts`
- Add `usePersonCredits(personId: number, mediaType: MediaType)`:
  - Fetches `person/{personId}/{movie|tv}_credits` via `fetchTmdb`.
  - Maps `cast` → card items, dedupes by `id`, sorts by `popularity` desc.
  - Enabled only when `personId` is present.

### 4. Cast row — `components/details/cast-row.tsx`
- Accept a new `mediaType: MediaType` prop.
- Wrap each cast member's existing markup in
  `<Link href={`/person/${person.id}?name=${encodeURIComponent(person.name)}&kind=${mediaType}`}>`
  with a subtle hover affordance. No change to the visual layout otherwise.

### 5. Detail view — `components/details/detail-view.tsx`
- Pass `mediaType` to `<CastRow cast={cast} mediaType={mediaType} />`.

### 6. Person route — `app/(main)/person/[id]/page.tsx` (new, server component)
- Next.js 16: `params` and `searchParams` are async — `await` both.
- Read `id` (params), `name` and `kind` (searchParams).
- Render `<PersonFilmography personId={Number(id)} name={name} initialKind={kind} />`
  inside a `<Suspense>` boundary (matches the catalog page pattern).

### 7. Person filmography view — `components/person/person-filmography.tsx` (new, client)
- Props: `personId`, `name`, `initialKind` (`"movie" | "tv"`, default `"movie"`).
- State: `kind`, `page`.
- Uses `usePersonCredits(personId, kind)`.
- Renders: heading, read-only search box pre-filled with `name`, movie/series
  toggle, `CardGrid` of the current page slice, `Pagination` driven by
  `Math.ceil(items.length / 20)`.
- Resets `page` to 1 when `kind` changes.

## Data flow

```
cast-row (Link) ──▶ /person/[id]?name&kind
   page.tsx (server: await params/searchParams)
     └─▶ PersonFilmography (client)
           └─▶ usePersonCredits(id, kind)
                 └─▶ fetchTmdb → /api/tmdb/person/{id}/{movie|tv}_credits
                       └─▶ proxy (person/ allowed) → TMDB fa + en → mergeCreditTitles
```

## Error / empty handling

- No credentials / request error → `CardGrid` shows «خطا در دریافت اطلاعات»
  (reuse existing `emptyLabel` pattern via `isError`).
- Empty credits for the selected media type → «نتیجه‌ای یافت نشد» and the toggle
  lets the user switch to the other media type.
- `personId` NaN (bad URL) → treat as empty state.

## Out of scope (YAGNI)

- Editable free-text search on the person page (text search returns the person,
  not their films — deliberately avoided).
- Advanced filters (genre / year / country / sort options) on the person page.
- A person header block (photo, bio, department) — the heading + name suffices.
- Server-side fetch of the person's canonical name (the name is passed via URL
  from the cast link; absent name → empty search box, credits still load).

## Testing

- `usePersonCredits`: dedupe + popularity sort of a mocked credits payload;
  correct endpoint per media type.
- `mergeCreditTitles`: Persian kept when present, English fallback otherwise,
  matched by id.
- `cast-row`: renders links with the correct `href` (id, encoded name, kind).
- `PersonFilmography`: heading text per kind; page resets on kind switch;
  pagination slices correctly.
- Proxy: `person/` path allowed; disallowed paths still 403.
