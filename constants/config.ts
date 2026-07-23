import type { MediaType } from "@/types/tmdb";

/** TMDB image path builder sizes. */
export const IMAGE_SIZES = {
  poster: "w500",
  backdrop: "w1280",
  backdropOriginal: "original",
  thumb: "w300",
} as const;

/** Year range for the catalog year slider (from the reference UI). */
export const YEAR_RANGE = { min: 1800, max: 2026 } as const;

/**
 * Placeholder YouTube trailer shown when a title has no trailer on TMDB.
 * "Big Buck Bunny" — a Creative Commons open movie, safe as a sample.
 */
export const FALLBACK_TRAILER_KEY = "aqz-KE-bpKQ";

/**
 * Category slug → the TMDB query that feeds both the Home row and the
 * Category page. `discover` params approximate the reference groupings.
 */
export interface CategoryDef {
  slug: string;
  title: string;
  mediaType: MediaType;
  /** Static query params merged into the discover/list request. */
  params?: Record<string, string>;
  /** Use a named list endpoint instead of discover. */
  list?: "now_playing" | "on_the_air" | "top_rated" | "popular" | "upcoming";
  /** Shown as a row on the Home page. */
  showOnHome?: boolean;
  /** Grouping on the Categories index page. */
  group?: "main" | "genre";
  /** Lucide icon key (mapped in the Categories page). */
  icon?: string;
  /** CSS gradient for the category tile. */
  color?: string;
}

const POP = "popularity.desc";

