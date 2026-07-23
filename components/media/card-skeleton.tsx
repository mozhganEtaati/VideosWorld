import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder matching MediaCard dimensions. */
export function CardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
      <Skeleton className="mx-auto mt-1 h-3 w-1/2" />
    </div>
  );
}
