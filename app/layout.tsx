import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QA Learning Hub | Steve Rotrekl",
    template: "%s | QA Learning Hub",
  },
  description:
    "Interactive QA automation portfolio: Playwright, API testing, CI/CD, and AI/LLM security testing - learn by doing.",
  openGraph: {
    title: "QA Learning Hub",
    description:
      "Interactive QA automation portfolio: Playwright, API testing, CI/CD, and AI/LLM security testing.",
    type: "website",
    url: "https://qa-learning-hub.vercel.app",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "QA Learning Hub - Steve Rotrekl",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a
              href="/"
              className="font-mono text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
            >
              <span className="text-[var(--color-accent)]">&#9654;</span> qa-hub
            </a>
            <nav className="flex items-center gap-4">
              <a
                href="/about"
                className="text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
              >
                About
              </a>
              <a
                href="https://github.com/Srotrekl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
              >
                GitHub
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-[var(--color-border)] py-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              Steve Rotrekl &middot; QA Automation Engineer
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-pass)]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-pass)]"
                aria-hidden="true"
              />
              build: passing
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
