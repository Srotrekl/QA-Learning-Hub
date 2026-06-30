import type { Topic } from "./types";

// Topics are dynamically imported from content/topics/*.ts
// Each file must export a default Topic object.
// This loader uses require.context pattern for Next.js SSG.

const topicModules = {
  playwright: () => import("@/content/topics/playwright"),
  "api-testing": () => import("@/content/topics/api-testing"),
  "ai-llm-security": () => import("@/content/topics/ai-llm-security"),
  "pytest-basics": () => import("@/content/topics/pytest-basics"),
  "ci-cd": () => import("@/content/topics/ci-cd"),
  "test-design": () => import("@/content/topics/test-design"),
  "bug-reporting": () => import("@/content/topics/bug-reporting"),
} as const;

export type TopicSlug = keyof typeof topicModules;

export async function getAllTopics(): Promise<Topic[]> {
  const entries = await Promise.all(
    Object.values(topicModules).map((loader) => loader().then((m) => m.default))
  );
  return entries;
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  if (!(slug in topicModules)) return null;
  const mod = await topicModules[slug as TopicSlug]();
  return mod.default;
}

export function getAllSlugs(): TopicSlug[] {
  return Object.keys(topicModules) as TopicSlug[];
}
