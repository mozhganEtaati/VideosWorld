"use client";

import * as React from "react";
import {
  MessageSquare,
  Send,
  ThumbsUp,
  ThumbsDown,
  CornerDownLeft,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { toPersianDigits } from "@/lib/jalali";
import { cn } from "@/lib/utils";
import type { Comment, Reply } from "@/services/mock";

type Vote = "like" | "dislike";
type Item = Comment | Reply;

function avatarStyle(name: string): React.CSSProperties {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  const hue = Math.abs(hash) % 360;
  return { backgroundColor: `hsl(${hue} 55% 30%)`, color: `hsl(${hue} 70% 82%)` };
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("");
}

/** Comments with like/dislike and one level of replies. UI only, no backend. */
export function CommentsSection({ comments: seed }: { comments: Comment[] }) {
  const [comments, setComments] = React.useState<Comment[]>(seed);
  const [votes, setVotes] = React.useState<Record<string, Vote>>({});
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

  const toggleVote = (id: string, kind: Vote) =>
    setVotes((v) => {
      const next = { ...v };
      if (next[id] === kind) delete next[id];
      else next[id] = kind;
      return next;
    });

  const addComment = (name: string, text: string) =>
    setComments((cs) => [
      {
        id: `me-${Date.now()}`,
        name: name || "کاربر مهمان",
        date: "همین حالا",
        text,
        likes: 0,
        dislikes: 0,
        replies: [],
      },
      ...cs,
    ]);

  const addReply = (commentId: string, name: string, text: string) => {
    setComments((cs) =>
      cs.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `me-${Date.now()}`,
                  name: name || "کاربر مهمان",
                  date: "همین حالا",
                  text,
                  likes: 0,
                  dislikes: 0,
                },
              ],
            }
          : c,
      ),
    );
    setReplyingTo(null);
  };

  return (
    <section>
      <SectionHeading icon={MessageSquare}>
        نظرات کاربران ({toPersianDigits(total)})
      </SectionHeading>

      <CommentForm onSubmit={addComment} placeholder="نظرت رو دربارهٔ این عنوان بنویس..." />

      <ul className="mt-6 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-xl border border-border bg-surface/50 p-4">
            <CommentBody
              item={c}
              vote={votes[c.id]}
              onVote={toggleVote}
              onReply={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
            />

            {replyingTo === c.id && (
              <div className="mt-3 ps-13">
                <CommentForm
                  compact
                  onSubmit={(n, t) => addReply(c.id, n, t)}
                  placeholder="پاسختو بنویس..."
                />
              </div>
            )}

            {c.replies.length > 0 && (
              <ul className="mt-3 space-y-3 border-s-2 border-border ps-4">
                {c.replies.map((r) => (
                  <li key={r.id}>
                    <CommentBody item={r} vote={votes[r.id]} onVote={toggleVote} small />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CommentBody({
  item,
  vote,
  onVote,
  onReply,
  small,
}: {
  item: Item;
  vote: Vote | undefined;
  onVote: (id: string, kind: Vote) => void;
  onReply?: () => void;
  small?: boolean;
}) {
  const likeCount = item.likes + (vote === "like" ? 1 : 0);
  const dislikeCount = item.dislikes + (vote === "dislike" ? 1 : 0);

  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full font-bold",
          small ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm",
        )}
        style={avatarStyle(item.name)}
      >
        {initials(item.name)}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{item.name}</span>
          <span className="text-xs text-muted">{item.date}</span>
        </div>
        <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={() => onVote(item.id, "like")}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              vote === "like" ? "text-accent" : "text-muted hover:text-foreground",
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {toPersianDigits(likeCount)}
          </button>
          <button
            type="button"
            onClick={() => onVote(item.id, "dislike")}
            className={cn(
              "flex items-center gap-1 text-xs transition-colors",
              vote === "dislike" ? "text-red-500" : "text-muted hover:text-foreground",
            )}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {toPersianDigits(dislikeCount)}
          </button>
          {onReply && (
            <button
              type="button"
              onClick={onReply}
              className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-foreground"
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
              پاسخ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentForm({
  onSubmit,
  placeholder,
  compact,
}: {
  onSubmit: (name: string, text: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  const [name, setName] = React.useState("");
  const [text, setText] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(name.trim(), text.trim());
    setName("");
    setText("");
  };

  return (
    <form
      onSubmit={submit}
      className={cn("rounded-2xl border border-border bg-surface", compact ? "p-3" : "p-4")}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="نام شما (اختیاری)"
        className="mb-2 h-10 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="w-full resize-none rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      />
      <div className="mt-2 flex justify-start">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground hover:brightness-95"
        >
          <Send className="h-4 w-4" />
          {compact ? "ارسال پاسخ" : "ثبت نظر"}
        </button>
      </div>
    </form>
  );
}