export const CATEGORIES: CategoryDef[] = [
  // ---- main categories -----------------------------------------------------
  {
    slug: "latest-movies",
    title: "فیلم‌های به روز شده",
    mediaType: "movie",
    list: "now_playing",
    showOnHome: true,
    group: "main",
    icon: "film",
    color: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  },
  {
    slug: "latest-series",
    title: "سریال‌های به روز شده",
    mediaType: "tv",
    list: "on_the_air",
    showOnHome: true,
    group: "main",
    icon: "tv",
    color: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
  },
  {
    slug: "top-movies-2026",
    title: "برترین فیلم‌های ۲۰۲۶",
    mediaType: "movie",
    params: { primary_release_year: "2026", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "trending-up",
    color: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  {
    slug: "world-series",
    title: "سریال‌های جهانی",
    mediaType: "tv",
    params: { with_original_language: "en", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "globe",
    color: "linear-gradient(135deg,#10b981,#059669)",
  },
  {
    slug: "korean-series",
    title: "سریال‌های کره‌ای",
    mediaType: "tv",
    params: { with_original_language: "ko", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "flag",
    color: "linear-gradient(135deg,#ec4899,#f43f5e)",
  },
  {
    slug: "turkish-series",
    title: "سریال‌های ترکی",
    mediaType: "tv",
    params: { with_original_language: "tr", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "flag",
    color: "linear-gradient(135deg,#ef4444,#b91c1c)",
  },
  {
    slug: "anime",
    title: "انیمه",
    mediaType: "tv",
    params: { with_genres: "16", with_original_language: "ja", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "sparkles",
    color: "linear-gradient(135deg,#8b5cf6,#d946ef)",
  },
  {
    slug: "chinese-series",
    title: "سریال‌های چینی",
    mediaType: "tv",
    params: { with_original_language: "zh", sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "flag",
    color: "linear-gradient(135deg,#f97316,#eab308)",
  },
  {
    slug: "persian-dubbed",
    title: "فیلم‌های دوبله فارسی",
    mediaType: "movie",
    params: { sort_by: POP },
    showOnHome: true,
    group: "main",
    icon: "mic",
    color: "linear-gradient(135deg,#14b8a6,#0ea5e9)",
  },
  {
    slug: "coming-soon",
    title: "بزودی",
    mediaType: "movie",
    list: "upcoming",
    showOnHome: true,
    group: "main",
    icon: "clock",
    color: "linear-gradient(135deg,#64748b,#334155)",
  },
  // ---- genre categories ----------------------------------------------------
  { slug: "action", title: "اکشن", mediaType: "movie", params: { with_genres: "28", sort_by: POP }, group: "genre", icon: "swords", color: "linear-gradient(135deg,#dc2626,#7c2d12)" },
  { slug: "comedy", title: "کمدی", mediaType: "movie", params: { with_genres: "35", sort_by: POP }, group: "genre", icon: "laugh", color: "linear-gradient(135deg,#facc15,#f59e0b)" },
  { slug: "drama", title: "درام", mediaType: "movie", params: { with_genres: "18", sort_by: POP }, group: "genre", icon: "theater", color: "linear-gradient(135deg,#6d28d9,#4c1d95)" },
  { slug: "horror", title: "ترسناک", mediaType: "movie", params: { with_genres: "27", sort_by: POP }, group: "genre", icon: "ghost", color: "linear-gradient(135deg,#1f2937,#111827)" },
  { slug: "sci-fi", title: "علمی‌تخیلی", mediaType: "movie", params: { with_genres: "878", sort_by: POP }, group: "genre", icon: "rocket", color: "linear-gradient(135deg,#0ea5e9,#4338ca)" },
  { slug: "romance", title: "عاشقانه", mediaType: "movie", params: { with_genres: "10749", sort_by: POP }, group: "genre", icon: "heart", color: "linear-gradient(135deg,#f472b6,#db2777)" },
  { slug: "animation", title: "انیمیشن", mediaType: "movie", params: { with_genres: "16", sort_by: POP }, group: "genre", icon: "sparkles", color: "linear-gradient(135deg,#22d3ee,#3b82f6)" },
  { slug: "documentary", title: "مستند", mediaType: "movie", params: { with_genres: "99", sort_by: POP }, group: "genre", icon: "clapperboard", color: "linear-gradient(135deg,#059669,#065f46)" },
  { slug: "crime", title: "جنایی", mediaType: "movie", params: { with_genres: "80", sort_by: POP }, group: "genre", icon: "search", color: "linear-gradient(135deg,#475569,#1e293b)" },
  { slug: "adventure", title: "ماجراجویی", mediaType: "movie", params: { with_genres: "12", sort_by: POP }, group: "genre", icon: "compass", color: "linear-gradient(135deg,#16a34a,#15803d)" },
  { slug: "family", title: "خانوادگی", mediaType: "movie", params: { with_genres: "10751", sort_by: POP }, group: "genre", icon: "users", color: "linear-gradient(135deg,#fb923c,#ea580c)" },
  { slug: "thriller", title: "هیجان‌انگیز", mediaType: "movie", params: { with_genres: "53", sort_by: POP }, group: "genre", icon: "flame", color: "linear-gradient(135deg,#e11d48,#881337)" },
];

/** Categories shown as rows on the Home page. */
export const HOME_CATEGORIES = CATEGORIES.filter((c) => c.showOnHome);

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Persian genre names keyed by TMDB genre id. TMDB has no `fa` translations
 * for genre names (they return null), so we supply them. IDs are stable.
 */
export const GENRES_FA: Record<number, string> = {
  // shared / movie
  28: "اکشن",
  12: "ماجراجویی",
  16: "انیمیشن",
  35: "کمدی",
  80: "جنایی",
  99: "مستند",
  18: "درام",
  10751: "خانوادگی",
  14: "فانتزی",
  36: "تاریخی",
  27: "ترسناک",
  10402: "موسیقی",
  9648: "معمایی",
  10749: "عاشقانه",
  878: "علمی-تخیلی",
  10770: "فیلم تلویزیونی",
  53: "هیجان‌انگیز",
  10752: "جنگی",
  37: "وسترن",
  // tv-specific
  10759: "اکشن و ماجراجویی",
  10762: "کودک",
  10763: "خبری",
  10764: "واقع‌نما",
  10765: "علمی-تخیلی و فانتزی",
  10766: "ملودرام",
  10767: "گفتگومحور",
  10768: "جنگ و سیاست",
};

const MOVIE_GENRE_IDS = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878,
  10770, 53, 10752, 37,
];
const TV_GENRE_IDS = [
  10759, 16, 35, 80, 99, 18, 10751, 10762, 9648, 10763, 10764, 10765, 10766,
  10767, 10768, 37,
];

/** Genre dropdown options (Persian) for a given media type. */
export function genreOptions(mediaType: MediaType) {
  const ids = mediaType === "tv" ? TV_GENRE_IDS : MOVIE_GENRE_IDS;
  return ids.map((id) => ({ value: String(id), label: GENRES_FA[id] ?? "—" }));
}

/**
 * Content "kind" for the catalog's first dropdown. Unlike a raw media type,
 * a kind can carry extra discover params (e.g. anime = animation + Japanese).
 */
export interface ContentKind {
  value: "movie" | "tv" | "anime";
  label: string;
  mediaType: MediaType;
  params: Record<string, string>;
}

export const CONTENT_KINDS: ContentKind[] = [
  { value: "movie", label: "فیلم", mediaType: "movie", params: {} },
  { value: "tv", label: "سریال", mediaType: "tv", params: {} },
  {
    value: "anime",
    label: "انیمه",
    mediaType: "tv",
    params: { with_genres: "16", with_original_language: "ja" },
  },
];

/** Pick the initial kind for a category page. */
export function initialKind(cat: CategoryDef): ContentKind["value"] {
  if (cat.slug === "anime") return "anime";
  return cat.mediaType === "tv" ? "tv" : "movie";
}

/** Sort options shown in the filter bar. */
export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "محبوب‌ترین" },
  { value: "vote_average.desc", label: "بیشترین امتیاز" },
  { value: "primary_release_date.desc", label: "جدیدترین" },
  { value: "primary_release_date.asc", label: "قدیمی‌ترین" },
] as const;

/** Country options for the extended filter panel (subset shown in UI). */
export const COUNTRY_OPTIONS = [
  { value: "US", label: "آمریکا" },
  { value: "KR", label: "کره جنوبی" },
  { value: "TR", label: "ترکیه" },
  { value: "CN", label: "چین" },
  { value: "JP", label: "ژاپن" },
  { value: "GB", label: "انگلستان" },
  { value: "IR", label: "ایران" },
] as const;
