## Why

VideosWorld currently has only the default Next.js starter page. The home page is the entry point of the site and sets the visual language for everything else. We need a Persian (RTL), dark-themed landing page — modeled on فیلم‌۲مدیا — that showcases featured content in a hero and organizes the catalog into browsable category rows, backed by real TMDB data. We standardize the UI on **shadcn/ui** so every later page reuses the same accessible primitives.

## What Changes

- Convert the root layout to Persian RTL (`lang="fa"`, `dir="rtl"`) with a Persian-friendly font and the dark theme baseline.
- Initialize **shadcn/ui** (Tailwind v4 + React 19), themed to the design language: near-black surfaces, lime-green accent, rounded/pill controls. Add the primitives the home page needs (Button, Card, Carousel, Skeleton, Badge, etc.).
- Build app-specific presentational components on top of shadcn primitives:
  - **PosterCard** — 2:3 poster, overlay badges (CC/subtitle, Persian-dubbing, IMDb rating), title + season/episode caption.
  - **Hero** — featured-title carousel (backdrop, title, rating, play/trailer CTA).
  - **CategoryRow** — horizontally scrollable strip of PosterCards with a "view all" link.
  - **SiteHeader** (logo, nav, search entry, auth entry) and **SiteFooter** (social links, copyright).
- Compose the **home page** from a hero plus multiple category rows (latest movies, latest series, top rated, world series, Korean, Turkish, anime, Chinese, kids).
- Add a **TMDB data layer**: a typed server-side client reading credentials from `.env.local`, with helpers (trending, now-playing movies, popular/airing series, by-genre, by-original-language) and poster/backdrop URL builders.
- Fetch home page data in Server Components; add graceful fallback when TMDB is unreachable.

## Capabilities

### New Capabilities
- `design-system`: shadcn/ui setup plus the shared visual foundation — theme tokens, RTL/typography config, and app-specific primitives (PosterCard, Hero, CategoryRow, SiteHeader, SiteFooter) reused across all pages.
- `tmdb-integration`: server-side TMDB client and typed data helpers for fetching catalog content and building image URLs, with credentials sourced from environment variables.
- `home-page`: the landing page itself — header, hero carousel, category rows, and footer — composed from the design system and fed by the TMDB integration.

### Modified Capabilities
<!-- None — this is the first feature; no existing spec requirements change. -->

## Impact

- **New code**: `app/layout.tsx` (RTL + fonts), `app/page.tsx` (home), `app/globals.css` (theme tokens), `components/ui/` (shadcn primitives), `components/` (PosterCard, Hero, CategoryRow, SiteHeader, SiteFooter), `lib/tmdb/` (client, types, helpers, image URLs), `lib/utils.ts` (shadcn `cn`), `components.json` (shadcn config).
- **Config**: consumes `TMDB_READ_ACCESS_TOKEN` / `TMDB_API_KEY` from `.env.local`; `next.config.ts` must allow `image.tmdb.org` as a remote image host.
- **Dependencies**: adds shadcn/ui deps (Radix primitives, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `embla-carousel-react`). No new HTTP client — native `fetch`.
- **Non-goals**: title detail pages, category/listing pages, auth, real playback/downloads, and any backend/database — those are separate future changes.
