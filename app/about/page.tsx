import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Steve Rotrekl — QA Automation Engineer specializing in Playwright, API testing, CI/CD, and AI/LLM security testing.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-text-primary)]">About</h1>

      <div className="flex flex-col gap-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          I&apos;m Steve Rotrekl, a QA Automation Engineer transitioning from automotive QA to
          software testing. I work with Playwright, pytest, REST API testing, and GitHub Actions
          CI/CD.
        </p>
        <p>
          What sets me apart: I also test{" "}
          <span className="text-purple-400">AI and LLM systems</span> for security vulnerabilities —
          prompt injection, PII leakage, jailbreaks — an area most QA engineers haven&apos;t touched
          yet.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <a
            href="https://github.com/Srotrekl"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--color-accent)] hover:underline"
          >
            github.com/Srotrekl →
          </a>
        </div>
      </div>
    </div>
  );
}
