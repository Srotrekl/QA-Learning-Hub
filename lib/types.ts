export type CodeExample = {
  label: string;
  language: "ts" | "python" | "bash" | "yaml";
  code: string;
  runnable?: boolean;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Topic = {
  slug: string;
  title: string;
  category: "automation" | "api" | "performance" | "ai-testing" | "ci-cd" | "fundamentals";
  difficulty: "junior" | "medior" | "senior";
  summary: string;
  explanation: string;
  whyItMatters: string;
  codeExamples: CodeExample[];
  quiz: QuizQuestion[];
  relatedRepoUrl?: string;
};
