import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand wordmark: "فیلم۲مدیا" — reads right-to-left as فیلم / ۲ / مدیا.
 * The "۲" is a glowing lime chip, the site's signature mark.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="فیلم۲مدیا — صفحه اصلی"
      className={cn("group flex items-center gap-1.5", className)}
    >
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        فیلم
      </span>
      <span
        className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-lg font-black text-black transition-transform duration-300 group-hover:scale-110"
        style={{ boxShadow: "0 0 18px rgba(156,232,0,0.55)" }}
      >
        ۲
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        مدیا
      </span>
    </Link>
  );
}
