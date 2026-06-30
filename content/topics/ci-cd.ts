import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "ci-cd",
  title: "CI/CD (GitHub Actions)",
  category: "ci-cd",
  difficulty: "medior",
  summary:
    "Automate testing and deployment with GitHub Actions: workflow YAML, matrix builds, artifacts, and test gates.",
  explanation: `## CI/CD with GitHub Actions

Continuous Integration runs your tests automatically on every push. Continuous Deployment ships passing builds to production. Together, they give you confidence that code works before it reaches users.

### Workflow anatomy

A GitHub Actions workflow is a YAML file in \`.github/workflows/\`. It defines:
- **Triggers** (\`on:\`) — push, pull_request, schedule, manual
- **Jobs** — parallel or sequential units of work
- **Steps** — individual commands within a job
- **Runners** — \`ubuntu-latest\`, \`windows-latest\`, \`macos-latest\`

### Matrix builds

Run the same job across multiple configurations:

\`\`\`yaml
strategy:
  matrix:
    python-version: ["3.11", "3.12"]
    os: [ubuntu-latest, windows-latest]
\`\`\`

### Artifacts

Upload test reports, screenshots, or build outputs with \`actions/upload-artifact\`. Useful for Playwright HTML reports.

### Test gates

A failed job blocks the PR merge — the gate. This is CI's core value: no broken code gets through without a human decision.
`,
  whyItMatters:
    "QA engineers who can set up and maintain CI pipelines are far more valuable than those who only run tests locally. GitHub Actions is the most common CI tool in 2024–2025 — knowing how to write and debug workflows is a core skill.",
  codeExamples: [
    {
      label: "GitHub Actions CI workflow",
      language: "yaml",
      runnable: false,
      code: `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: ["20", "22"]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: test-results/`,
    },
  ],
  quiz: [
    {
      question: "What does the 'on: pull_request' trigger in a GitHub Actions workflow do?",
      options: [
        "Runs the workflow when a PR is merged to main",
        "Runs the workflow whenever a pull request is opened or updated",
        "Requires manual approval before running",
        "Runs the workflow on a schedule",
      ],
      correctIndex: 1,
      explanation:
        "on: pull_request triggers the workflow for every PR event (opened, updated, synchronized). This is the most common CI trigger — it gives feedback on the PR before merging.",
    },
    {
      question: "What is a matrix build in GitHub Actions?",
      options: [
        "A build that runs on multiple cloud providers simultaneously",
        "Running the same job across multiple configurations (e.g., Node versions, OS)",
        "A build that produces multiple deployment artifacts",
        "A security scan that checks multiple vulnerability databases",
      ],
      correctIndex: 1,
      explanation:
        "Matrix builds multiply your job across a combination of values — e.g., 3 Node versions × 2 operating systems = 6 parallel jobs. Great for ensuring cross-environment compatibility.",
    },
    {
      question: "Why use 'npm ci' instead of 'npm install' in CI pipelines?",
      options: [
        "npm ci is faster because it skips optional dependencies",
        "npm ci installs from package-lock.json exactly, failing if it's outdated",
        "npm ci uses a cache that npm install doesn't",
        "npm ci skips devDependencies to speed up the build",
      ],
      correctIndex: 1,
      explanation:
        "npm ci installs the exact versions from package-lock.json and fails if the lock file doesn't match package.json. This ensures reproducible builds — the same code always produces the same result.",
    },
    {
      question: "When should you upload test artifacts in a CI workflow?",
      options: [
        "Always, on every successful run",
        "Never — artifacts slow down the pipeline",
        "On failure, to preserve test reports and screenshots for debugging",
        "Only on the main branch, not on PRs",
      ],
      correctIndex: 2,
      explanation:
        "Uploading artifacts on failure (if: failure()) preserves the evidence you need to debug: Playwright screenshots, HTML reports, log files. Uploading on success wastes storage — you don't need reports when tests pass.",
    },
    {
      question: "What happens if a required CI job fails on a pull request?",
      options: [
        "The PR is automatically closed",
        "The PR can still be merged by anyone with write access",
        "The PR is blocked from merging until the job passes (or a maintainer overrides)",
        "The failing job is automatically retried 3 times",
      ],
      correctIndex: 2,
      explanation:
        "Branch protection rules can require status checks to pass before merging. A failing CI job blocks the PR — this is the 'gate' in CI. Maintainers can override, but the failure is visible and logged.",
    },
  ],
  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
