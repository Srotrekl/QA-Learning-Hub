"use client";

import { useProgressContext } from "@/lib/ProgressContext";
import { getAllSlugs } from "@/lib/topics";

const TOTAL_TOPICS = getAllSlugs().length;

export function GlobalProgressBar() {
  const { completed } = useProgressContext();
  const count = completed.size;
  const pct = Math.round((count / TOTAL_TOPICS) * 100);

  if (count === 0) return null;

  return (
    <div
      className="h-0.5 w-full bg-[var(--color-border)]"
      role="progressbar"
      aria-label={`${count} of ${TOTAL_TOPICS} topics completed`}
      aria-valuenow={count}
      aria-valuemin={0}
      aria-valuemax={TOTAL_TOPICS}
    >
      <div
        className="h-full bg-[var(--color-pass)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
