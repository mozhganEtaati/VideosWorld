interface SectionHeadingProps {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

/** Eyebrow-style section heading: accent icon + title + fading divider. */
export function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Icon className="h-5 w-5 text-accent" />
      <h2 className="text-lg font-bold">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
    </div>
  );
}
