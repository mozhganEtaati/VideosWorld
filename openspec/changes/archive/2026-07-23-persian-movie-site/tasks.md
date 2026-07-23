## 1. Project Setup

- [x] 1.1 Install dependencies: `@tanstack/react-query`, `next-themes`, `lucide-react`, `dayjs` + `dayjs-jalali`, and shadcn/ui CLI
- [x] 1.2 Initialize shadcn/ui and add primitives: button, input, card, dialog, select, slider, switch, tabs, badge, skeleton, pagination
- [x] 1.3 Add Vazirmatn font and wire it into the root layout
- [x] 1.4 Configure Tailwind v4 theme tokens (bg, surface, accent `#9CE800`, text, border, radii) for dark and light
- [x] 1.5 Configure `next.config` image remote patterns for `image.tmdb.org`
- [x] 1.6 Add `.env.example` with `TMDB_ACCESS_TOKEN` and image base URL; document required vars
- [x] 1.7 Create folder structure: `features/`, `components/{ui,media,layout,filters}`, `services/{tmdb,mock}`, `hooks/`, `lib/`, `types/`, `constants/`

## 2. Data Layer (tmdb-data-layer)

- [x] 2.1 Add `types/tmdb.ts` with strict types for movie, tv, list response, genre, video, credits
- [x] 2.2 Implement `services/tmdb/client.ts` env-based fetch wrapper (fails fast on missing creds, requests `fa` with fallback)
- [x] 2.3 Implement endpoint modules: movies, tv, discover, search, genres, details (with `append_to_response`)
- [x] 2.4 Set up TanStack Query provider and `lib/queryClient.ts`
- [x] 2.5 Implement query hooks in `hooks/` for lists, details, search, genres, recommendations
- [x] 2.6 Implement `services/mock/` typed boundary: download rows, dubbing info, like/dislike counts, captcha, social links
- [x] 2.7 Add `lib/jalali.ts` (Gregorian→Jalali) and Persian-digit formatting util

## 3. App Shell (app-shell)

- [x] 3.1 Build RTL root layout (`dir="rtl"`, `lang="fa"`) with theme + query providers
- [x] 3.2 Build Navbar: logo, search control, theme switcher, notifications icon, auth CTA
- [x] 3.3 Build Footer with copyright and three social buttons (بله / تلگرام / اینستاگرام)
- [x] 3.4 Implement theme switcher via `next-themes` (dark default, persisted) and derive light-theme tokens

## 4. Shared Media Components

- [x] 4.1 Build MediaCard (2:3 poster, CC badge, dubbing-mic badge, IMDb badge, year+calendar badge, title, subtitle)
- [x] 4.2 Build CardGrid (responsive 2→4→6→8 columns) with empty state
- [x] 4.3 Build CarouselRow (heading, "مشاهده همه", horizontal scroll + arrow controls) with skeleton loading
- [x] 4.4 Build Pagination (numbered, accent-highlighted active page, URL-driven)
- [x] 4.5 Build shared badges and skeleton card

## 5. Home (home)

- [x] 5.1 Build HeroCarousel (featured backdrop, title, rating/year badges, selectable thumbnail strip)
- [x] 5.2 Define category→endpoint map in `constants/` for all reference rows
- [x] 5.3 Assemble Home page with all category CarouselRows wired to their queries
- [x] 5.4 Wire "مشاهده همه" links to Category pages

## 6. Title Details (title-details)

- [x] 6.1 Build detail hero header (blurred backdrop, poster, title+year, rating cluster, genre, metadata row with dash placeholders)
- [x] 6.2 Render Jalali screening/release dates
- [x] 6.3 Build actions: trailer (opens TMDB video), like/dislike counters (mock), dubbing-info action
- [x] 6.4 Build download box (info notes, dubbing banner, per-quality rows with encoder + دانلود مستقیم/پخش آنلاین, report/share) from mock boundary
- [x] 6.5 Build recommended movies/series rows from TMDB recommendations/similar
- [x] 6.6 Wire `app/movie/[id]` and `app/series/[id]` to the shared layout (series shows season/episode)
- [x] 6.7 Apply light theme to the details page per reference

## 7. Catalog (catalog)

- [x] 7.1 Build `app/category/[slug]` page with title and CardGrid
- [x] 7.2 Build SearchBar wired to `/search` and URL params
- [x] 7.3 Build FilterBar (type, genre, sort, scope) with URL-param state
- [x] 7.4 Build expandable FilterPanel (country select, year-range slider 1800–2026, dub/hardsub/recommended toggles)
- [x] 7.5 Wire filters + search + sort into `discover` queries and reflect in URL
- [x] 7.6 Wire numbered pagination to page param
- [x] 7.7 Add empty and loading states

## 8. Auth UI (auth-ui)

- [x] 8.1 Build auth tabbed card shell (ورود / عضویت pill tabs, accent active) with "بازگشت به صفحه اصلی"
- [x] 8.2 Build Login form (username, password, captcha image, submit, forgot-password) — presentational only
- [x] 8.3 Build Register form (username, phone, email, password, repeat-password, captcha, submit) — presentational only
- [x] 8.4 Wire `app/login` and `app/register` routes

## 9. Theming, Responsive & Polish

- [x] 9.1 Verify dark and light themes across all pages against the palette
- [x] 9.2 Verify responsive breakpoints (grid, carousels, navbar collapse, details stacking)
- [x] 9.3 Add loading skeletons, empty states, and error states everywhere data is fetched
- [x] 9.4 Verify hover/active/focus/disabled states on cards, buttons, tabs, inputs
- [x] 9.5 Accessibility pass (semantic HTML, alt text via next/image, keyboard nav, focus rings)
- [x] 9.6 Performance pass (next/image usage, Server Components, query caching) and strict-TypeScript/no-`any` check
