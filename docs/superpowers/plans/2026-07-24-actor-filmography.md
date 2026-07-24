# Actor Filmography Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a user click a cast member on a title's detail page and land on a dedicated page showing that actor's filmography (movies or series, matching the current title), with the actor's name in a catalog-style search box.

**Architecture:** A new client component (`PersonFilmography`) fetches the actor's `person/{id}/{movie|tv}_credits` through the existing `/api/tmdb` proxy via a new TanStack Query hook, sorts/dedupes client-side, and paginates client-side. A new server route `/person/[id]` reads `id`/`name`/`kind` and renders that component. The cast row links into it.

**Tech Stack:** Next.js 16 (App Router, async `params`/`searchParams`), React 19, TanStack Query, Tailwind v4, TMDB API.

## Global Constraints

- **Next.js 16:** `params` and `searchParams` in pages are `Promise`s — always `await` them.
- **Verification method:** this project has **no test framework**. Verify each task with `npx tsc --noEmit` and, for UI tasks, a manual browser check. Do NOT add a test runner.
- **API proxy allowlist:** client-side TMDB calls only work for path prefixes in `ALLOWED_PREFIXES` (`app/api/tmdb/[...path]/route.ts`). `person/` must be added there before the hook can fetch credits.
- **TMDB constraint:** `discover/tv?with_cast` does NOT filter — use `person/{id}/{movie|tv}_credits` for both media types.
- **Localization pattern:** list/credits payloads are merged with an English pass so titles without a Persian name fall back to English (`pickTitle`). Preserve this for credits.
- **Branch & commits:** repo is on `master`. Create branch `feat/actor-filmography` before Task 1. Commit after each task. If the user prefers to hold commits, group them and confirm before pushing.

---

### Task 1: Enable the person-credits data path (types + localization + proxy)

Wires TMDB person credits through the proxy with English-fallback localization. Cohesive because the hook in Task 2 cannot fetch anything until the proxy allows `person/` and returns localized credits.

**Files:**
- Modify: `types/tmdb.ts` (add `popularity` to `TmdbListItem`; add `TmdbCredits`)
- Modify: `services/tmdb/localize.ts` (add `mergeCreditTitles`)
- Modify: `app/api/tmdb/[...path]/route.ts` (allow `person/`; merge credits)

**Interfaces:**
- Produces: `TmdbCredits` interface `{ id: number; cast: TmdbListItem[]; crew?: TmdbListItem[] }`; `TmdbListItem.popularity?: number`; `mergeCreditTitles(fa: TmdbCredits, en: TmdbCredits): TmdbCredits`.

- [ ] **Step 1: Add `popularity` and `TmdbCredits` to types**

In `types/tmdb.ts`, add `popularity?: number;` to `TmdbListItem` (right after the `vote_average: number;` line):

```ts
  vote_average: number;
  popularity?: number;
```

Then add this interface after the `TmdbPaginated` interface:

```ts
/** person/{id}/{movie|tv}_credits payload (cast = the person's filmography). */
export interface TmdbCredits {
  id: number;
  cast: TmdbListItem[];
  crew?: TmdbListItem[];
}
```

- [ ] **Step 2: Add `mergeCreditTitles` to localize.ts**

In `services/tmdb/localize.ts`, update the import line to include `TmdbCredits`:

```ts
import type { TmdbCredits, TmdbListItem, TmdbPaginated } from "@/types/tmdb";
```

Then append this function at the end of the file:

```ts
/**
 * Merge English titles into a Persian credits result (a person's filmography):
 * keep the Persian title when present, else the English one, matched by id.
 */
export function mergeCreditTitles(fa: TmdbCredits, en: TmdbCredits): TmdbCredits {
  const enById = new Map(en.cast.map((r) => [r.id, r]));
  return {
    ...fa,
    cast: fa.cast.map((item) => {
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
```

- [ ] **Step 3: Allow `person/` and merge credits in the proxy**

In `app/api/tmdb/[...path]/route.ts`, update the localize import:

```ts
import { mergeListTitles, mergeCreditTitles } from "@/services/tmdb/localize";
import type { TmdbCredits, TmdbListItem, TmdbPaginated } from "@/types/tmdb";
```

Add `"person/"` to `ALLOWED_PREFIXES` (after `"tv/"`):

```ts
const ALLOWED_PREFIXES = [
  "movie/",
  "tv/",
  "person/",
  "discover/",
  "search/",
  "genre/",
  "trending/",
];
```

