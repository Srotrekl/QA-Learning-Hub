"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "qa-hub:completed";

function readCompleted(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeCompleted(set: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {
    // storage full or blocked — silently ignore
  }
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCompleted(readCompleted());
  }, []);

  const markCompleted = useCallback((slug: string) => {
    setCompleted((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      writeCompleted(next);
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (slug: string) => completed.has(slug),
    [completed],
  );

  return { completed, markCompleted, isCompleted };
}
