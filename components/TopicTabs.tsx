"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Topic } from "@/lib/types";
import { Quiz } from "@/components/Quiz";
import { CodeRunner } from "@/components/CodeRunner";
import { useT, useTopicLang } from "@/lib/i18n";

interface TopicTabsProps {
  topic: Topic;
}

type TabId = "explanation" | "code" | "try" | "quiz";

// ─── Markdown renderer (no external dep — handle headings, bold, inline code, lists) ──
function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => {
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="mt-4 text-sm font-semibold text-[var(--color-text-primary)] first:mt-0"
            >
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-2 text-base font-bold text-[var(--color-text-primary)]">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <ul key={i} className="ml-4 list-disc">
              <li className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                <InlineMarkdown text={line.slice(2)} />
              </li>
            </ul>
          );
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        return (
          <p key={i} className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            <InlineMarkdown text={line} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle **bold** and `code`
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[var(--color-text-primary)]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-[var(--color-bg-elevated)] px-1 py-0.5 font-mono text-xs text-[var(--color-accent)]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT();

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      aria-label="Copy code to clipboard"
      className="font-mono text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
    >
      {copied ? t.code.copied : t.code.copy}
    </button>
  );
}

// ─── Tab panels ───────────────────────────────────────────────────────────────
function ExplanationPanel({ topic }: { topic: Topic }) {
  const t = useT();
  const lang = useTopicLang();
  const cs = lang === "cs" ? topic.cs : undefined;
  const explanation = cs?.explanation ?? topic.explanation;
  const whyItMatters = cs?.whyItMatters ?? topic.whyItMatters;

  return (
    <div className="flex flex-col gap-6">
      <SimpleMarkdown content={explanation} />

      {/* Why it matters box */}
      <div className="rounded-md border border-[var(--color-accent)]/30 bg-[var(--color-accent-dim)] p-4">
        <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          {t.whyItMatters}
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {whyItMatters}
        </p>
      </div>

      {topic.relatedRepoUrl && (
        <a
          href={topic.relatedRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)] transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          {t.viewRelatedRepo}
        </a>
      )}
    </div>
  );
}

function CodePanel({ topic }: { topic: Topic }) {
  const t = useT();
  if (topic.codeExamples.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">{t.code.noExamples}</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {topic.codeExamples.map((example, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              {example.label}
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)]">
                {example.language}
              </span>
              <CopyButton text={example.code} />
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-[var(--color-text-primary)]">
              <code>{example.code}</code>
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}

function TryPanel({ topic }: { topic: Topic }) {
  const t = useT();
  const runnableExamples = topic.codeExamples.filter(
    (e) => e.runnable || e.language === "ts" || e.language === "python",
  );

  if (runnableExamples.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)]">{t.code.noRunnable}</p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {runnableExamples.map((example, i) => (
        <div key={i} className="flex flex-col gap-3">
          <p className="font-mono text-xs text-[var(--color-text-muted)]">{example.label}</p>
          <CodeRunner example={example} />
        </div>
      ))}
    </div>
  );
}

function QuizPanel({ topic }: { topic: Topic }) {
  const t = useT();
  const lang = useTopicLang();
  const questions = (lang === "cs" && topic.cs?.quiz) ? topic.cs.quiz : topic.quiz;

  if (questions.length === 0) {
    return <p className="text-sm text-[var(--color-text-muted)]">{t.quiz.noQuiz}</p>;
  }

  return <Quiz questions={questions} slug={topic.slug} />;
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TopicTabs({ topic }: TopicTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("explanation");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const t = useT();

  const TABS: { id: TabId; label: string }[] = [
    { id: "explanation", label: t.tabs.explanation },
    { id: "code", label: t.tabs.code },
    { id: "try", label: t.tabs.tryIt },
    { id: "quiz", label: t.tabs.quiz },
  ];

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let next = index;
      if (e.key === "ArrowRight") {
        next = (index + 1) % TABS.length;
      } else if (e.key === "ArrowLeft") {
        next = (index - 1 + TABS.length) % TABS.length;
      } else if (e.key === "Home") {
        next = 0;
      } else if (e.key === "End") {
        next = TABS.length - 1;
      } else {
        return;
      }
      e.preventDefault();
      tabRefs.current[next]?.focus();
      setActiveTab(TABS[next].id);
    },
    [TABS],
  );

  return (
    <div className="flex flex-col gap-0">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label={t.tabs.ariaLabel}
        className="flex gap-0 overflow-x-auto border-b border-[var(--color-border)]"
      >
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`px-4 py-3 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-accent)] ${
                isActive
                  ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        {TABS.filter((tab) => tab.id === activeTab).map((tab) => (
          <motion.div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="py-6"
          >
            {tab.id === "explanation" && <ExplanationPanel topic={topic} />}
            {tab.id === "code" && <CodePanel topic={topic} />}
            {tab.id === "try" && <TryPanel topic={topic} />}
            {tab.id === "quiz" && <QuizPanel topic={topic} />}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
