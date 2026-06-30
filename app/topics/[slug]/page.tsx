import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getTopicBySlug } from "@/lib/topics";
import { TopicTabs } from "@/components/TopicTabs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.summary,
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-3xl py-4">
      <div className="mb-2 flex items-center gap-2">
        <a
          href="/"
          className="font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
        >
          ← topics
        </a>
        <span className="text-[var(--color-text-muted)]">/</span>
        <span className="font-mono text-xs text-[var(--color-text-secondary)]">{topic.slug}</span>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">{topic.title}</h1>

      <div className="mb-8 flex gap-2">
        <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]">
          {topic.category}
        </span>
        <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]">
          {topic.difficulty}
        </span>
      </div>

      <TopicTabs topic={topic} />
    </div>
  );
}
