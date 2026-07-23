## Context

VideosWorld is a greenfield Next.js 16 (App Router) / React 19 / TypeScript / Tailwind v4 project. The UI must reproduce the فیلم‌۲مدیا reference screenshots pixel-accurately in RTL Persian, with dark (default) and light themes. Data comes from TMDB, but the reference UI shows substantial content TMDB does not provide (download links, Persian dubbing, like/dislike, captcha, social links). This design records how the pages, components, data layer, and mock boundary fit together. Screenshots are the single source of truth; nothing is redesigned or added.

## Goals / Non-Goals

**Goals:**
- Pixel-accurate reproduction of Home, Title Details, Category, Login, and Register from the screenshots.
- Reusable, strictly-typed TMDB data layer with caching, loading, and error handling via TanStack Query.
- Clean separation between TMDB-backed data and mock (non-TMDB) data so a future backend can drop in.
- RTL Persian layout, Vazirmatn font, Jalali date display, dark + derived light themes.
- Server Components by default; client components only for interactive UI.

**Non-Goals:**
- No authentication, registration, or session logic (forms are presentational).
- No real download/streaming, captcha verification, or social integrations.
- No pages, filters, or interactions not present in the screenshots.
- No responsive layouts beyond what is derived here (no mobile screenshots exist).

## Decisions

**Framework & rendering.** App Router with Server Components for data fetching (pages call TMDB server-side); mark carousels, filter panel, tabs, theme switch, and forms `"use client"`. Hydrate lists with TanStack Query for cache reuse across navigation.

**Data layer.** `services/tmdb/` exposes a typed `client` (fetch wrapper reading `TMDB_ACCESS_TOKEN` + image base from env) and endpoint modules (`movies`, `tv`, `discover`, `search`, `genres`, `details`). Hooks in `hooks/` wrap these with `useQuery`. Types live in `types/tmdb.ts`. Persian requested via `language=fa` with original-language fallback.

**Mock boundary.** `services/mock/` provides download rows, dubbing metadata, like/dislike counts, captcha, and social links, each behind a typed interface. UI imports from `services/mock`, never inlining these. Swapping to a backend touches only this module.

**Theming.** `next-themes` with `class` strategy; Tailwind v4 theme tokens for `--bg`, `--surface`, `--accent` (`#9CE800`), text, border. Dark values from the list/auth screens; light values derived to match the details-page palette. Accent green is theme-independent.

**Design tokens.** Poster 2:3, backdrop 16:9, radius `8–12px`, pill controls `rounded-full`, grid gap ~16px. Badges: IMDb (yellow `#F5C518`/black), CC (dark circle), dubbing mic (green circle). Lucide icons ~16–20px.

**Responsive (derived).** Grid columns `2 (base) → 4 (sm) → 6 (lg) → 8 (xl)`. Carousels stay horizontal-scroll at all sizes. Navbar collapses search/CTA into a menu below `md`. Details hero stacks poster above metadata below `md`.

**Dates & numerals.** `dayjs` + `dayjs-jalali` convert TMDB Gregorian dates to Jalali; Persian digits via a formatting util.

**Routing.** `app/(main)/page.tsx` (Home), `app/movie/[id]`, `app/series/[id]`, `app/category/[slug]`, `app/login`, `app/register`. Category filters, search, sort, and page encoded as URL search params (shareable, server-readable).

**Folder structure.** `app/`, `features/`, `components/{ui,media,layout,filters}`, `services/{tmdb,mock}`, `hooks/`, `lib/`, `types/`, `constants/` (genre maps, category→endpoint map, config).

## Risks / Trade-offs

- **TMDB gaps (accepted):** Download box, dubbing, like/dislike, captcha, social links are mock/static per user direction (R-3). Risk: looks functional but isn't; mitigated by isolating them in `services/mock` and labeling them display-only.
- **Derived theme/responsive:** Light theme for list/auth pages and all breakpoints are inferred, not from screenshots (R-1, R-2). Risk of minor divergence from an unseen real design; mitigated by reusing the established palette and standard breakpoint ladder.
- **Persian metadata coverage:** TMDB `fa` translations are incomplete; some titles/descriptions fall back to original language — acceptable and matches how such sites behave.
- **Category→endpoint mapping:** "Korean/Turkish/Chinese/anime" map to `discover` by original language/genre, which approximates the reference groupings rather than matching its exact catalog.
