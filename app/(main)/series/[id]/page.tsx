import { notFound } from "next/navigation";
import { DetailView } from "@/components/details/detail-view";
import { getDetail } from "@/services/tmdb/endpoints";

export const revalidate = 60;

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const detail = await getDetail("tv", id);
    return <DetailView detail={detail} mediaType="tv" />;
  } catch {
    notFound();
  }
}
