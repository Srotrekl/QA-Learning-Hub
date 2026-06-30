"use client";

import { useT } from "@/lib/i18n";

export function NavLinks() {
  const t = useT();
  return (
    <>
      <a
        href="/about"
        className="text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
      >
        {t.nav.about}
      </a>
      <a
        href="https://github.com/Srotrekl"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
      >
        {t.nav.github}
      </a>
    </>
  );
}
