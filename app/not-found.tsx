import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="mb-2 font-mono text-4xl font-bold text-[var(--color-fail)]">404</p>
      <p className="mb-1 font-mono text-sm text-[var(--color-text-muted)]">test: FAILED</p>
      <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
        This page does not exist. Expected: a valid route. Got: nothing.
      </p>
      <Link
        href="/"
        className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0d1117] hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        ← Back to topics
      </Link>
    </div>
  );
}
