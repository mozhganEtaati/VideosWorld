import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";
import { NavLinks } from "./nav-links";
import { AuthNav } from "./auth-nav";
import { MobileMenu } from "./mobile-menu";

/** Top navigation: auth + links (start), centered logo, utility cluster (end). */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      <div className="relative border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-4 sm:px-4">
          {/* start (right in RTL): mobile menu + auth + primary links */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <MobileMenu />
            <AuthNav />
            <NavLinks />
          </div>

          {/* center: logo */}
          <Logo />

          {/* end (left in RTL): utility cluster */}
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-surface/50 p-1 backdrop-blur">
            <Link
              href="/category/latest-movies"
              aria-label="جستجو"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:flex"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <ThemeSwitcher />
            <button
              type="button"
              aria-label="اعلان‌ها"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:flex"
            >
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
          </div>
        </div>

        {/* signature: hairline accent glow along the bottom edge */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(156,232,0,0.5), transparent)",
          }}
        />
      </div>
    </header>
  );
}
