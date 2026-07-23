"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CaptchaField } from "./captcha-field";
import { Logo } from "@/components/layout/logo";
import { useUser } from "@/components/providers/user-provider";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** Tabbed auth card wired to the client-side user store. */
export function AuthCard({ initialMode }: { initialMode: Mode }) {
  const [mode, setMode] = React.useState<Mode>(initialMode);
  const [error, setError] = React.useState<string | null>(null);
  const { login, register } = useUser();
  const router = useRouter();

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
  };

  const onLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = String(data.get("username") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!username || !password) {
      setError("نام کاربری و رمز عبور را وارد کنید.");
      return;
    }
    const res = login(username, password);
    if (!res.ok) return setError(res.error ?? "خطا در ورود");
    router.push("/");
  };

  const onRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = String(data.get("username") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const repeat = String(data.get("repeat") ?? "");
    if (!username || !password) {
      setError("نام کاربری و رمز عبور الزامی است.");
      return;
    }
    if (password !== repeat) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    const res = register({ username, phone, email, password });
    if (!res.ok) return setError(res.error ?? "خطا در ثبت‌نام");
    router.push("/");
  };

  return (
    <Card className="w-full max-w-md rounded-3xl p-6 md:p-8">
      <div className="mb-6 flex justify-center">
        <Logo className="text-2xl" />
      </div>

      {/* pill tabs */}
      <div className="mb-6 flex rounded-full bg-surface-2 p-1">
        <TabButton active={mode === "login"} onClick={() => switchMode("login")}>
          ورود
        </TabButton>
        <TabButton active={mode === "register"} onClick={() => switchMode("register")}>
          عضویت
        </TabButton>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {mode === "register" ? (
        <form className="space-y-4" onSubmit={onRegister} noValidate>
          <Field label="نام کاربری" name="username" />
          <Field label="تلفن همراه" name="phone" inputMode="tel" />
          <Field label="ایمیل شما" name="email" type="email" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="رمز عبور" name="password" type="password" />
            <Field label="تکرار رمز عبور" name="repeat" type="password" />
          </div>
          <CaptchaField />
          <Button type="submit" size="lg" className="w-full">
            ثبت‌نام و ورود
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onLogin} noValidate>
          <Field label="نام کاربری" name="username" />
          <Field label="رمز عبور" name="password" type="password" />
          <CaptchaField />
          <Button type="submit" size="lg" className="w-full">
            ورود به حساب
          </Button>
          <p className="text-center text-sm text-muted">رمز عبورم را فراموش کرده‌ام</p>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-foreground hover:text-accent">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </Card>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} placeholder={label} {...props} />
    </div>
  );
}

function TabButton({
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
      className={cn(
        "flex-1 rounded-full py-3 text-sm font-bold transition-colors",
        active ? "bg-accent text-accent-foreground" : "text-foreground",
      )}
    >
      {children}
    </button>
  );
}
