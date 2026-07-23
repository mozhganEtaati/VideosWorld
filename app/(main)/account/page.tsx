"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, User, Mail, Phone } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/jalali";

export default function AccountPage() {
  const { user, favorites, logout, ready } = useUser();
  const router = useRouter();

  if (!ready) return <div className="min-h-[40vh]" />;

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <User className="mb-4 h-12 w-12 text-accent" />
        <h1 className="text-xl font-bold">وارد حساب کاربری نشده‌اید</h1>
        <Button asChild className="mt-5">
          <Link href="/login">ورود / ثبت‌نام</Link>
        </Button>
      </div>
    );
  }

  const doLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.username}</CardTitle>
            <p className="text-sm text-muted">حساب کاربری فیلم۲مدیا</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow icon={User} label="نام کاربری" value={user.username} />
          <InfoRow icon={Mail} label="ایمیل" value={user.email || "—"} />
          <InfoRow icon={Phone} label="تلفن همراه" value={user.phone || "—"} />

          <div className="flex flex-wrap gap-3 pt-3">
            <Button asChild variant="secondary">
              <Link href="/favorites">
                <Heart className="h-4 w-4 text-accent" />
                علاقه‌مندی‌ها ({toPersianDigits(favorites.length)})
              </Link>
            </Button>
            <Button variant="destructive" onClick={doLogout}>
              <LogOut className="h-4 w-4" />
              خروج از حساب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2/50 px-4 py-3">
      <Icon className="h-4 w-4 text-accent" />
      <span className="text-sm text-muted">{label}:</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
