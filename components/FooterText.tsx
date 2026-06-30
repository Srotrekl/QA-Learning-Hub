"use client";

import { useT } from "@/lib/i18n";

export function FooterText() {
  const t = useT();
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
      <span className="font-mono text-xs text-[var(--color-text-muted)]">
        {t.footer.name}
      </span>
      <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-pass)]">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-pass)]"
          aria-hidden="true"
        />
        {t.footer.build}
      </span>
    </div>
  );
}
