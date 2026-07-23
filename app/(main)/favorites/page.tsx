"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/jalali";

export default function FavoritesPage() {
  const { user, favorites, ready } = useUser();

  if (!ready) return <div className="min-h-[40vh]" />;

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <Heart className="mb-4 h-12 w-12 text-accent" />
        <h1 className="text-xl font-bold">برای دیدن علاقه‌مندی‌ها وارد شوید</h1>
        <p className="mt-2 text-sm text-muted">
          لیست علاقه‌مندی مخصوص کاربران واردشده است.
        </p>
        <Button asChild className="mt-5">
          <Link href="/login">ورود / ثبت‌نام</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="h-6 w-6 fill-accent text-accent" />
        <h1 className="text-2xl font-extrabold md:text-3xl">لیست علاقه‌مندی</h1>
        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-sm text-muted">
          {toPersianDigits(favorites.length)}
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
          <p className="text-muted">هنوز چیزی به علاقه‌مندی‌ها اضافه نکرده‌ای.</p>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/categories">مرور دسته‌بندی‌ها</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
          {favorites.map((f) => (
            <MediaCard key={`${f.media_type}-${f.id}`} item={f} mediaType={f.media_type} />
          ))}
        </div>
      )}
    </div>
  );
}
