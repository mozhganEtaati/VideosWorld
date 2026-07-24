import { PersonFilmography } from "@/components/person/person-filmography";
import type { MediaType } from "@/types/tmdb";

export default async function PersonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; kind?: string }>;
}) {
  const { id } = await params;
  const { name, kind } = await searchParams;
  const initialKind: MediaType = kind === "tv" ? "tv" : "movie";

  return (
    <PersonFilmography
      personId={Number(id)}
      name={name ?? ""}
      initialKind={initialKind}
    />
  );
}
