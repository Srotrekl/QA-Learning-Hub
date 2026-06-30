"use client";

import { motion } from "framer-motion";
import type { Topic } from "@/lib/types";
import { TopicCard } from "@/components/TopicCard";
import { useT } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function AnimatedHero() {
  const t = useT();
  return (
    <motion.div
      className="flex flex-col gap-4"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.4, ease: "easeOut" }}>
        <span className="font-mono text-xs text-[var(--color-accent)]">{t.hero.badge}</span>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl"
      >
        {t.hero.title}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)]"
      >
        {t.hero.subtitle}
      </motion.p>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap gap-3 pt-2"
      >
        <a
          href="#topics"
          className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {t.hero.browseTopics}
        </a>
        <a
          href="https://github.com/Srotrekl"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-[var(--color-border)] bg-transparent px-4 py-2 font-mono text-sm text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-border)] hover:text-[var(--color-text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {t.hero.githubCv}
        </a>
      </motion.div>
    </motion.div>
  );
}

export function TopicsSectionHeading({ count }: { count: number }) {
  const t = useT();
  return (
    <h2
      id="topics-heading"
      className="mb-6 font-mono text-xs font-semibold tracking-widest text-[var(--color-text-muted)] uppercase"
    >
      {t.topics.heading(count)}
    </h2>
  );
}

export function AnimatedTopicGrid({ topics }: { topics: Topic[] }) {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*:last-child:nth-child(3n+1)]:sm:col-span-2 [&>*:last-child:nth-child(3n+1)]:lg:col-span-1 [&>*:last-child:nth-child(3n+1)]:lg:col-start-2"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
    >
      {topics.map((topic) => (
        <motion.div
          key={topic.slug}
          variants={fadeUp}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <TopicCard topic={topic} />
        </motion.div>
      ))}
    </motion.div>
  );
}
