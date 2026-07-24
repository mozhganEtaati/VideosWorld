import Image from "next/image";
import { Clock, CalendarDays, Globe } from "lucide-react";
import { CarouselRow } from "@/components/media/carousel-row";
import { ReactionButtons } from "./reaction-buttons";
import { TrailerSection } from "./trailer-section";
import {
  TrailerRevealProvider,
  TrailerToggleButton,
  TrailerPanel,
  TrailerCloseButton,
} from "./trailer-reveal";
import { CastRow } from "./cast-row";
import { CommentsSection } from "./comments-section";
import { FavoriteButton } from "@/components/favorites/favorite-button";
import type { FavoriteItem } from "@/components/providers/user-provider";
import { backdropOriginalUrl, posterUrl } from "@/services/tmdb/images";
import { formatJalali, yearOf, toPersianDigits } from "@/lib/jalali";
import { getReactions, getComments } from "@/services/mock";
import { GENRES_FA } from "@/constants/config";
import type { MediaType, TmdbDetail } from "@/types/tmdb";

interface DetailViewProps {
  detail: TmdbDetail;
  mediaType: MediaType;
}

function Chip({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-2.5 py-1 text-xs text-foreground backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {children}
    </span>
  );
}

export function DetailView({ detail, mediaType }: DetailViewProps) {
  const title = detail.title ?? detail.name ?? "";
  const year = yearOf(detail.release_date ?? detail.first_air_date);
  const backdrop = backdropOriginalUrl(detail.backdrop_path);
  const poster = posterUrl(detail.poster_path);
  const runtime = detail.runtime ?? detail.episode_run_time?.[0];
  const country = detail.production_countries?.[0]?.name ?? "—";
  const genres = detail.genres?.map((g) => GENRES_FA[g.id] ?? g.name) ?? [];
  const imdb = detail.vote_average ? detail.vote_average.toFixed(1) : "—";
  const percent = detail.vote_average
    ? `${Math.round(detail.vote_average * 10)}%`
    : "—";
  const reactions = getReactions(detail.id);
  const comments = getComments(detail.id);
  const cast = detail.credits?.cast ?? [];

  const favItem: FavoriteItem = {
    id: detail.id,
    media_type: mediaType,
    title: detail.title,
    name: detail.name,
    poster_path: detail.poster_path,
    vote_average: detail.vote_average,
    release_date: detail.release_date,
    first_air_date: detail.first_air_date,
  };

  const recommendations = detail.recommendations?.results ?? [];
  const similar = detail.similar?.results ?? [];

  return (
    <TrailerRevealProvider>
      {/* cinematic hero */}
      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-[460px] md:h-[560px]">
          {backdrop && (
            <Image src={backdrop} alt="" fill priority className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/25" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-4 pb-8 pt-[240px] md:pt-[320px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* poster */}
            <div className="relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 md:w-52">
              {poster ? (
                <Image src={poster} alt={title} fill sizes="208px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-2 text-xs text-muted">
                  بدون تصویر
                </div>
              )}
            </div>

            {/* info */}
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white drop-shadow md:text-4xl">
                {title}{" "}
                <span className="text-2xl font-normal text-white/60">
                  {toPersianDigits(year)}
                </span>
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-imdb px-2.5 py-1 text-xs font-bold text-black">
                  IMDb {toPersianDigits(imdb)}
                </span>
                <span className="rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
                  {toPersianDigits(percent)}
                </span>
                {runtime ? (
                  <Chip icon={Clock}>{toPersianDigits(runtime)} دقیقه</Chip>
                ) : null}
                <Chip icon={Globe}>{country}</Chip>
                <Chip icon={CalendarDays}>
                  {formatJalali(detail.release_date ?? detail.first_air_date)}
                </Chip>
                {mediaType === "tv" && detail.number_of_seasons ? (
                  <Chip icon={CalendarDays}>
                    {toPersianDigits(detail.number_of_seasons)} فصل
                  </Chip>
                ) : null}
              </div>

              {genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-accent/40 px-3 py-1 text-xs text-accent"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                {detail.overview || "خلاصه‌ای برای این عنوان ثبت نشده است."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <TrailerToggleButton className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground transition hover:brightness-95" />
                <FavoriteButton item={favItem} variant="labeled" />
                <ReactionButtons likes={reactions.likes} dislikes={reactions.dislikes} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] space-y-10 px-4 pb-10">
        <TrailerPanel>
          <TrailerSection
            backdrop={backdrop}
            title={title}
            action={<TrailerCloseButton />}
          />
        </TrailerPanel>

        <CastRow cast={cast} />

        {recommendations.length > 0 && (
          <CarouselRow title="پیشنهادها" items={recommendations} />
        )}
        {similar.length > 0 && (
          <CarouselRow title="عناوین مشابه" items={similar} />
        )}

        <CommentsSection comments={comments} />
      </div>
    </TrailerRevealProvider>
  );
}
