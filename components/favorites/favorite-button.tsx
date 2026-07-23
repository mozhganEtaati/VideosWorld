"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useUser, type FavoriteItem } from "@/components/providers/user-provider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  item: FavoriteItem;
  variant?: "icon" | "labeled";
  className?: string;
}

/** Toggle a title in the client-side favorites list. Redirects to login if
 *  the user isn't signed in. */
export function FavoriteButton({ item, variant = "icon", className }: FavoriteButtonProps) {
  const { user, isFavorite, toggleFavorite } = useUser();
  const router = useRouter();
  const active = isFavorite(item.id);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggleFavorite(item);
  };

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handle}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-colors",
          active
            ? "border-accent bg-accent/10 text-accent"
            : "border-border text-foreground hover:bg-surface-2",
          className,
        )}
      >
        <Heart className={cn("h-4 w-4", active && "fill-current")} />
        {active ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={active ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75",
        active && "text-accent",
        className,
      )}
    >
      <Heart className={cn("h-[18px] w-[18px]", active && "fill-current")} />
    </button>
  );
}
