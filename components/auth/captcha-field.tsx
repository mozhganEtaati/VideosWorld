"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCaptcha } from "@/services/mock";
import { toPersianDigits } from "@/lib/jalali";

/** Captcha field: mock distorted-code image + input (no verification). */
export function CaptchaField() {
  // Generate on the client only, to avoid a hydration mismatch.
  const [code, setCode] = React.useState<string>("•••••");
  React.useEffect(() => setCode(getCaptcha()), []);

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3">
      <button
        type="button"
        onClick={() => setCode(getCaptcha())}
        aria-label="تولید کد جدید"
        className="relative flex h-12 w-32 items-center justify-center overflow-hidden rounded-lg bg-[#3a4a12] font-mono text-xl tracking-widest text-accent"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
      >
        <span className="skew-x-6 select-none italic">{toPersianDigits(code)}</span>
        <RotateCw className="absolute bottom-1 left-1 h-3 w-3 text-white/50" />
      </button>
      <Input placeholder="کد امنیتی" aria-label="کد امنیتی" />
    </div>
  );
}
