import { getAllTopics } from "@/lib/topics";
import { AnimatedHero, AnimatedTopicGrid } from "@/components/HomeAnimations";

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
        <AnimatedHero />
      </section>

      {/* Topics grid */}
      <section id="topics" aria-labelledby="topics-heading">
        <h2
          id="topics-heading"
          className="mb-6 font-mono text-xs font-semibold tracking-widest text-[var(--color-text-muted)] uppercase"
        >
          Topics — {topics.length} available
        </h2>

        <AnimatedTopicGrid topics={sorted} />
      </section>
    </>
  );
}
