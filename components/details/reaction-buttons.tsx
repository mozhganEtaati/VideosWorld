"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toPersianDigits } from "@/lib/jalali";
import { cn } from "@/lib/utils";

interface ReactionButtonsProps {
  likes: number;
  dislikes: number;
}

/** Like/dislike counters. Display-only (no backend); toggles locally. */
export function ReactionButtons({ likes, dislikes }: ReactionButtonsProps) {
  const [choice, setChoice] = React.useState<"like" | "dislike" | null>(null);

  const likeCount = likes + (choice === "like" ? 1 : 0);
  const dislikeCount = dislikes + (choice === "dislike" ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setChoice(choice === "like" ? null : "like")}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition-colors",
          choice === "like" ? "bg-accent text-accent-foreground" : "hover:bg-surface-2",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        دوست داشتم ({toPersianDigits(likeCount)})
      </button>
      <button
        type="button"
        onClick={() => setChoice(choice === "dislike" ? null : "dislike")}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition-colors",
          choice === "dislike" ? "bg-red-500 text-white" : "hover:bg-surface-2",
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        دوست نداشتم ({toPersianDigits(dislikeCount)})
      </button>
    </div>
  );
}
