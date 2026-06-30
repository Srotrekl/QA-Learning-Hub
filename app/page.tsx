import { getAllTopics } from "@/lib/topics";
import { TopicCard } from "@/components/TopicCard";

export default async function HomePage() {
  const topics = await getAllTopics();

  // Show AI/LLM topic first (differentiator), then the rest
  const sorted = [
    ...topics.filter((t) => t.category === "ai-testing"),
    ...topics.filter((t) => t.category !== "ai-testing"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-12 sm:py-16">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              ✓ available for hire
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            QA Automation Engineer
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Playwright · API testing · CI/CD · AI/LLM security — each topic below is interactive:
            explanation, live code, and a quiz.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#topics"
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              Browse topics ↓
            </a>
            <a
              href="https://github.com/Srotrekl"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-[var(--color-border)] px-4 py-2 font-mono text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
            >
              GitHub / CV →
            </a>
          </div>
        </div>
      </section>

      {/* Topics grid */}
      <section id="topics" aria-labelledby="topics-heading">
        <h2
          id="topics-heading"
          className="mb-6 font-mono text-xs font-semibold tracking-widest text-[var(--color-text-muted)] uppercase"
        >
          Topics — {topics.length} available
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </>
  );
}
