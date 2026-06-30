import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "bug-reporting",
  title: "Bug Reporting & Triage",
  category: "fundamentals",
  difficulty: "junior",
  summary:
    "Write bug reports that get fixed: anatomy of a good report, severity vs priority, bug lifecycle, and reproducibility.",

  explanation: `## Bug Reporting & Triage

A bug that cannot be understood cannot be fixed. Clear, complete bug reports are the primary communication channel between QA and development — and the quality of that channel directly affects how quickly defects get resolved.

### Anatomy of a Good Bug Report

Every bug report needs six components:

**Title** — one sentence, specific enough to distinguish this bug from all others. Include the affected feature, the action, and the symptom.

| Bad title | Good title |
|-----------|-----------|
| "Login broken" | "Login button unresponsive after entering invalid password on Chrome 124 / Windows 11" |
| "Error on checkout" | "Order total displays £0.00 after applying discount code SAVE10 on cart >£200" |

**Steps to reproduce** — numbered, atomic, starting from a known state. Every step should be a single action. If a tester cannot follow the steps and reach the same failure, the report is unusable.

1. Navigate to https://example.com/login
2. Enter email: test@example.com
3. Enter password: wrongpassword123
4. Click "Sign in"
5. Observe: button becomes unresponsive — no error message, no page change

**Expected result** — what the spec, design, or common sense says should happen.
**Actual result** — what actually happened. These two fields must be specific and distinct; "it doesn't work" is neither.

**Environment** — browser, OS, device, app version, test data used. A bug that only reproduces on Safari 17 / iOS 17 is invisible to a developer testing on Chrome / macOS unless the environment is documented.

**Evidence** — screenshot, video, network HAR file, console log. A screenshot showing the broken state is worth three paragraphs of description.

---

### Severity vs Priority

These are different axes. Conflating them is the most common mistake in bug triage — and a classic interview question.

**Severity** — how badly the bug damages the system's functionality.
**Priority** — how urgently the bug needs to be fixed relative to other work.

Production systems typically use four severity levels (critical / high / medium / low). The matrix below illustrates the principle using two axes:

| | High priority | Low priority |
|---|---|---|
| **High severity** | Login crash on all browsers — blocks all users, fix immediately | Crash in a rarely-used admin export feature — severe but affects few users |
| **Low severity** | Typo in the company name on the homepage — cosmetically minor but visible to every visitor | Misaligned icon in a settings panel used by <1% of users |

The four quadrants matter because priority is a business decision, not a technical one. A cosmetic defect on the marketing homepage (low severity) can be higher priority than a crash in a legacy admin tool (high severity) because the homepage is seen by thousands of potential customers every hour.

---

### Bug Lifecycle

A bug moves through states as it is investigated, fixed, and verified:

\`\`\`
NEW ──[triage]──► TRIAGED ──[assign]──► IN PROGRESS ──[fix submitted]──► RESOLVED
                                                                              │
                    ◄──────────────[reopened: fix insufficient]──────────────┤
                                                                              │
                                                                    [QA verifies fix]
                                                                              │
                                                                         VERIFIED ──► CLOSED
\`\`\`

Key transitions QA owns:
- **NEW → TRIAGED**: QA or lead confirms the bug is reproducible and sets severity/priority
- **RESOLVED → VERIFIED**: QA re-tests the fix on the same environment where the bug was found
- **VERIFIED → CLOSED**: bug confirmed fixed and no regression introduced
- **RESOLVED → REOPENED**: fix is incomplete or introduced a new failure

---

### Reproducibility

Before filing a bug, attempt to reproduce it at least three times. Classify it:

| Class | Meaning | What to do |
|-------|---------|-----------|
| Always reproducible | Fails every time with the same steps | File immediately with full steps |
| Intermittent | Fails sometimes — timing, load, or race condition | File with reproduction rate (e.g. "3/10 attempts"), include any patterns observed |
| Not reproducible | Cannot reproduce after multiple attempts | Investigate environment differences; file as "not reproducible" with evidence of the original failure |

Intermittent bugs are harder to fix than consistent ones, but harder to dismiss than "cannot reproduce." Document your reproduction rate — it gives developers a signal about where to look.

---

### What Makes a Report Unusable

- **Vague title**: "something is wrong with payments"
- **Missing steps**: "I clicked around and got an error"
- **No expected result**: the developer doesn't know what correct behaviour looks like
- **No environment**: the bug might be platform-specific and the developer tests on a different setup
- **No evidence**: a screenshot takes 5 seconds and saves 20 minutes of back-and-forth
- **Multiple bugs in one report**: makes tracking, prioritisation, and resolution impossible — one bug, one report
`,

  whyItMatters:
    "Bug reporting is the most frequent deliverable a QA engineer produces. Every day, every sprint. A developer who receives a vague, incomplete report will spend time asking clarifying questions, attempting to reproduce on the wrong environment, or guessing at expected behaviour — all of which delay the fix. Severity vs priority is asked in virtually every QA interview because it tests whether a candidate understands that QA does not operate in isolation. Priority is a product decision that weighs user impact, business visibility, and sprint capacity. Knowing the difference — and being able to give concrete examples — signals that you can participate in triage discussions, not just file tickets. A QA engineer who writes clear, reproducible, well-evidenced bug reports builds trust with the development team and becomes a force multiplier. One who files 'it's broken' tickets becomes noise.",

  codeExamples: [
    {
      label: "Bad vs good bug report — before/after comparison (read-only)",
      language: "ts",
      runnable: false,
      code: `// ❌ BAD BUG REPORT
// ─────────────────
// Title: checkout broken
// Steps: went to checkout and it didn't work
// Expected: it should work
// Actual: it doesn't
// Environment: my laptop
// Evidence: none
//
// Problems: vague title, no starting state, no specific steps,
// expected/actual are meaningless, no environment, no evidence.
// A developer cannot reproduce this — it will sit in the backlog.

// ─────────────────────────────────────────────────────────────────

// ✓ GOOD BUG REPORT
// ──────────────────
// Title: Order total shows £0.00 after applying discount code SAVE10
//        on cart subtotal >£200 (Chrome 124 / Windows 11)
//
// Severity: High — incorrect price displayed at checkout
// Priority: High — affects all users with qualifying carts
//
// Steps to reproduce:
//   1. Log in as test@example.com (password: Test1234!)
//   2. Add item "Wireless Headphones" (£249.99) to cart
//   3. Navigate to /checkout
//   4. Enter discount code: SAVE10
//   5. Click "Apply"
//
// Expected: 10% discount applied — total displays £224.99
// Actual:   Total displays £0.00 — user could complete a free order
//
// Environment: Chrome 124.0.6367.82 / Windows 11 22H2 / Staging v2.4.1
// Evidence: [screenshot attached] [HAR showing /api/discount response]
// Reproducibility: 5/5 attempts
//
// Why this works: specific title names the feature + trigger + symptom,
// steps start from a known state, expected vs actual are concrete and
// distinct, environment is exact, evidence eliminates back-and-forth.`,
    },
    {
      label: "Severity / priority classifier (runs in browser)",
      language: "ts",
      runnable: true,
      code: `type Severity = "critical" | "high" | "medium" | "low";
type Priority = "P1" | "P2" | "P3" | "P4";

interface BugClassification {
  severity: Severity;
  priority: Priority;
  rationale: string;
}

interface BugInput {
  userImpact: "all-users" | "many-users" | "some-users" | "few-users";
  functionalImpact: "crash-data-loss" | "major-feature-broken" | "minor-feature-broken" | "cosmetic";
  pageVisibility: "high-traffic" | "normal" | "low-traffic" | "internal-only";
}

function classifyBug(bug: BugInput): BugClassification {
  const severityMap: Record<BugInput["functionalImpact"], Severity> = {
    "crash-data-loss":      "critical",
    "major-feature-broken": "high",
    "minor-feature-broken": "medium",
    "cosmetic":             "low",
  };
  const severity = severityMap[bug.functionalImpact];

  let priorityScore = 0;
  if (bug.userImpact === "all-users")        priorityScore += 3;
  if (bug.userImpact === "many-users")       priorityScore += 2;
  if (bug.userImpact === "some-users")       priorityScore += 1;
  if (bug.pageVisibility === "high-traffic") priorityScore += 2;
  if (bug.pageVisibility === "normal")       priorityScore += 1;

  const priority: Priority =
    priorityScore >= 4 ? "P1" :
    priorityScore >= 3 ? "P2" :
    priorityScore >= 1 ? "P3" : "P4";

  const rationale =
    \`Severity=\${severity} (functional: \${bug.functionalImpact}), \` +
    \`Priority=\${priority} (reaches \${bug.userImpact} on \${bug.pageVisibility} page)\`;

  return { severity, priority, rationale };
}

// Classic example: low severity, high priority
const homepageTypo = classifyBug({
  userImpact: "all-users",
  functionalImpact: "cosmetic",
  pageVisibility: "high-traffic",
});

// High severity, low priority
const adminCrash = classifyBug({
  userImpact: "few-users",
  functionalImpact: "crash-data-loss",
  pageVisibility: "internal-only",
});

// High severity, high priority
const loginCrash = classifyBug({
  userImpact: "all-users",
  functionalImpact: "crash-data-loss",
  pageVisibility: "high-traffic",
});

console.log("Homepage typo (low severity, high priority):");
console.log(" ", homepageTypo.rationale);
console.log("\\nAdmin panel crash (high severity, low priority):");
console.log(" ", adminCrash.rationale);
console.log("\\nLogin crash (high severity, high priority):");
console.log(" ", loginCrash.rationale);
console.log("\\nKey insight: severity is technical; priority is a business decision.");`,
    },
  ],

  quiz: [
    {
      question:
        "A cosmetic typo in the company name appears on the public homepage, visible to all visitors. A crash occurs in a legacy data-export tool used by two internal administrators once a month. Which statement correctly describes the severity and priority of these two bugs?",
      options: [
        "The homepage typo is low severity and should be low priority because it does not affect functionality",
        "The admin crash is high severity but may have lower priority than the homepage typo, because the typo affects every visitor on a high-visibility page",
        "Severity and priority are the same thing — a high-severity bug is always high priority",
        "The admin crash should always be fixed first because crashes are always P1",
      ],
      correctIndex: 1,
      explanation:
        "Severity measures functional damage (the crash is more severe). Priority is a business decision — the typo affects every visitor on the homepage every hour, giving it higher urgency despite lower technical severity. This is the classic example of low severity / high priority vs high severity / low priority.",
    },
    {
      question:
        "Which of the following is the most critical component missing from this bug report: \"Title: Login broken. Steps: Clicked login. Expected: Should work. Actual: Didn't work.\"",
      options: [
        "A screenshot",
        "The browser and OS environment",
        "Specific, numbered steps to reproduce starting from a known state",
        "The severity classification",
      ],
      correctIndex: 2,
      explanation:
        "\"Clicked login\" is not reproducible — it starts from an unknown state, omits credentials, and gives no detail about which action triggered the failure. Without specific, numbered steps from a known starting point, a developer cannot reproduce the bug, making the report useless regardless of what other information is present.",
    },
    {
      question:
        "What is the QA engineer's responsibility when a bug moves from RESOLVED to the verification stage?",
      options: [
        "Close the ticket and mark it as done",
        "Re-test the specific fix on the same environment where the bug was originally found, then verify no regression was introduced",
        "Assign the ticket back to the developer with a new priority",
        "Write a new bug report for the fixed issue",
      ],
      correctIndex: 1,
      explanation:
        "RESOLVED means the developer believes the fix is complete. QA must independently verify: reproduce the original steps to confirm the fix works, check the same environment (browser, OS, data set), and do a brief regression check on adjacent functionality. Only then should the ticket move to VERIFIED → CLOSED.",
    },
    {
      question:
        "You observe a failure during exploratory testing but cannot reproduce it after five more attempts. What should you do?",
      options: [
        "Discard it — if it cannot be reproduced it is not a bug",
        "File a bug report immediately with \"steps: unknown\"",
        "File a bug report marked as intermittent, document your reproduction rate (0/5 follow-up attempts), include any evidence from the original occurrence, and note any conditions that might be relevant",
        "Wait until the bug reproduces consistently before reporting it",
      ],
      correctIndex: 2,
      explanation:
        "Intermittent bugs are real bugs. They often indicate race conditions, memory issues, or timing dependencies. Filing with evidence (screenshot, log from the original failure) and reproduction rate (e.g. \"observed once, 0/5 follow-up attempts\") gives developers a signal to investigate even without a reliable reproduction path. Waiting for consistency can mean never filing it.",
    },
    {
      question:
        "A bug report contains two separate issues: a form field that accepts invalid email addresses, AND a button that displays with incorrect styling. How should these be filed?",
      options: [
        "In a single report — they are both on the same form so they are related",
        "As two separate reports — one bug per report, regardless of location",
        "Only file the more severe issue; minor issues can be noted in comments",
        "Combine them if they share the same severity rating",
      ],
      correctIndex: 1,
      explanation:
        "One bug, one report is a core principle. Two issues in one report cannot be independently prioritised, assigned to different developers, tracked separately through the lifecycle, or closed at different times. Combining them creates a report that is \"closed\" when only one issue is fixed — hiding the unresolved second issue.",
    },
  ],

  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
