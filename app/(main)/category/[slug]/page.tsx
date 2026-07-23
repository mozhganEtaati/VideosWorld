import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/catalog/catalog-view";
import { getCategory } from "@/constants/config";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <Suspense fallback={null}>
      <CatalogView category={category} />
    </Suspense>
  );
}
