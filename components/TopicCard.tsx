import Link from "next/link";
import type { Topic } from "@/lib/types";

const categoryColors: Record<Topic["category"], string> = {
  automation: "text-[var(--color-accent)] border-[var(--color-accent)]",
  api: "text-blue-400 border-blue-400",
  performance: "text-orange-400 border-orange-400",
  "ai-testing": "text-purple-400 border-purple-400",
  "ci-cd": "text-yellow-400 border-yellow-400",
  fundamentals: "text-[var(--color-text-secondary)] border-[var(--color-border)]",
};

const difficultyColors: Record<Topic["difficulty"], string> = {
  junior: "text-[var(--color-pass)]",
  medior: "text-yellow-400",
  senior: "text-[var(--color-fail)]",
};

const categoryIcons: Record<Topic["category"], string> = {
  automation: "▶",
  api: "⟨/⟩",
  performance: "⚡",
  "ai-testing": "◈",
  "ci-cd": "⟳",
  fundamentals: "◉",
};

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const isAiTopic = topic.category === "ai-testing";

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={`group flex flex-col gap-3 rounded-lg border bg-[var(--color-bg-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] ${
        isAiTopic
          ? "border-purple-500/40 hover:border-purple-400"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 font-mono text-lg ${categoryColors[topic.category].split(" ")[0]}`}
          aria-hidden="true"
        >
          {categoryIcons[topic.category]}
        </span>
        <div className="min-w-0 flex-1">
          {isAiTopic && (
            <span className="mb-1.5 inline-block rounded-sm border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[10px] text-purple-400">
              ★ WHAT SETS ME APART
            </span>
          )}
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">
            {topic.title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
            {topic.summary}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${categoryColors[topic.category]}`}
        >
          {topic.category}
        </span>
        <span className={`font-mono text-[10px] ${difficultyColors[topic.difficulty]}`}>
          {topic.difficulty}
        </span>
      </div>
    </Link>
  );
}
