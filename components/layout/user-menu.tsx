"use client";

import Link from "next/link";
import { Heart, User, LogOut, ChevronDown } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toPersianDigits } from "@/lib/jalali";

/** Logged-in user menu: avatar + dropdown (favorites, account, logout). */
export function UserMenu() {
  const { user, favorites, logout } = useUser();
  if (!user) return null;

  const initials =
    user.username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase() || user.username.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-border bg-surface/60 p-1 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:pe-3 sm:ps-1">
          <span className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            {/* logged-in indicator */}
            <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
          </span>
          <span
            dir="ltr"
            className="hidden max-w-36 truncate text-sm font-semibold sm:inline"
          >
            {user.username}
          </span>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-muted sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/favorites">
            <Heart className="h-4 w-4 text-accent" />
            لیست علاقه‌مندی
            <span className="ms-auto rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
              {toPersianDigits(favorites.length)}
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <User className="h-4 w-4" />
            اطلاعات کاربری
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-400 focus:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          خروج از حساب
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
