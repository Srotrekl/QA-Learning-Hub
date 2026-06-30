import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "api-testing",
  title: "API Testing (pytest + requests)",
  category: "api",
  difficulty: "medior",
  summary:
    "REST API testing with pytest and requests: status codes, schema validation, and negative test scenarios.",
  explanation: `## API Testing with pytest + requests

API testing validates that your backend behaves correctly — not just happy paths, but error cases, edge cases, and contracts.

### Key areas

**Status code assertions** — every response has a meaning. 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 422 Unprocessable Entity.

**Schema validation** — use \`jsonschema\` or \`pydantic\` to verify response structure. Catches breaking changes early.

**Negative tests** — test what should fail: invalid auth, missing required fields, out-of-range values.

**Test isolation** — each test creates its own data and cleans up after. No shared state between tests.
`,
  whyItMatters:
    "API testing is often faster, more stable, and more targeted than E2E tests. A QA engineer who can write a solid pytest API suite — with schema validation and negative tests — adds immediate value to any team.",
  codeExamples: [
    {
      label: "pytest API test with schema validation",
      language: "python",
      runnable: false,
      code: `import pytest
import requests

BASE_URL = "https://restful-booker.herokuapp.com"

def test_get_booking_returns_correct_schema():
    response = requests.get(f"{BASE_URL}/booking/1")
    assert response.status_code == 200

    data = response.json()
    assert "firstname" in data
    assert "lastname" in data
    assert "totalprice" in data
    assert isinstance(data["totalprice"], int)

def test_create_booking_with_missing_field_returns_400():
    payload = {"firstname": "Test"}  # missing required fields
    response = requests.post(f"{BASE_URL}/booking", json=payload)
    assert response.status_code in (400, 422)`,
    },
  ],
  quiz: [
    {
      question: "Which HTTP status code indicates a resource was successfully created?",
      options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
      correctIndex: 1,
      explanation:
        "201 Created is returned when a POST request successfully creates a new resource. 200 OK is for successful reads/updates. 204 is for successful deletes with no body.",
    },
    {
      question: "What is the purpose of schema validation in API tests?",
      options: [
        "To check that the server responds within acceptable time",
        "To verify the response structure matches the expected contract",
        "To ensure the API uses HTTPS",
        "To validate that authentication tokens are correct",
      ],
      correctIndex: 1,
      explanation:
        "Schema validation checks that the API response has the expected fields, types, and structure. It catches breaking changes — like a renamed field — before they affect consumers.",
    },
    {
      question: "Why are negative tests important in API testing?",
      options: [
        "They test what happens when the server is down",
        "They verify the API handles invalid inputs, missing fields, and unauthorized access correctly",
        "They measure API performance under load",
        "They check that the API documentation is accurate",
      ],
      correctIndex: 1,
      explanation:
        "Negative tests verify that the API fails gracefully — returning proper error codes and messages for invalid data, missing auth, or out-of-range values. Untested error paths are a common source of production bugs.",
    },
    {
      question: "In pytest, what is a fixture used for?",
      options: [
        "Marking tests to be skipped",
        "Defining expected test output",
        "Providing reusable setup/teardown logic shared across tests",
        "Generating test reports",
      ],
      correctIndex: 2,
      explanation:
        "Fixtures provide reusable setup (and teardown via yield) for tests. An authenticated client, a test database, or test data can all be fixtures — shared without duplication.",
    },
    {
      question:
        "Which tool is most appropriate for validating a JSON response against a defined schema in Python?",
      options: [
        "json.dumps()",
        "assert response.text == expected",
        "pydantic or jsonschema",
        "requests.get().verify",
      ],
      correctIndex: 2,
      explanation:
        "pydantic and jsonschema are purpose-built for schema validation. They catch type mismatches, missing fields, and unexpected values — far more robustly than manual assertions.",
    },
  ],
  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",
};

export default topic;
