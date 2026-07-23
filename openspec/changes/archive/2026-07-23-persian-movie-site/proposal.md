## Why

VideosWorld needs a production-ready Persian (RTL) movie & TV-series front-end that visually reproduces the فیلم‌۲مدیا reference UI captured in the source screenshots. The screenshots are the single source of truth; this change establishes the pages, shared components, design system, and TMDB-backed data layer required to build them pixel-accurately without redesigning or simplifying anything shown.

## What Changes

- Introduce a fully **RTL, Persian-localized** Next.js App Router application with **dark and light themes** (dark is default; light is shown on the details page).
- Build a reusable **TMDB data layer** (typed client, endpoints, TanStack Query hooks) with env-based credentials, caching, and loading/error handling.
- Implement the **Home** page: hero carousel + ~10 category carousel rows (latest movies/series, top 2026, world/Korean/Turkish/Chinese series, anime, Persian-dubbed, coming soon).
- Implement the **Title Details** page (movie & series share one layout): hero header, metadata, like/dislike counters, trailer action, download box, and recommended rows.
- Implement the **Catalog/Category** page: search bar, filter bar + expandable filter panel (genre, sort, country, year-range slider 1800–2026, dub/hardsub/recommended toggles), responsive poster grid, numbered pagination.
- Implement **Login** and **Register** pages as tabbed cards — **UI only, no auth logic** (backend added later).
- Establish the shared **design system**: lime-green accent, poster cards (CC / dubbing-mic / IMDb badges), pill controls, rounded dark surfaces, Vazirmatn font, Jalali date display.
- Render UI elements TMDB cannot supply (download links/qualities, dubbing info, like/dislike counts, social links, captcha) as **pixel-accurate static/mock UI**, isolated behind a mock-data boundary so a real backend can replace them later.

## Capabilities

### New Capabilities
- `tmdb-data-layer`: Typed TMDB API client, endpoint modules, and TanStack Query hooks with env credentials, caching, and error handling; plus the mock-data boundary for non-TMDB fields.
- `app-shell`: Root RTL layout, providers (theme + query), Navbar (logo, search, theme switch, notifications, auth CTA), Footer, and dark/light theming.
- `home`: Hero carousel and the set of horizontally-scrolling category rows with "view all" links.
- `title-details`: Movie/series detail layout — hero header, metadata, actions, static download box, and recommended rows (light theme).
- `catalog`: Category listing with search, filter bar, expandable filter panel, responsive grid, and pagination driven by URL params.
- `auth-ui`: Login and Register tabbed card screens (presentational only, no authentication).

### Modified Capabilities
<!-- None — greenfield project, no existing specs. -->

## Impact

- **New app code**: `app/` routes (home, movie/series details, category, login, register), `components/`, `features/`, `services/tmdb/`, `hooks/`, `lib/`, `types/`, `constants/`.
- **Dependencies added**: `@tanstack/react-query`, `next-themes`, `lucide-react`, shadcn/ui primitives, `dayjs`/`dayjs-jalali`, Vazirmatn font, optionally `framer-motion` (carousels only if implied).
- **Configuration**: `.env` for `TMDB_API_KEY`/`TMDB_ACCESS_TOKEN` and image base URL; Next.js `images` remote patterns for `image.tmdb.org`; Tailwind theme tokens; RTL root layout.
- **No backend/auth** is implemented in this change; auth forms are non-functional mock UI.
