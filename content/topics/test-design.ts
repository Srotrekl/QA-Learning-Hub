import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "test-design",
  title: "Test Design Techniques",
  category: "fundamentals",
  difficulty: "medior",
  summary:
    "Systematic test design: equivalence partitioning, boundary value analysis, decision tables, state transition testing, and pairwise testing.",

  explanation: `## Test Design Techniques

Ad-hoc testing finds obvious bugs. Systematic test design finds the bugs that hide at the edges — the ones that ship to production and appear in incident reports. These five techniques give you a repeatable process for generating test cases that cover the input space efficiently.

### Equivalence Partitioning

The idea: inputs that behave identically can be represented by a single test. Instead of testing every possible age value (0–150), divide the space into classes that the system treats the same way:

| Partition | Example values | Expected behaviour |
|-----------|---------------|-------------------|
| Valid age | 18, 45, 64 | Accepted |
| Below minimum | 0, 1, 17 | Rejected — too young |
| Above maximum | 65, 100, 150 | Rejected — too old |

One test per partition is enough to represent the class. Testing 18, 19, 20, 21… inside the valid range adds zero coverage — they all exercise the same path.

---

### Boundary Value Analysis

Bugs cluster at boundaries because developers write conditions like \`if age >= 18\` and get the operator wrong (\`>\` vs \`>=\`), or use \`<\` where they meant \`<=\`. BVA targets exactly these points:

For a valid range of **18–64**:

| Point | Value | Why test it |
|-------|-------|-------------|
| Just below lower | 17 | Should be rejected |
| Lower boundary | 18 | Should be accepted |
| Just above lower | 19 | Should be accepted |
| Just below upper | 63 | Should be accepted |
| Upper boundary | 64 | Should be accepted |
| Just above upper | 65 | Should be rejected |

The pair (17, 18) catches an off-by-one on the lower bound. The pair (64, 65) catches an off-by-one on the upper bound. The interior (19–63) is covered by equivalence partitioning — no need to test it exhaustively.

---

### Decision Tables

When behaviour depends on combinations of conditions, a decision table makes every combination explicit. This prevents the common mistake of testing conditions independently and missing interactions.

Example — discount eligibility (member status + cart total):

| Condition | R1 | R2 | R3 | R4 |
|-----------|----|----|----|----|
| Is member? | Y | Y | N | N |
| Cart ≥ 100? | Y | N | Y | N |
| **Discount** | **10%** | **5%** | **5%** | **0%** |

4 rules → 4 test cases. Any system with 2 binary conditions has exactly 4 combinations. Adding a third condition doubles the table — and the test effort required to cover it.

---

### State Transition Testing

Some systems don't just process inputs — they remember state. A user account can be ACTIVE, LOCKED, or SUSPENDED. An order can be PENDING, CONFIRMED, SHIPPED, or CANCELLED. State transition testing maps valid transitions and invalid ones:

\`\`\`
PENDING ──[confirm]──► CONFIRMED ──[ship]──► SHIPPED
    │                       │
    └──[cancel]──► CANCELLED └──[cancel]──► CANCELLED
\`\`\`

Test cases to write:
- Every valid transition (happy paths)
- Invalid transitions (e.g. trying to ship a CANCELLED order — should error)
- Boundary events (e.g. what happens to PENDING after 30 days with no action?)

---

### Pairwise Testing

If a checkout form has 4 dropdowns — browser (3 options), OS (3), payment method (4), shipping (2) — exhaustive testing requires 3×3×4×2 = **72 combinations**. Pairwise testing exploits a statistical finding: most bugs are triggered by the interaction of **two** parameters, not three or four.

A pairwise set covers every pair of parameter values at least once and typically reduces 72 combinations to **9–18** — with comparable defect detection.

Tools: PICT (Microsoft), AllPairs, or online pairwise generators.
`,

  whyItMatters:
    "Random clicking and intuition-based testing are not scalable. As a system grows, the number of possible inputs grows faster than any team's time to test. Systematic test design solves this with a principled answer to the question: 'which test cases do I write?' Equivalence partitioning reduces redundant tests. Boundary value analysis targets the exact input points where off-by-one errors live. Decision tables surface combination bugs that developers overlook. State transition testing catches invalid-state exploits before security researchers do. Pairwise testing cuts a combinatorial explosion down to a manageable set without sacrificing coverage of the most common failure modes. These techniques are asked about in QA interviews at every level. More importantly, they are the difference between a test suite that merely passes CI and one that actually prevents regressions.",

  codeExamples: [
    {
      label: "BVA demo: off-by-one bug caught by boundary values (runs in browser)",
      language: "ts",
      runnable: true,
      code: `// BVA demo: a function that accepts ages 18–64.
// Run this to see which boundary values reveal off-by-one bugs.

function isEligibleAge(age: number): boolean {
  // Intentional off-by-one on upper bound — common developer mistake.
  // The spec says 64 should be ACCEPTED, but this implementation rejects it.
  return age >= 18 && age < 64;   // bug: should be age <= 64
}

// Equivalence partition representatives
const partitions = [
  { age: 10,  expected: false, label: "below minimum (partition)" },
  { age: 40,  expected: true,  label: "valid range (partition)" },
  { age: 70,  expected: false, label: "above maximum (partition)" },
];

// Boundary value analysis points
const boundaries = [
  { age: 17, expected: false, label: "just below lower bound" },
  { age: 18, expected: true,  label: "lower bound (18)" },
  { age: 19, expected: true,  label: "just above lower bound" },
  { age: 63, expected: true,  label: "just below upper bound" },
  { age: 64, expected: true,  label: "upper bound (64)" },   // ← catches the bug
  { age: 65, expected: false, label: "just above upper bound" },
];

console.log("=== Equivalence Partitions ===");
for (const { age, expected, label } of partitions) {
  const result = isEligibleAge(age);
  const pass = result === expected;
  console.log(\`\${pass ? "✓" : "✗"} age=\${age}  [\${label}]\`);
}

console.log("\\n=== Boundary Value Analysis ===");
for (const { age, expected, label } of boundaries) {
  const result = isEligibleAge(age);
  const pass = result === expected;
  console.log(\`\${pass ? "✓" : "✗"} age=\${age}  [\${label}]\`);
}

console.log("\\nKey insight: EP with age=40 passes — the bug is invisible.");
console.log("BVA with age=64 catches it immediately.");`,
    },
    {
      label: "Decision table test cases: discount eligibility (runs in browser)",
      language: "ts",
      runnable: true,
      code: `// Decision table test cases — discount eligibility
// Generated from: 2 conditions × 2 states = 4 rules
//
// | isMember | cartTotal ≥ 100 | discount |
// |----------|-----------------|----------|
// |  true    |      true       |   10%    |
// |  true    |      false      |    5%    |
// |  false   |      true       |    5%    |
// |  false   |      false      |    0%    |

function getDiscount(isMember: boolean, cartTotal: number): number {
  if (isMember && cartTotal >= 100) return 10;
  if (isMember)                     return 5;
  if (cartTotal >= 100)             return 5;
  return 0;
}

// One test case per decision table rule:
const cases = [
  { isMember: true,  cart: 150, expected: 10, rule: "R1" },
  { isMember: true,  cart: 50,  expected: 5,  rule: "R2" },
  { isMember: false, cart: 150, expected: 5,  rule: "R3" },
  { isMember: false, cart: 50,  expected: 0,  rule: "R4" },
];

for (const { isMember, cart, expected, rule } of cases) {
  const result = getDiscount(isMember, cart);
  const pass = result === expected;
  console.log(\`\${pass ? "✓" : "✗"} [\${rule}] member=\${isMember}, cart=\${cart} → \${result}% (expected \${expected}%)\`);
}`,
    },
  ],

  quiz: [
    {
      question:
        "A login form accepts passwords between 6 and 20 characters. Using boundary value analysis, which set of test values gives the best coverage?",
      options: [
        "5, 6, 7, 19, 20, 21",
        "6, 12, 20",
        "1, 10, 25",
        "5, 10, 15, 20",
      ],
      correctIndex: 0,
      explanation:
        "BVA targets the boundaries and their immediate neighbours: 5 (just below min), 6 (min), 7 (just above min), 19 (just below max), 20 (max), 21 (just above max). Testing only 6, 12, 20 misses the off-by-one neighbours that reveal operator errors like > vs >=.",
    },
    {
      question:
        "You are testing a discount system with two conditions: user is a premium member (yes/no) and order total is over €50 (yes/no). How many test cases does a complete decision table require?",
      options: ["2", "4", "6", "8"],
      correctIndex: 1,
      explanation:
        "A decision table with 2 binary conditions has 2² = 4 rules. Each rule represents a unique combination of conditions and maps to one expected outcome. All 4 must be tested to confirm there are no combination bugs.",
    },
    {
      question:
        "What is the primary advantage of equivalence partitioning over testing every possible input value?",
      options: [
        "It guarantees 100% code coverage",
        "It finds more bugs per test case by focusing on boundary values",
        "It reduces the number of test cases while maintaining representative coverage — inputs in the same partition are expected to behave identically",
        "It eliminates the need for negative test cases",
      ],
      correctIndex: 2,
      explanation:
        "EP groups inputs that should produce the same behaviour. Testing one value from each partition is sufficient — testing ten values in the same partition exercises the same code path and adds no new information. The reduction is dramatic for large input spaces.",
    },
    {
      question:
        "An e-commerce order system has states: PENDING → CONFIRMED → SHIPPED → DELIVERED. Which test case is most important to include in a state transition test suite, beyond the happy path?",
      options: [
        "Confirming that PENDING → CONFIRMED works correctly",
        "Attempting an invalid transition — e.g. shipping an order that is still PENDING",
        "Verifying that the DELIVERED state displays the correct text",
        "Testing that two orders can exist in PENDING state simultaneously",
      ],
      correctIndex: 1,
      explanation:
        "State transition testing must cover both valid transitions (the happy path) AND invalid transitions — actions that should be rejected because the system is in the wrong state. Invalid transitions are where unauthorised state changes, data corruption, and security exploits often hide.",
    },
    {
      question:
        "A configuration screen has 3 parameters: theme (light/dark), language (EN/CS/DE), and notifications (on/off). Exhaustive testing requires 2×3×2 = 12 combinations. What does pairwise testing reduce this to, and why?",
      options: [
        "6 combinations — it tests each parameter value exactly once",
        "4 combinations — it skips all negative test cases",
        "6 combinations — it covers every pair of parameter values at least once, because most bugs are triggered by interactions of two parameters",
        "3 combinations — one per parameter",
      ],
      correctIndex: 2,
      explanation:
        "Pairwise testing is grounded in empirical data: the majority of software defects are caused by the interaction of two input parameters. A pairwise set guarantees that every combination of any two parameter values appears at least once. For this specific input (2×3×2), the minimum pairwise set is 6 — determined by the largest pairwise product (language × notifications = 3×2). This halves the 12 exhaustive combinations without sacrificing coverage of two-way interactions.",
    },
  ],

  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
