/**
 * Mock-data boundary — everything the reference UI shows that TMDB does NOT
 * provide. This is intentionally isolated: a real backend can replace this
 * module without touching any TMDB-backed code. All values are display-only.
 */

export interface DownloadRow {
  quality: string; // e.g. "WEB-DL 1080p"
  encoder: string; // e.g. "unknown" / "GapFilm"
  note?: string; // e.g. "دوبله گپ فیلم"
  isDub?: boolean; // audio-only Persian-dub row
}

export interface DownloadBox {
  banner: string;
  notes: string[];
  rows: DownloadRow[];
}

/** Static download box matching the reference detail page. */
export function getDownloadBox(): DownloadBox {
  return {
    banner: "دوبله فارسی بدون حذفیات (دو زبانه)",
    notes: [
      "پخش آنلاین ۱ تنها با مرورگر کروم امکان‌پذیر است.",
      "پخش آنلاین ۲ با نصب پلیر KMPlayer امکان‌پذیر است.",
      "خطای ۵۰۳ هنگام دانلود حتما فیلترشکن را خاموش نمایید.",
    ],
    rows: [
      { quality: "WEB-DL 1080p", encoder: "unknown" },
      { quality: "WEB-DL 720p", encoder: "unknown" },
      { quality: "WEB-DL 480p", encoder: "unknown" },
      { quality: "صوت دوبله فارسی", encoder: "GapFilm", note: "دوبله گپ فیلم", isDub: true },
    ],
  };
}

export interface DubbingInfo {
  label: string; // caption under the title / suffix on cards
}

/** Deterministic pseudo like/dislike counts from an id (display-only). */
export function getReactions(id: number): { likes: number; dislikes: number } {
  return { likes: (id % 9) + 1, dislikes: id % 3 };
}

/** Social links shown in the footer. `gradient` is a CSS background image. */
export const SOCIAL_LINKS = [
  {
    key: "bale",
    label: "پیام‌رسان بله",
    href: "https://ble.ir/film2media_plus",
    gradient: "linear-gradient(90deg, #8fc7ec 0%, #5aa9e0 100%)",
  },
  {
    key: "telegram",
    label: "کانال تلگرام",
    href: "https://t.me/film2media_plus",
    gradient: "linear-gradient(90deg, #8fc7ec 0%, #5aa9e0 100%)",
  },
  {
    key: "instagram",
    label: "صفحه اینستاگرام",
    href: "https://www.instagram.com/film2media_plus",
    gradient: "linear-gradient(90deg, #f39152 0%, #f06a72 100%)",
  },
] as const;

/** Placeholder captcha value (backend will issue a real one later). */
export function getCaptcha(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export interface Reply {
  id: string;
  name: string;
  date: string;
  text: string;
  likes: number;
  dislikes: number;
}

export interface Comment {
  id: string;
  name: string;
  date: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: Reply[];
}

const COMMENT_POOL: Pick<Comment, "name" | "date" | "text">[] = [
  {
    name: "علی رضایی",
    date: "۳ روز پیش",
    text: "فیلم فوق‌العاده‌ای بود، بازی‌ها عالی و داستان گیرا. حتماً ببینید!",
  },
  {
    name: "مریم احمدی",
    date: "۱ هفته پیش",
    text: "کارگردانی خیلی خوب بود ولی ریتم وسط فیلم یک‌کم کند شد.",
  },
  {
    name: "رضا مقدم",
    date: "۲ هفته پیش",
    text: "موسیقی متنش واقعاً نشست به دلم. یکی از بهترین‌های امسال.",
  },
  {
    name: "سارا کریمی",
    date: "دیروز",
    text: "دوبله فارسی‌ش هم خیلی تمیز بود. ممنون از سایت خوبتون 🙏",
  },
  {
    name: "امیر حسینی",
    date: "۵ روز پیش",
    text: "پایان‌بندیش غافلگیرم کرد! اصلاً انتظار نداشتم.",
  },
  {
    name: "نگار سلطانی",
    date: "۴ روز پیش",
    text: "کیفیت تصویر عالی بود و بدون قطعی پخش شد. عالی بود.",
  },
];

const REPLY_POOL: Omit<Reply, "id" | "likes" | "dislikes">[] = [
  { name: "مدیر سایت", date: "۲ روز پیش", text: "ممنون از نظرتون! خوشحالیم که راضی بودید 🌟" },
  { name: "حسین نوری", date: "۱ روز پیش", text: "کاملاً موافقم، منم دقیقاً همین حس رو داشتم." },
];

/** A few deterministic fake comments per title (display-only, no backend). */
export function getComments(id: number): Comment[] {
  const count = (id % 3) + 2; // 2..4 comments
  const start = id % COMMENT_POOL.length;
  return Array.from({ length: count }, (_, i) => {
    const c = COMMENT_POOL[(start + i) % COMMENT_POOL.length];
    // seed a reply on the first comment for realism
    const replies: Reply[] =
      i === 0
        ? [
            {
              ...REPLY_POOL[id % REPLY_POOL.length],
              id: `${id}-${i}-r0`,
              likes: (id + 1) % 6,
              dislikes: id % 2,
            },
          ]
        : [];
    return {
      ...c,
      id: `${id}-${i}`,
      likes: (id + i * 3) % 14,
      dislikes: (id + i) % 4,
      replies,
    };
  });
}
