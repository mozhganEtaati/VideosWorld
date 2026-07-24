"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { CardGrid } from "@/components/media/card-grid";
import { Pagination } from "@/components/media/pagination";
import { usePersonCredits } from "@/hooks/useTmdb";
import type { MediaType } from "@/types/tmdb";

const PAGE_SIZE = 20;

interface PersonFilmographyProps {
  personId: number;
  name: string;
  initialKind: MediaType;
}

/** Actor filmography: read-only search box with the actor's name, a movie/
 *  series toggle, and a client-side-paginated grid of their credits. */
export function PersonFilmography({
  personId,
  name,
  initialKind,
}: PersonFilmographyProps) {
  const [kind, setKind] = React.useState<MediaType>(initialKind);
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = usePersonCredits(personId, kind);
  const items = data ?? [];
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeKind = (next: MediaType) => {
    setKind(next);
    setPage(1);
  };

  const heading =
    kind === "tv" ? `سریال‌های با حضور ${name}` : `فیلم‌های با حضور ${name}`;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <h1 className="mb-6 text-right text-2xl font-extrabold">{heading}</h1>

      <div className="mb-8 rounded-2xl bg-surface p-4">
        {/* read-only search box showing the actor's name */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={name}
            readOnly
            aria-label="بازیگر"
            className="h-12 w-full rounded-xl border border-border bg-surface-2 px-4 pr-11 text-sm text-foreground"
          />
        </div>

        {/* movie / series toggle */}
        <div className="flex gap-2">
          <KindButton active={kind === "movie"} onClick={() => changeKind("movie")}>
            فیلم‌ها
          </KindButton>
          <KindButton active={kind === "tv"} onClick={() => changeKind("tv")}>
            سریال‌ها
          </KindButton>
        </div>
      </div>

      <CardGrid
        items={pageItems}
        mediaType={kind}
        loading={isLoading}
        emptyLabel={isError ? "خطا در دریافت اطلاعات" : "نتیجه‌ای یافت نشد"}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function KindButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-accent-foreground"
          : "flex h-11 items-center justify-center rounded-xl border border-border bg-surface-2 px-6 text-sm text-foreground hover:bg-surface"
      }
    >
      {children}
    </button>
  );
}
