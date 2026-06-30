import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "playwright",
  title: "Playwright E2E Testing",
  category: "automation",
  difficulty: "medior",
  summary:
    "End-to-end testing with Playwright: selectors, auto-wait, fixtures, and the Page Object Model pattern.",
  explanation: `## Playwright E2E Testing

Playwright is a modern end-to-end testing framework by Microsoft that supports Chromium, Firefox, and WebKit.

### Key concepts

**Selectors** — Playwright encourages semantic, user-facing selectors:
- \`getByRole('button', { name: 'Submit' })\` — ARIA role
- \`getByText('Welcome')\` — visible text
- \`getByTestId('login-form')\` — data-testid attribute

**Auto-wait** — Playwright automatically waits for elements to be visible, stable, and actionable before interacting. No more \`sleep()\` or manual waits.

**Fixtures** — reusable setup/teardown via \`test.extend()\`. Share browser context, authenticated state, or custom page objects across tests.

**Page Object Model (POM)** — encapsulate page interactions in a class to keep tests readable and maintainable.
`,
  whyItMatters:
    "Playwright is the industry standard for E2E testing in modern web projects. Knowing how to write maintainable Playwright tests — with proper selectors, fixtures, and POM — is a core skill hiring managers look for in QA engineers.",
  codeExamples: [
    {
      label: "Basic Playwright test",
      language: "ts",
      runnable: false,
      code: `import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});`,
    },
    {
      label: "Try it: selector logic (runs in browser)",
      language: "ts",
      runnable: true,
      code: `// Simulate how Playwright's getByRole selector works.
// Real Playwright runs in Node.js with browser binaries —
// here we demo the matching logic in pure TypeScript.

type Role = "button" | "heading" | "link";

interface Element {
  role: Role;
  name: string;
  visible: boolean;
}

function getByRole(elements: Element[], role: Role, name: string): Element | undefined {
  return elements.find((el) => el.role === role && el.name === name && el.visible);
}

// Mock DOM
const dom: Element[] = [
  { role: "heading", name: "Dashboard", visible: true },
  { role: "button",  name: "Sign in",   visible: true },
  { role: "button",  name: "Cancel",    visible: false },
  { role: "link",    name: "Home",      visible: true },
];

// Assertions
const signIn = getByRole(dom, "button", "Sign in");
console.log("getByRole('button', 'Sign in'):", signIn ? "✓ found" : "✗ not found");

const dashboard = getByRole(dom, "heading", "Dashboard");
console.log("getByRole('heading', 'Dashboard'):", dashboard ? "✓ found" : "✗ not found");

const hidden = getByRole(dom, "button", "Cancel");
console.log("hidden Cancel button visible:", hidden ? "✓ found" : "✗ not found (hidden)");

console.log("\\nKey insight: Playwright getByRole only matches VISIBLE elements by default.");`,
    },
  ],
  quiz: [
    {
      question: "What does Playwright's auto-wait mechanism do?",
      options: [
        "Adds a fixed 1-second delay before each action",
        "Waits for elements to be visible, stable, and actionable before interacting",
        "Retries failed assertions up to 3 times",
        "Automatically takes screenshots on failure",
      ],
      correctIndex: 1,
      explanation:
        "Playwright's auto-wait makes tests more reliable by automatically waiting for elements to reach an actionable state — visible, enabled, not animating. This eliminates the need for manual sleep() calls.",
    },
    {
      question: "Which selector does Playwright recommend for best accessibility and resilience?",
      options: [
        "CSS class selector (.btn-primary)",
        "XPath (//div[@class='form'])",
        "Role-based selector (getByRole('button', { name: 'Submit' }))",
        "Index-based selector (nth-child(3))",
      ],
      correctIndex: 2,
      explanation:
        "Role-based selectors mirror how users and assistive technologies interact with the page. They're resilient to style changes and reflect accessibility properties — if the test passes, the element is also accessible.",
    },
    {
      question: "What is the Page Object Model (POM) pattern used for?",
      options: [
        "Generating test data automatically",
        "Running tests in parallel across browsers",
        "Encapsulating page interactions in reusable classes",
        "Mocking API responses in tests",
      ],
      correctIndex: 2,
      explanation:
        "POM wraps page interactions (selectors, clicks, fills) in a class. Tests call methods like loginPage.fillCredentials() instead of duplicating selectors. When the UI changes, you update one place — not every test.",
    },
    {
      question: "How do you share authenticated browser state across Playwright tests?",
      options: [
        "Log in inside each test individually",
        "Use test.extend() fixtures with storageState",
        "Set a global cookie in beforeAll",
        "Call page.evaluate() to set localStorage",
      ],
      correctIndex: 1,
      explanation:
        "Playwright fixtures with storageState let you save auth state once (e.g., in global setup) and reuse it across tests. This avoids login overhead and keeps tests focused on the feature being tested.",
    },
    {
      question:
        "What is the difference between expect(locator).toBeVisible() and expect(locator).toBeAttached()?",
      options: [
        "There is no difference — they are aliases",
        "toBeVisible checks CSS visibility; toBeAttached only checks DOM presence",
        "toBeAttached checks CSS visibility; toBeVisible checks DOM presence",
        "Both assertions fail when the element is scrolled out of the viewport",
      ],
      correctIndex: 1,
      explanation:
        "toBeAttached only confirms the element is in the DOM. toBeVisible additionally requires it to be visible (not hidden via CSS, has non-zero dimensions). A hidden input is attached but not visible — toBeVisible would fail on it.",
    },
  ],
  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
