import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangToggle } from "@/components/LangToggle";
import { NavLinks } from "@/components/NavLinks";
import { FooterText } from "@/components/FooterText";
import { LanguageProvider } from "@/lib/i18n";
import { ProgressProvider } from "@/lib/ProgressContext";
import { GlobalProgressBar } from "@/components/GlobalProgressBar";

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
        <LanguageProvider>
        <ProgressProvider>
        {/* Skip-to-content for keyboard / screen reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-semibold focus:text-[#0d1117] focus:outline-none"
        >
          Skip to main content
        </a>
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-base)]/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <a
              href="/"
              className="font-mono text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] rounded-sm"
            >
              <span className="text-[var(--color-accent)]">&#9654;</span> qa-hub
            </a>
            <nav className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:contents">
                <NavLinks />
              </span>
              <LangToggle />
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <GlobalProgressBar />

        <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-[var(--color-border)] py-6">
          <FooterText />
        </footer>
        </ProgressProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
