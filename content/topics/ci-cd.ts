import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "ci-cd",
  title: "CI/CD for QA (GitHub Actions)",
  category: "ci-cd",
  difficulty: "medior",
  summary:
    "Automate testing with GitHub Actions: workflow anatomy, triggers, matrix builds, artifact uploads, dependency caching, and PR test gates.",
  explanation: `## CI/CD for QA with GitHub Actions

Continuous Integration means every code change is automatically tested before it can be merged. For QA engineers, CI is the difference between tests that are actually trusted and tests that only run occasionally on someone's laptop.

### Workflow anatomy

A GitHub Actions workflow is a YAML file in \`.github/workflows/\`. Every workflow has three layers:

\`\`\`
on:          ← when to run (trigger)
jobs:        ← what to run (parallel or sequential units)
  steps:     ← individual commands within a job
\`\`\`

**Triggers (\`on:\`)** — control when the workflow fires:

| Trigger | When it runs |
|---------|-------------|
| \`push\` | On every commit pushed to the specified branch |
| \`pull_request\` | When a PR is opened, updated, or synchronised |
| \`schedule\` | On a cron schedule (e.g. nightly regression runs) |
| \`workflow_dispatch\` | Manually triggered from the GitHub UI |

\`\`\`yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * 1-5"  # 02:00 UTC, Mon–Fri (nightly regression)
\`\`\`

---

### Job sequence: lint → test → build

Jobs run in parallel by default. Use \`needs:\` to enforce order and create a quality gate pipeline:

\`\`\`yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install ruff && ruff check .

  test:
    needs: lint          # only runs if lint passes
    runs-on: ubuntu-latest
    steps:
      - run: pytest

  build:
    needs: test          # only runs if test passes
    runs-on: ubuntu-latest
    steps:
      - run: docker build .
\`\`\`

If \`lint\` fails, \`test\` and \`build\` are skipped — the pipeline fails fast without wasting runner minutes.

---

### Matrix builds

Run the same job across multiple configurations simultaneously:

\`\`\`yaml
strategy:
  matrix:
    python-version: ["3.11", "3.12"]
    os: [ubuntu-latest, windows-latest]
\`\`\`

This creates 4 parallel jobs (2 Python versions × 2 OS). Useful for confirming tests pass across all supported environments. Use \`fail-fast: false\` to see all results even if one combination fails:

\`\`\`yaml
strategy:
  fail-fast: false
  matrix:
    python-version: ["3.11", "3.12"]
\`\`\`

---

### Caching dependencies

Without caching, every job reinstalls all packages from scratch — slow and wasteful. Cache the package manager's download directory:

\`\`\`yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: "pip"           # caches ~/.cache/pip automatically

- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"           # caches ~/.npm automatically
\`\`\`

Cache hits typically cut install time from 60–90 seconds to under 5 seconds.

---

### Artifacts — test reports and screenshots

Upload test output so failures can be debugged after the run:

\`\`\`yaml
- name: Upload Playwright report
  if: always()            # upload even when tests fail
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 7

- name: Upload pytest HTML report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: pytest-report
    path: reports/report.html
\`\`\`

Use \`if: always()\` for reports (you want them whether tests pass or fail) and \`if: failure()\` for screenshots (only needed when something went wrong).

---

### Test gates — blocking PRs on failure

A failed CI job can block a PR from merging via **branch protection rules** (Settings → Branches → Require status checks). Once configured:

- Green CI → PR can be merged
- Red CI → PR is blocked until fixed (or a maintainer overrides with justification)

This is the core value of CI for QA: the test suite becomes a hard contract, not a suggestion.
`,

  whyItMatters:
    "A QA engineer who can only run tests locally is half as effective as one who can wire those tests into CI. When tests run automatically on every PR, the whole team benefits — not just QA. Bugs are caught earlier, test results are visible to developers and reviewers, and 'the tests passed on my machine' stops being an acceptable answer. GitHub Actions is the most widely used CI platform today. Knowing how to write, debug, and maintain workflows — including matrix builds, caching, and artifact uploads — is a skill that directly increases your impact on any team.",

  codeExamples: [
    {
      label: "Complete QA workflow: pytest + Playwright, matrix, cache, artifacts (YAML, read-only)",
      language: "yaml",
      runnable: false,
      code: `# .github/workflows/qa.yml
name: QA Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 2 * * 1-5"   # nightly regression run at 02:00 UTC, Mon–Fri

jobs:
  # ── 1. Lint ────────────────────────────────────────────────────────────────
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - run: pip install ruff
      - run: ruff check .

  # ── 2. API tests (pytest) — runs after lint, matrix over Python versions ──
  api-tests:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ["3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: "pip"

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run pytest
        run: |
          pytest tests/api/ \\
            --html=reports/pytest-\${{ matrix.python-version }}.html \\
            --self-contained-html \\
            -v

      - name: Upload pytest report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: pytest-report-py\${{ matrix.python-version }}
          path: reports/
          retention-days: 7

  # ── 3. E2E tests (Playwright) — runs after lint ────────────────────────────
  e2e-tests:
    needs: lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload failure screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-screenshots
          path: test-results/

  # ── 4. Build — only runs if both test jobs pass ───────────────────────────
  build:
    needs: [api-tests, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t myapp:\${{ github.sha }} .

# ── What happens at runtime: ──────────────────────────────────────────────────
#
# On pull_request:
#   lint                          → runs first
#   api-tests (py3.11)  ┐
#   api-tests (py3.12)  ├─ parallel, both need lint to pass
#   e2e-tests           ┘
#   build                         → only if ALL three above pass
#
# If any test job fails:
#   - build is skipped
#   - PR is blocked from merging (if branch protection is configured)
#   - artifacts (reports, screenshots) are uploaded for debugging
#
# On schedule (nightly):
#   Same pipeline runs against main — catches dependency rot or
#   environment drift that only shows up over time.
`,
    },
  ],

  quiz: [
    {
      question: "You want a GitHub Actions workflow to run on every PR against main, AND every night at 02:00 UTC. Which trigger configuration is correct?",
      options: [
        "on: push: branches: [main]",
        "on:\n  pull_request:\n    branches: [main]\n  schedule:\n    - cron: \"0 2 * * *\"",
        "on: pull_request and schedule: nightly",
        "on: [pr, nightly]",
      ],
      correctIndex: 1,
      explanation:
        "GitHub Actions supports multiple triggers under a single 'on:' key. pull_request fires on PR events; schedule uses standard 5-field cron syntax (minute hour day month weekday). The cron '0 2 * * *' means 02:00 UTC every day. Both can coexist in the same workflow.",
    },
    {
      question: "What does 'fail-fast: false' do in a matrix build strategy?",
      options: [
        "It makes the workflow fail immediately on the first error across all jobs",
        "It disables caching so each matrix job starts from a clean state",
        "It allows all matrix combinations to run to completion even if one fails, so you see results for every combination",
        "It retries each failed matrix job up to 3 times automatically",
      ],
      correctIndex: 2,
      explanation:
        "By default (fail-fast: true), GitHub Actions cancels all remaining matrix jobs as soon as one fails. Setting fail-fast: false lets every combination run to completion — useful when you want to know which Python versions or OS combinations are broken, not just that at least one is.",
    },
    {
      question: "When should you use 'if: always()' vs 'if: failure()' for uploading test artifacts?",
      options: [
        "always() for screenshots (only useful on failure); failure() for full HTML reports (always needed)",
        "always() for full test reports (useful whether tests pass or fail); failure() for screenshots (only needed when something went wrong)",
        "They are interchangeable — both upload the artifact regardless of job status",
        "always() runs before the test step; failure() runs after",
      ],
      correctIndex: 1,
      explanation:
        "HTML test reports are valuable both on failure (to diagnose what broke) and on success (to track trends, share results). Screenshots from Playwright are only meaningful when a test fails — uploading them on every passing run wastes storage. Use always() for reports, failure() for failure-only evidence.",
    },
    {
      question: "In a job sequence with 'needs: lint' on the test job and 'needs: test' on the build job — what happens if the lint job fails?",
      options: [
        "The test job runs anyway; only the build job is skipped",
        "All downstream jobs (test and build) are skipped, and the workflow fails fast without running tests or build",
        "GitHub Actions retries the lint job automatically before skipping downstream jobs",
        "The build job runs in parallel with lint, so it is unaffected",
      ],
      correctIndex: 1,
      explanation:
        "'needs:' creates a dependency chain. If lint fails, the test job is skipped because its dependency did not succeed. Build is skipped too, because its dependency (test) was skipped. The pipeline fails fast — no runner minutes are spent on tests when linting is already broken.",
    },
    {
      question: "What is the QA benefit of caching pip or npm dependencies in CI?",
      options: [
        "Caching makes tests run faster by skipping flaky assertions",
        "Caching ensures the same package versions are used on every run, preventing version drift",
        "Caching reduces install time from minutes to seconds on cache hits, keeping the feedback loop short without changing test behaviour",
        "Caching is required for matrix builds — without it, matrix jobs cannot share state",
      ],
      correctIndex: 2,
      explanation:
        "Without caching, every CI job reinstalls all packages from the network — often 60–90 seconds for a typical Python or Node project. A cache hit reduces this to under 5 seconds. Faster CI means developers get test feedback sooner and are less tempted to skip waiting for results. Caching does not affect which versions are installed — that is controlled by the lock file.",
    },
  ],

  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
