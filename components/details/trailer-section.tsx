import Image from "next/image";
import { Play, Volume2, Maximize, Settings, Film } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { toPersianDigits } from "@/lib/jalali";

interface TrailerSectionProps {
  backdrop: string | null;
  title: string;
  /** Optional control (e.g. a close button) pinned to the player's top corner. */
  action?: React.ReactNode;
}

/**
 * Trailer area rendered as a styled *screenshot* of a video player — a still
 * frame with player chrome. It intentionally does NOT play a real trailer.
 */
export function TrailerSection({ backdrop, title, action }: TrailerSectionProps) {
  return (
    <section>
      <SectionHeading icon={Film}>تریلر</SectionHeading>

      <div
        className="group relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-border"
        style={{ boxShadow: "0 0 60px -20px rgba(156,232,0,0.35)" }}
      >
        {action ? (
          <div className="absolute left-3 top-3 z-20">{action}</div>
        ) : null}
        {backdrop ? (
          <Image
            src={backdrop}
            alt={`تصویری از ${title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 1400px"
            className="object-cover brightness-[.7]"
          />
        ) : (
          <div className="absolute inset-0 bg-surface-2" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />

        {/* center play glyph (decorative) */}
        <div className="absolute inset-0 grid place-items-center">
          <span
            className="grid h-20 w-20 place-items-center rounded-full bg-accent text-black transition-transform duration-300 group-hover:scale-105"
            style={{ boxShadow: "0 0 45px rgba(156,232,0,0.55)" }}
          >
            <Play className="h-8 w-8 translate-x-0.5 fill-current" />
          </span>
        </div>

        {/* fake player controls */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-1/3 rounded-full bg-accent" />
          </div>
          <div className="flex items-center justify-between text-white/90">
            <div className="flex items-center gap-3">
              <Play className="h-4 w-4 fill-current" />
              <Volume2 className="h-4 w-4" />
              <span className="text-xs">
                {toPersianDigits("0:42")} / {toPersianDigits("2:15")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <Maximize className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
