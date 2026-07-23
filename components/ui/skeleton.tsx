import { cn } from "@/lib/utils";

/** Pulsing placeholder used for loading states. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-2", className)}
      {...props}
    />
  );
}
