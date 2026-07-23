import Link from "next/link";
import {
  Film,
  Tv,
  TrendingUp,
  Globe,
  Flag,
  Sparkles,
  Mic,
  Clock,
  Swords,
  Laugh,
  Theater,
  Ghost,
  Rocket,
  Heart,
  Clapperboard,
  Search,
  Compass,
  Users,
  Flame,
  LayoutGrid,
} from "lucide-react";
import type { CategoryDef } from "@/constants/config";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  film: Film,
  tv: Tv,
  "trending-up": TrendingUp,
  globe: Globe,
  flag: Flag,
  sparkles: Sparkles,
  mic: Mic,
  clock: Clock,
  swords: Swords,
  laugh: Laugh,
  theater: Theater,
  ghost: Ghost,
  rocket: Rocket,
  heart: Heart,
  clapperboard: Clapperboard,
  search: Search,
  compass: Compass,
  users: Users,
  flame: Flame,
};

/** Responsive grid of colorful category tiles (browse style). */
export function CategoryTiles({ categories }: { categories: CategoryDef[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {categories.map((cat) => {
        const Icon = ICONS[cat.icon ?? "film"] ?? LayoutGrid;
        return (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="group relative flex aspect-[16/10] flex-col justify-between overflow-hidden rounded-2xl p-4 md:p-5"
            style={{ backgroundImage: cat.color }}
          >
            <Icon className="relative z-10 h-7 w-7 text-white drop-shadow" />
            <h3 className="relative z-10 text-base font-extrabold text-white drop-shadow md:text-lg">
              {cat.title}
            </h3>
            {/* decorative oversized icon */}
            <Icon className="pointer-events-none absolute -bottom-3 -left-3 h-24 w-24 -rotate-12 text-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
            {/* hover sheen */}
            <div className="absolute inset-0 bg-white/0 transition-colors duration-300 group-hover:bg-white/10" />
          </Link>
        );
      })}
    </div>
  );
}
