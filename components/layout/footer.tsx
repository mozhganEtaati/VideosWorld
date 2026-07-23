import { ChevronLeft, Send, Camera } from "lucide-react";
import { Logo } from "./logo";
import { BaleIcon } from "@/components/icons/bale-icon";
import { SOCIAL_LINKS } from "@/services/mock";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bale: BaleIcon,
  telegram: Send,
  instagram: Camera,
};

/** Site footer: social CTA buttons + copyright. */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="me-auto flex max-w-md flex-col gap-3">
          {SOCIAL_LINKS.map((s) => {
            const Icon = ICONS[s.key] ?? Camera;
            return (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundImage: s.gradient }}
              >
                {/* label + brand icon at the start (right in RTL) */}
                <span className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {s.label}
                </span>
                {/* chevron at the end (left in RTL) */}
                <ChevronLeft className="h-5 w-5 opacity-80" />
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-6 text-xs text-muted">
          <p>کلیه حقوق مادی و معنوی این وبسایت متعلق به فیلم۲مدیا می‌باشد.</p>
          <Logo className="text-base" />
        </div>
      </div>
    </footer>
  );
}
