"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/category/latest-movies", label: "فیلم‌ها" },
  { href: "/category/latest-series", label: "سریال‌ها" },
  { href: "/categories", label: "دسته‌بندی" },
];

/** Primary navigation with an animated, glowing accent underline. */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 lg:flex">
      {NAV_LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative px-3 py-2 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {link.label}
            <span
              className={cn(
                "absolute inset-x-3 -bottom-0.5 h-0.5 origin-center rounded-full bg-accent transition-transform duration-300 motion-reduce:transition-none",
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
              style={{ boxShadow: "0 0 8px var(--accent)" }}
            />
          </Link>
        );
      })}
    </nav>
  );
}
