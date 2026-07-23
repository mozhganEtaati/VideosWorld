"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { UserMenu } from "./user-menu";

/** Shows the login CTA when signed out, or the user menu when signed in. */
export function AuthNav() {
  const { user } = useUser();

  if (user) return <UserMenu />;

  return (
    <Link
      href="/login"
      className="group flex items-center gap-2 rounded-full bg-accent px-3 py-2.5 text-sm font-bold text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 motion-reduce:transition-none sm:px-5"
      style={{ boxShadow: "0 0 20px rgba(156,232,0,0.35)" }}
    >
      <LogIn className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">ورود / ثبت‌نام</span>
    </Link>
  );
}