Add a credits type-guard next to `isList`:

```ts
function isCredits(data: unknown): data is TmdbCredits {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray((data as { cast?: unknown }).cast)
  );
}
```

In the `try` block, add a credits branch after the existing `isList` branch (before the final `return NextResponse.json(data);`):

```ts
    if (isCredits(data)) {
      const en = await tmdbFetch<TmdbCredits>(tmdbPath, {
        ...forwarded,
        language: "en-US",
      });
      return NextResponse.json(mergeCreditTitles(data, en));
    }
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 5: Manual proxy check (dev server)**

Run: `npm run dev` (if not already running), then in another shell:
`curl -s "http://localhost:3000/api/tmdb/person/31/movie_credits" | head -c 200`
Expected: JSON beginning with `{"id":31,"cast":[` (Tom Hanks' movies). A `403 {"error":"Path not allowed"}` means Step 3's allowlist edit is wrong.

- [ ] **Step 6: Commit**

```bash
git add types/tmdb.ts services/tmdb/localize.ts app/api/tmdb/[...path]/route.ts
git commit -m "feat: allow person credits through TMDB proxy with localization"
```

---

### Task 2: `usePersonCredits` hook

**Files:**
- Modify: `hooks/useTmdb.ts`

**Interfaces:**
- Consumes: `TmdbCredits` (Task 1), `fetchTmdb`, `MediaType`.
- Produces: `usePersonCredits(personId: number, mediaType: MediaType)` → TanStack `UseQueryResult<TmdbListItem[]>` (data is deduped, sorted by `popularity` desc).

- [ ] **Step 1: Add the hook**

In `hooks/useTmdb.ts`, extend the type import to include `TmdbCredits`:

```ts
import type {
  MediaType,
  TmdbCredits,
  TmdbGenre,
  TmdbListItem,
  TmdbPaginated,
} from "@/types/tmdb";
```

Append this hook at the end of the file:

```ts
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add hooks/useTmdb.ts
git commit -m "feat: add usePersonCredits hook"
```

---

### Task 3: `PersonFilmography` client component

**Files:**
- Create: `components/person/person-filmography.tsx`

**Interfaces:**
- Consumes: `usePersonCredits` (Task 2), `CardGrid`, `Pagination`, `MediaType`.
- Produces: `PersonFilmography({ personId: number; name: string; initialKind: MediaType })` (default export not used — named export).

- [ ] **Step 1: Create the component**

Create `components/person/person-filmography.tsx`:

```tsx
"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { CardGrid } from "@/components/media/card-grid";
import { Pagination } from "@/components/media/pagination";
import { usePersonCredits } from "@/hooks/useTmdb";
import type { MediaType } from "@/types/tmdb";

const PAGE_SIZE = 20;

interface PersonFilmographyProps {
  personId: number;
  name: string;
  initialKind: MediaType;
}

/** Actor filmography: read-only search box with the actor's name, a movie/
 *  series toggle, and a client-side-paginated grid of their credits. */
export function PersonFilmography({
  personId,
  name,
  initialKind,
}: PersonFilmographyProps) {
  const [kind, setKind] = React.useState<MediaType>(initialKind);
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = usePersonCredits(personId, kind);
  const items = data ?? [];
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeKind = (next: MediaType) => {
    setKind(next);
    setPage(1);
  };

  const heading =
    kind === "tv" ? `سریال‌های با حضور ${name}` : `فیلم‌های با حضور ${name}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <h1 className="mb-6 text-right text-2xl font-extrabold">{heading}</h1>

      <div className="mb-8 rounded-2xl bg-surface p-4">
        {/* read-only search box showing the actor's name */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={name}
            readOnly
            aria-label="بازیگر"
            className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 pr-11 text-sm text-foreground"
          />
        </div>

        {/* movie / series toggle */}
        <div className="flex gap-2">
          <KindButton active={kind === "movie"} onClick={() => changeKind("movie")}>
            فیلم‌ها
          </KindButton>
          <KindButton active={kind === "tv"} onClick={() => changeKind("tv")}>
            سریال‌ها
          </KindButton>
        </div>
      </div>

      <CardGrid
        items={pageItems}
        mediaType={kind}
        loading={isLoading}
        emptyLabel={isError ? "خطا در دریافت اطلاعات" : "نتیجه‌ای یافت نشد"}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function KindButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-accent-foreground"
          : "flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2 px-6 text-sm text-foreground hover:bg-surface"
      }
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Commit**

```bash
git add components/person/person-filmography.tsx
git commit -m "feat: add PersonFilmography component"
```

---

### Task 4: `/person/[id]` route

**Files:**
- Create: `app/(main)/person/[id]/page.tsx`

**Interfaces:**
- Consumes: `PersonFilmography` (Task 3), `MediaType`.

- [ ] **Step 1: Create the page**

Create `app/(main)/person/[id]/page.tsx`:

```tsx
import { PersonFilmography } from "@/components/person/person-filmography";
import type { MediaType } from "@/types/tmdb";

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; kind?: string }>;
}) {
  const { id } = await params;
  const { name, kind } = await searchParams;
  const initialKind: MediaType = kind === "tv" ? "tv" : "movie";

  return (
    <PersonFilmography
      personId={Number(id)}
      name={name ?? ""}
      initialKind={initialKind}
    />
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 3: Manual browser check**

With the dev server running, open:
`http://localhost:3000/person/31?name=%D8%AA%D8%A7%D9%85%20%D9%87%D9%86%DA%A9%D8%B3&kind=movie`
Expected: heading «فیلم‌های با حضور تام هنکس», the name in the search box, a grid of Tom Hanks movies, working pagination. Click the «سریال‌ها» toggle → grid switches to his series and page resets to 1.

- [ ] **Step 4: Commit**

```bash
git add "app/(main)/person/[id]/page.tsx"
git commit -m "feat: add /person/[id] filmography route"
```

---

### Task 5: Link cast members into the person page

**Files:**
- Modify: `components/details/cast-row.tsx` (add `mediaType` prop; wrap each cast member in a `Link`)
- Modify: `components/details/detail-view.tsx` (pass `mediaType` to `CastRow`)

**Interfaces:**
- Consumes: `MediaType`, `/person/[id]` route (Task 4).

- [ ] **Step 1: Make cast members links**

In `components/details/cast-row.tsx`, add the imports (top of file, alongside the existing imports):

```tsx
import Link from "next/link";
import type { MediaType, TmdbCastMember } from "@/types/tmdb";
```

(Remove the old `import type { TmdbCastMember } from "@/types/tmdb";` line — it is replaced by the combined import above.)

Change the component signature:

```tsx
export function CastRow({
  cast,
  mediaType,
}: {
  cast: TmdbCastMember[];
  mediaType: MediaType;
}) {
```

Replace the person `<div key={person.id} …>…</div>` block (the one inside `people.map`) with a `Link`:

```tsx
          return (
            <Link
              key={person.id}
              href={`/person/${person.id}?name=${encodeURIComponent(
                person.name,
              )}&kind=${mediaType}`}
              className="group/person w-24 shrink-0 text-center"
            >
              <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-2 ring-border transition-transform duration-200 group-hover/person:scale-105 group-hover/person:ring-accent">
                {photo ? (
                  <Image
                    src={photo}
                    alt={person.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-surface-2 text-xl font-bold text-muted">
                    {person.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-semibold text-foreground group-hover/person:text-accent">
                {person.name}
              </p>
              {person.character && (
                <p className="line-clamp-1 text-[11px] text-muted">
                  {person.character}
                </p>
              )}
            </Link>
          );
```

- [ ] **Step 2: Pass `mediaType` from the detail view**

In `components/details/detail-view.tsx`, change the cast row usage:

```tsx
        <CastRow cast={cast} mediaType={mediaType} />
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no output (exit 0).

- [ ] **Step 4: Manual browser check**

With the dev server running, open a movie detail page (e.g. `http://localhost:3000/movie/13` — Forrest Gump), scroll to «بازیگران», and click a cast member. Expected: navigates to `/person/{id}?name=…&kind=movie` and shows that actor's movies. Repeat on a series detail page (`/series/{id}`) and confirm it lands with `kind=tv` and shows series.

- [ ] **Step 5: Commit**

```bash
git add components/details/cast-row.tsx components/details/detail-view.tsx
git commit -m "feat: link cast members to their filmography page"
```

---

## Notes for the implementer

- Do not add a test runner; `npx tsc --noEmit` + the described browser checks are the verification gates (project has no test infra).
- The `mediaType` on `MediaCard`/`CardGrid` is passed explicitly (`kind`) so credit items — which may lack `media_type` — link to the correct `/movie` or `/series` detail route.
- If the dev server is already running, reuse it rather than starting a second one.
