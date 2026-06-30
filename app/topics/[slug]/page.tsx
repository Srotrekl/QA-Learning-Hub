import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getTopicBySlug } from "@/lib/topics";
import { TopicTabs } from "@/components/TopicTabs";
import { Breadcrumb } from "@/components/Breadcrumb";

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
    openGraph: {
      title: `${topic.title} | QA Learning Hub`,
      description: topic.summary,
      type: "article",
      url: `https://qa-learning-hub.vercel.app/topics/${slug}`,
      images: [
        {
          url: `/topics/${slug}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: topic.title,
        },
      ],
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);

  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-3xl py-4">
      <Breadcrumb slug={topic.slug} />

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
