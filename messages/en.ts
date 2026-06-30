export type Messages = {
  nav: { about: string; github: string };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    browseTopics: string;
    githubCv: string;
  };
  topics: { heading: (count: number) => string };
  tabs: {
    explanation: string;
    code: string;
    tryIt: string;
    quiz: string;
    ariaLabel: string;
  };
  code: {
    copy: string;
    copied: string;
    noExamples: string;
    noRunnable: string;
  };
  quiz: {
    noQuiz: string;
    progress: (current: number, total: number) => string;
    correct: string;
    incorrect: string;
    next: string;
    seeResults: string;
    tryAgain: string;
    allCorrect: string;
    noneCorrect: string;
    toReview: (n: number) => string;
  };
  whyItMatters: string;
  viewRelatedRepo: string;
  footer: { name: string; build: string };
  notFound: { label: string; message: string; back: string };
  about: { backToTopics: string };
  breadcrumb: { topics: string };
};

export const en: Messages = {
  nav: {
    about: "About",
    github: "GitHub",
  },
  hero: {
    badge: "✓ available for hire",
    title: "QA Automation Engineer",
    subtitle:
      "Playwright · API testing · CI/CD · AI/LLM security — each topic below is interactive: explanation, live code, and a quiz.",
    browseTopics: "Browse topics ↓",
    githubCv: "GitHub / CV →",
  },
  topics: {
    heading: (count: number) => `Topics — ${count} available`,
  },
  tabs: {
    explanation: "Explanation",
    code: "Code",
    tryIt: "Try it",
    quiz: "Quiz",
    ariaLabel: "Topic sections",
  },
  code: {
    copy: "copy",
    copied: "✓ copied",
    noExamples: "No code examples for this topic.",
    noRunnable: "No runnable examples for this topic.",
  },
  quiz: {
    noQuiz: "No quiz for this topic yet.",
    progress: (current: number, total: number) => `${current} / ${total}`,
    correct: "✓ Correct",
    incorrect: "✗ Incorrect",
    next: "Next →",
    seeResults: "See results →",
    tryAgain: "Try again",
    allCorrect: "All correct — nice work.",
    noneCorrect: "No correct answers — give it another go.",
    toReview: (n: number) => `${n} to review.`,
  },
  whyItMatters: "Why it matters",
  viewRelatedRepo: "View related repo →",
  footer: {
    name: "Steve Rotrekl · QA Automation Engineer",
    build: "build: passing",
  },
  notFound: {
    label: "test: FAILED",
    message: "This page does not exist. Expected: a valid route. Got: nothing.",
    back: "← Back to topics",
  },
  about: {
    backToTopics: "← topics",
  },
  breadcrumb: {
    topics: "← topics",
  },
};
