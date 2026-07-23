"use client";

import Link from "next/link";
import { Menu, Heart, Search, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NAV_LINKS } from "./nav-links";
import { useUser } from "@/components/providers/user-provider";

/** Hamburger navigation for small screens (below lg). */
export function MobileMenu() {
  const { user } = useUser();

  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="منو"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <Menu className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-52">
          {NAV_LINKS.map((l) => (
            <DropdownMenuItem key={l.href} asChild>
              <Link href={l.href}>{l.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/category/latest-movies">
              <Search className="h-4 w-4" />
              جستجو
            </Link>
          </DropdownMenuItem>
          {user && (
            <DropdownMenuItem asChild>
              <Link href="/favorites">
                <Heart className="h-4 w-4 text-accent" />
                علاقه‌مندی‌ها
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem disabled>
            <Bell className="h-4 w-4" />
            اعلان‌ها
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
