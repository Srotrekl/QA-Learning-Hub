import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("QA Hub smoke", () => {
  test("homepage loads with hero and topic cards", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /QA Automation Engineer/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse topics/i })).toBeVisible();

    // At least one topic card is present
    const cards = page.getByRole("link").filter({ hasText: /playwright|api|pytest|ci|security/i });
    await expect(cards.first()).toBeVisible();
  });

  test("homepage has no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("navigates to Playwright topic and shows all 4 tabs", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /playwright/i }).first().click();

    await expect(page).toHaveURL(/\/topics\/playwright/);
    await expect(page.getByRole("heading", { name: /Playwright E2E Testing/i }).first()).toBeVisible();

    // All 4 tabs present
    await expect(page.getByRole("tab", { name: "Explanation" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Code" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Try it" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Quiz" })).toBeVisible();
  });

  test("Explanation tab shows content and Why it matters box", async ({ page }) => {
    await page.goto("/topics/playwright");

    // Explanation tab is active by default
    await expect(page.getByRole("tab", { name: "Explanation" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByText(/Why it matters/i)).toBeVisible();
    await expect(page.getByText(/View related repo/i)).toBeVisible();
  });

  test("Code tab shows code and copy button", async ({ page }) => {
    await page.goto("/topics/playwright");

    await page.getByRole("tab", { name: "Code" }).click();

    await expect(page.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "true");
    // Code content visible — check the panel, not the whole page (tab panel scoping)
    const codePanel = page.getByRole("tabpanel", { name: "Code" });
    await expect(codePanel.getByText(/getByRole/).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /copy/i }).first()).toBeVisible();
  });

  test("Quiz tab: answer questions and see score", async ({ page }) => {
    await page.goto("/topics/playwright");

    await page.getByRole("tab", { name: "Quiz" }).click();

    // First question visible
    await expect(page.getByText(/1 \/ 5/)).toBeVisible();

    // Answer all 5 questions (always pick first option, then Next)
    for (let i = 0; i < 5; i++) {
      const options = page.getByRole("group", { name: "Answer options" }).getByRole("button");
      await options.first().click();
      const isLast = i === 4;
      if (isLast) {
        await page.getByRole("button", { name: /see results/i }).click();
      } else {
        await page.getByRole("button", { name: /next/i }).click();
      }
    }

    // Score screen shows X / 5
    await expect(page.getByText("/ 5")).toBeVisible();
    await expect(page.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("Quiz Try again resets to first question", async ({ page }) => {
    await page.goto("/topics/playwright");
    await page.getByRole("tab", { name: "Quiz" }).click();

    // Complete quiz
    for (let i = 0; i < 5; i++) {
      const options = page.getByRole("group", { name: "Answer options" }).getByRole("button");
      await options.first().click();
      if (i === 4) {
        await page.getByRole("button", { name: /see results/i }).click();
      } else {
        await page.getByRole("button", { name: /next/i }).click();
      }
    }

    await page.getByRole("button", { name: /try again/i }).click();

    // Back to question 1
    await expect(page.getByText(/1 \/ 5/)).toBeVisible();
  });

  test("tab keyboard navigation with arrow keys", async ({ page }) => {
    await page.goto("/topics/playwright");

    // Focus Explanation tab and navigate right
    await page.getByRole("tab", { name: "Explanation" }).focus();
    await page.keyboard.press("ArrowRight");

    await expect(page.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Try it" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    // ArrowLeft goes back
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("tab", { name: "Code" })).toHaveAttribute("aria-selected", "true");
  });

  test("topic page has no critical a11y violations", async ({ page }) => {
    await page.goto("/topics/playwright");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
