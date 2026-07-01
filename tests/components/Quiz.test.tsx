import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Quiz } from "@/components/Quiz";
import { ProgressProvider } from "@/lib/ProgressContext";
import type { QuizQuestion } from "@/lib/types";

function renderQuiz(questions: QuizQuestion[], slug?: string) {
  return render(
    <ProgressProvider>
      <Quiz questions={questions} slug={slug} />
    </ProgressProvider>,
  );
}

const mockQuestions: QuizQuestion[] = [
  {
    question: "Q1: Which option is correct?",
    options: ["Correct answer", "Wrong B", "Wrong C", "Wrong D"],
    correctIndex: 0,
    explanation: "Exp1: Option A is correct.",
  },
  {
    question: "Q2: Pick the right one.",
    options: ["Wrong W", "Wrong X", "Correct answer", "Wrong Z"],
    correctIndex: 2,
    explanation: "Exp2: Option C is correct.",
  },
];

function clickOption(label: RegExp | string) {
  fireEvent.click(screen.getByRole("radio", { name: label }));
}

function clickNext() {
  fireEvent.click(screen.getByRole("button", { name: /next →/i }));
}

function clickSeeResults() {
  fireEvent.click(screen.getByRole("button", { name: /see results →/i }));
}

function clickTryAgain() {
  fireEvent.click(screen.getByRole("button", { name: /try again/i }));
}

describe("Quiz", () => {
  it("renders the first question with 4 answer buttons", () => {
    renderQuiz(mockQuestions);
    expect(screen.getByText("Q1: Which option is correct?")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(4);
  });

  it("shows explanation and marks correct option green on correct answer", () => {
    renderQuiz(mockQuestions);
    clickOption(/Correct answer/);
    expect(screen.getByText(/Exp1: Option A is correct\./)).toBeInTheDocument();
    expect(screen.getByText(/✓ Correct/)).toBeInTheDocument();
  });

  it("shows explanation and marks wrong option red on incorrect answer", () => {
    renderQuiz(mockQuestions);
    clickOption(/Wrong B/);
    expect(screen.getByText(/Exp1: Option A is correct\./)).toBeInTheDocument();
    expect(screen.getByText(/✗ Incorrect/)).toBeInTheDocument();
  });

  it("disables all option buttons after answering", () => {
    renderQuiz(mockQuestions);
    clickOption(/Wrong C/);
    const optionButtons = screen.getAllByRole("radio");
    optionButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("advances to next question after clicking Next", () => {
    renderQuiz(mockQuestions);
    clickOption(/Correct answer/);
    clickNext();
    expect(screen.getByText("Q2: Pick the right one.")).toBeInTheDocument();
  });

  it("shows exactly '2 / 2' when both answers are correct", () => {
    renderQuiz(mockQuestions);
    // Q1: correct (index 0)
    clickOption(/Correct answer/);
    clickNext();
    // Q2: correct (index 2 — "Correct answer" text also appears here)
    clickOption(/Correct answer/);
    clickSeeResults();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("/ 2")).toBeInTheDocument();
    expect(screen.getByText(/All correct/)).toBeInTheDocument();
  });

  it("shows exactly '1 / 2' when one answer is wrong", () => {
    renderQuiz(mockQuestions);
    // Q1: wrong
    clickOption(/Wrong B/);
    clickNext();
    // Q2: correct
    clickOption(/Correct answer/);
    clickSeeResults();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("/ 2")).toBeInTheDocument();
    expect(screen.getByText(/1 to review/)).toBeInTheDocument();
  });

  it("resets score on Try again — second attempt counts independently", () => {
    renderQuiz(mockQuestions);

    // First attempt: both correct → "2 / 2"
    clickOption(/Correct answer/);
    clickNext();
    clickOption(/Correct answer/);
    clickSeeResults();
    expect(screen.getByText("2")).toBeInTheDocument();

    clickTryAgain();

    // Second attempt: both wrong → "0 / 2"
    clickOption(/Wrong B/);
    clickNext();
    clickOption(/Wrong W/);
    clickSeeResults();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText(/No correct answers/)).toBeInTheDocument();
  });

  it("ignores double-click / second selection — score stays at most 1", () => {
    renderQuiz(mockQuestions);
    const correctBtn = screen.getByRole("radio", { name: /Correct answer/ });
    const wrongBtn = screen.getByRole("radio", { name: /Wrong B/ });

    // First click selects correct answer
    fireEvent.click(correctBtn);
    // Second click on wrong button should be ignored (button is disabled after first answer)
    fireEvent.click(wrongBtn);

    // Only one "Next →" button — confirms we're still on Q1, not advanced
    expect(screen.getByRole("button", { name: /next →/i })).toBeInTheDocument();

    // Complete quiz and verify score is exactly 1 (not 2)
    clickNext();
    clickOption(/Wrong W/); // Q2 wrong
    clickSeeResults();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows keyboard hint numbers (1–4) on option buttons", () => {
    renderQuiz(mockQuestions);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("shows progress as '1 / 2' on first question", () => {
    renderQuiz(mockQuestions);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });
});
