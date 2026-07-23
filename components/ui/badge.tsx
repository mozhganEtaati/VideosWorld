import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-bold leading-none",
  {
    variants: {
      variant: {
        imdb: "bg-imdb text-black px-1.5 py-1 text-[11px]",
        accent: "bg-accent text-accent-foreground px-2 py-1 text-xs",
        dark: "bg-black/70 text-white px-2 py-1 text-xs backdrop-blur-sm",
        year: "bg-black/60 text-white px-2 py-1 text-[11px] backdrop-blur-sm",
      },
    },
    defaultVariants: { variant: "dark" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
