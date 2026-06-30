"use client";

import { useT } from "@/lib/i18n";

export function Breadcrumb({ slug }: { slug: string }) {
  const t = useT();
  return (
    <div className="mb-2 flex items-center gap-2">
      <a
        href="/"
        className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
      >
        {t.breadcrumb.topics}
      </a>
      <span className="text-[var(--color-text-muted)]">/</span>
      <span className="font-mono text-xs text-[var(--color-text-secondary)]">{slug}</span>
    </div>
  );
}
