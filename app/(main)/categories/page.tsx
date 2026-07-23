import { LayoutGrid } from "lucide-react";
import { CategoryTiles } from "@/components/categories/category-tiles";
import { CATEGORIES } from "@/constants/config";

export const metadata = { title: "دسته‌بندی‌ها | فیلم۲مدیا" };

export default function CategoriesPage() {
  const main = CATEGORIES.filter((c) => c.group === "main");
  const genres = CATEGORIES.filter((c) => c.group === "genre");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground">
          <LayoutGrid className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold md:text-3xl">دسته‌بندی‌ها</h1>
          <p className="text-sm text-muted">هر چیزی که دنبالشی، از این‌جا پیداش کن</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold">دسته‌های اصلی</h2>
        <CategoryTiles categories={main} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">ژانرها</h2>
        <CategoryTiles categories={genres} />
      </section>
    </div>
  );
}
