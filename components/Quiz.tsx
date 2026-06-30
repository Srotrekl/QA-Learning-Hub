"use client";

import { useState, useEffect, useRef } from "react";
import type { QuizQuestion } from "@/lib/types";

interface QuizProps {
  questions: QuizQuestion[];
}

function ResultScreen({
  score,
  total,
  onReset,
}: {
  score: number;
  total: number;
  onReset: () => void;
}) {
  const perfect = score === total;

  return (
    <div
      className="flex flex-col items-center gap-6 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="font-mono text-5xl font-bold">
        <span className="text-[var(--color-pass)]">{score}</span>
        <span className="text-[var(--color-text-muted)]"> / {total}</span>
      </div>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {perfect
          ? "All correct — nice work."
          : score === 0
            ? "No correct answers — give it another go."
            : `${total - score} to review.`}
      </p>

      <button
        onClick={onReset}
        className="rounded-md border border-[var(--color-border)] px-4 py-2 font-mono text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
      >
        Try again
      </button>
    </div>
  );
}

const OPTION_KEYS = ["1", "2", "3", "4"] as const;

export function Quiz({ questions }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  const answered = selectedIndex !== null;
  const isLast = currentIndex === questions.length - 1;

  function reset() {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setScore(0);
  }

  function selectOption(optionIndex: number) {
    setSelectedIndex((prev) => {
      if (prev !== null) return prev;
      if (optionIndex === questions[currentIndex].correctIndex) {
        setScore((s) => s + 1);
      }
      return optionIndex;
    });
  }

  function advance() {
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
  }

  useEffect(() => {
    if (answered) {
      nextButtonRef.current?.focus();
    }
  }, [answered]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;

      if (OPTION_KEYS.includes(e.key as (typeof OPTION_KEYS)[number])) {
        const idx = Number(e.key) - 1;
        if (idx < questions[currentIndex]?.options.length) selectOption(idx);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, answered]);

  if (currentIndex >= questions.length) {
    return <ResultScreen score={score} total={questions.length} onReset={reset} />;
  }

  const q = questions[currentIndex];
  const explanationId = `quiz-explanation-${currentIndex}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress + question number */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--color-text-muted)]">
          {currentIndex + 1} / {questions.length}
        </span>
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-border)]"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label="Quiz progress"
        >
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <p className="text-sm font-semibold leading-relaxed text-[var(--color-text-primary)]">
        {q.question}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2" role="group" aria-label="Answer options">
        {q.options.map((option, i) => {
          const isSelected = selectedIndex === i;
          const isCorrect = i === q.correctIndex;

          let stateClasses =
            "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-text-primary)]";

          if (answered) {
            if (isCorrect) {
              stateClasses =
                "border-[var(--color-pass)] bg-[var(--color-pass)]/10 text-[var(--color-pass)]";
            } else if (isSelected) {
              stateClasses =
                "border-[var(--color-fail)] bg-[var(--color-fail)]/10 text-[var(--color-fail)]";
            } else {
              stateClasses = "border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => selectOption(i)}
              disabled={answered}
              aria-pressed={isSelected}
              aria-describedby={answered ? explanationId : undefined}
              className={`flex items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:cursor-default ${stateClasses}`}
            >
              <span className="font-mono text-xs opacity-60 shrink-0 pt-0.5">{i + 1}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div
          id={explanationId}
          role="status"
          aria-live="polite"
          className={`rounded-md border-l-2 pl-4 py-2 text-sm leading-relaxed ${
            selectedIndex === q.correctIndex
              ? "border-[var(--color-pass)] text-[var(--color-pass)]"
              : "border-[var(--color-fail)] text-[var(--color-text-secondary)]"
          }`}
        >
          <span className="font-mono text-xs font-semibold">
            {selectedIndex === q.correctIndex ? "✓ Correct" : "✗ Incorrect"}
            {" — "}
          </span>
          {q.explanation}
        </div>
      )}

      {/* Next / See results */}
      {answered && (
        <div className="flex justify-end">
          <button
            ref={nextButtonRef}
            onClick={advance}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 font-mono text-sm font-semibold text-[#0d1117] transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {isLast ? "See results →" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
}
