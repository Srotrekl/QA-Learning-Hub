"use client";

import { useLanguage } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "cs" : "en")}
      aria-label={lang === "en" ? "Přepnout na češtinu" : "Switch to English"}
      className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      {lang === "en" ? "CZ" : "EN"}
    </button>
  );
}
