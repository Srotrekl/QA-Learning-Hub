import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "api-testing",
  title: "API Testing (pytest + requests)",
  category: "api",
  difficulty: "medior",
  summary:
    "REST API testing with pytest and requests: status codes, JSON schema validation, fixtures, parametrize, and negative test scenarios.",
  explanation: `## API Testing with pytest + requests

API tests sit between unit tests and E2E tests in the testing pyramid. They exercise the full backend stack — routing, validation, business logic, database — without the overhead or flakiness of a browser. A well-written API test suite is usually the fastest way to build confidence in a backend service.

### Status code assertions

Every HTTP response carries a status code with a defined meaning. Asserting on it is the first line of defence:

| Code | Meaning | When to expect it |
|------|---------|-------------------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST that created a resource |
| 204 | No Content | Successful DELETE with no body |
| 400 | Bad Request | Invalid input, failed validation |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not authorised |
| 404 | Not Found | Resource does not exist |
| 422 | Unprocessable Entity | Semantically invalid body (FastAPI default) |

\`\`\`python
response = requests.get(f"{BASE_URL}/booking/1")
assert response.status_code == 200
\`\`\`

---

### JSON schema validation

Checking status codes alone is not enough — the response body might be structurally wrong. Two common approaches:

**jsonschema** — validates against a JSON Schema dict. Good for quick contract checks.

**pydantic** — parse the response into a typed model. Raises \`ValidationError\` on mismatch. Preferred when you need to reuse the model elsewhere.

\`\`\`python
from pydantic import BaseModel

class Booking(BaseModel):
    firstname: str
    lastname: str
    totalprice: int
    depositpaid: bool

data = response.json()
booking = Booking(**data)  # raises ValidationError if schema is wrong
\`\`\`

---

### Positive vs negative tests

A complete test suite covers both:

**Positive (happy path)** — valid input, correct credentials, expected response body.

**Negative** — what the API must *not* do:
- Accept a request with a missing required field
- Accept an expired or invalid auth token
- Return 200 for a non-existent resource

Negative tests catch the error-handling code that is rarely exercised in manual testing. When a negative test reveals that the API behaves incorrectly (e.g. returns 200 instead of 400 for invalid input), that is a documented defect — and capturing it explicitly is stronger QA work than silently skipping it.

---

### Fixtures for setup and teardown

pytest fixtures provide reusable setup. Common patterns:

\`\`\`python
@pytest.fixture(scope="session")
def auth_token():
    response = requests.post(
        f"{BASE_URL}/auth",
        json={"username": "admin", "password": "password123"},
    )
    return response.json()["token"]

@pytest.fixture
def created_booking(auth_token):
    response = requests.post(f"{BASE_URL}/booking", json=VALID_PAYLOAD)
    booking_id = response.json()["bookingid"]
    yield booking_id
    requests.delete(
        f"{BASE_URL}/booking/{booking_id}",
        headers={"Cookie": f"token={auth_token}"},
    )
\`\`\`

- \`scope="session"\` — fixture runs once for the whole test session (expensive setup like auth)
- \`scope="function"\` (default) — runs fresh for each test (isolated state)
- \`yield\` — code after yield is teardown, guaranteed to run even if the test fails

---

### Parametrize for data-driven tests

\`@pytest.mark.parametrize\` runs the same test logic with multiple inputs — essential for negative tests. When applied against an API that skips input validation (like restful-booker), this pattern immediately surfaces the gap as a documented defect — see the code example below for how \`xfail\` captures this without blocking CI.

\`\`\`python
INVALID_PAYLOADS = [
    ({}, "empty body"),
    ({"firstname": "Jan"}, "missing lastname and price"),
    ({"firstname": "Jan", "lastname": "Novak", "totalprice": "not-a-number"}, "wrong type"),
]

@pytest.mark.parametrize("payload,reason", INVALID_PAYLOADS)
def test_create_booking_rejects_invalid_payload(payload, reason):
    response = requests.post(f"{BASE_URL}/booking", json=payload)
    assert response.status_code in (400, 422), f"Expected rejection for: {reason}"
\`\`\`

This produces three separate test cases with individual pass/fail results and clear names in the report.
`,

  whyItMatters:
    "API tests are faster and more stable than E2E tests — no browser, no UI rendering, no flaky selectors. They test business logic directly and run in seconds rather than minutes. A broken endpoint shows up immediately, before it ever reaches the UI. Teams that invest in a solid API test suite ship faster because regressions are caught at the layer where they are cheapest to fix. For a QA engineer, being able to write pytest suites with schema validation, fixtures, and negative tests is one of the most transferable and in-demand skills across backend stacks.",

  codeExamples: [
    {
      label: "Try it: response validation logic (runs in browser)",
      language: "ts",
      runnable: true,
      code: `// Simulate how an API test validates a response object.
// Real tests use pytest + requests against a live API —
// here we demo the assertion logic in pure TypeScript.

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
}

function validateBookingResponse(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const d = data as Record<string, unknown>;

  if (typeof d.bookingid !== "number") errors.push("bookingid must be a number");

  const b = d.booking as Record<string, unknown> | undefined;
  if (!b) {
    errors.push("booking object is missing");
    return { valid: false, errors };
  }

  if (typeof b.firstname !== "string" || b.firstname.length === 0)
    errors.push("firstname must be a non-empty string");
  if (typeof b.lastname !== "string" || b.lastname.length === 0)
    errors.push("lastname must be a non-empty string");
  if (typeof b.totalprice !== "number" || b.totalprice < 0)
    errors.push("totalprice must be a non-negative number");
  if (typeof b.depositpaid !== "boolean")
    errors.push("depositpaid must be a boolean");

  const dates = b.bookingdates as Record<string, unknown> | undefined;
  if (!dates?.checkin || !dates?.checkout)
    errors.push("bookingdates must have checkin and checkout");

  return { valid: errors.length === 0, errors };
}

const validResponse = {
  bookingid: 42,
  booking: {
    firstname: "Jan",
    lastname: "Novak",
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: "2025-01-01", checkout: "2025-01-05" },
  },
};

const invalidResponse = {
  bookingid: "not-a-number",
  booking: {
    firstname: "",
    totalprice: -50,
    depositpaid: "yes",
  },
};

const r1 = validateBookingResponse(validResponse);
console.log("Valid response:", r1.valid ? "✓ PASS" : "✗ FAIL");

const r2 = validateBookingResponse(invalidResponse);
console.log("Invalid response:", r2.valid ? "✓ PASS" : "✗ FAIL");
r2.errors.forEach((e) => console.log("  Error:", e));

console.log("\\nKey insight: schema validation catches structural bugs");
console.log("that status_code == 200 alone would miss.");`,
    },
    {
      label: "Full pytest suite: fixtures, parametrize, pydantic (Python, read-only)",
      language: "python",
      runnable: false,
      code: `import pytest
import requests
from pydantic import BaseModel, ValidationError

BASE_URL = "https://restful-booker.herokuapp.com"

VALID_PAYLOAD = {
    "firstname": "Jan",
    "lastname": "Novak",
    "totalprice": 150,
    "depositpaid": True,
    "bookingdates": {"checkin": "2025-06-01", "checkout": "2025-06-05"},
    "additionalneeds": "Breakfast",
}

# --- Pydantic schema ---

class BookingDates(BaseModel):
    checkin: str
    checkout: str

class Booking(BaseModel):
    firstname: str
    lastname: str
    totalprice: int
    depositpaid: bool
    bookingdates: BookingDates

class CreateBookingResponse(BaseModel):
    bookingid: int
    booking: Booking

# --- Fixtures ---

@pytest.fixture(scope="session")
def auth_token() -> str:
    # Credentials hardcoded here for demo against a public test API only.
    # In production, read from environment variables:
    #   username = os.environ["API_USERNAME"]
    #   password = os.environ["API_PASSWORD"]
    response = requests.post(
        f"{BASE_URL}/auth",
        json={"username": "admin", "password": "password123"},
    )
    assert response.status_code == 200
    return response.json()["token"]

@pytest.fixture
def created_booking_id(auth_token: str) -> int:
    response = requests.post(f"{BASE_URL}/booking", json=VALID_PAYLOAD)
    assert response.status_code == 200
    booking_id = response.json()["bookingid"]
    yield booking_id
    requests.delete(
        f"{BASE_URL}/booking/{booking_id}",
        headers={"Cookie": f"token={auth_token}"},
    )

# --- Positive tests ---

def test_create_booking_returns_valid_schema():
    response = requests.post(f"{BASE_URL}/booking", json=VALID_PAYLOAD)
    assert response.status_code == 200
    try:
        parsed = CreateBookingResponse(**response.json())
    except ValidationError as e:
        pytest.fail(f"Response schema invalid:\\n{e}")
    assert parsed.booking.firstname == "Jan"

def test_get_booking_by_id(created_booking_id: int):
    response = requests.get(f"{BASE_URL}/booking/{created_booking_id}")
    assert response.status_code == 200
    booking = Booking(**response.json())
    assert booking.totalprice == 150

# --- Negative tests (parametrize) ---

INVALID_PAYLOADS = [
    ({}, "empty body"),
    ({"firstname": "Jan"}, "missing lastname, price, dates"),
    ({"firstname": "Jan", "lastname": "Novak", "totalprice": "free"}, "wrong type"),
]

@pytest.mark.xfail(
    reason=(
        "Known defect in restful-booker: API does not validate input and returns 200 "
        "for malformed payloads instead of 400/422 per REST convention. "
        "Documented bug — xfail records the defect without blocking CI."
    ),
    strict=False,
)
@pytest.mark.parametrize("payload,reason", INVALID_PAYLOADS)
def test_create_booking_rejects_invalid_payload(payload: dict, reason: str):
    # Per REST convention this endpoint SHOULD return 400 or 422 for invalid input.
    # restful-booker intentionally omits input validation (it is a training API),
    # so this test documents the gap rather than asserting incorrect behaviour.
    response = requests.post(f"{BASE_URL}/booking", json=payload)
    assert response.status_code in (400, 422), (
        f"BUG: expected 400/422 for '{reason}', got {response.status_code}. "
        f"API accepted invalid payload without error."
    )

def test_get_nonexistent_booking_returns_404():
    response = requests.get(f"{BASE_URL}/booking/999999")
    assert response.status_code == 404

def test_delete_booking_without_auth_returns_403(created_booking_id: int):
    response = requests.delete(f"{BASE_URL}/booking/{created_booking_id}")
    assert response.status_code == 403

# --- Expected output: ---
# pytest test_booking_api.py -v
#
# test_booking_api.py::test_create_booking_returns_valid_schema          PASSED
# test_booking_api.py::test_get_booking_by_id                            PASSED
# test_booking_api.py::test_create_booking_rejects_invalid_payload[empty body]             XFAIL
# test_booking_api.py::test_create_booking_rejects_invalid_payload[missing lastname...]    XFAIL
# test_booking_api.py::test_create_booking_rejects_invalid_payload[wrong type]             XFAIL
# test_booking_api.py::test_get_nonexistent_booking_returns_404          PASSED
# test_booking_api.py::test_delete_booking_without_auth_returns_403      PASSED
#
# 4 passed, 3 xfailed in 3.47s
#
# XFAIL = expected failure: the test documents a known API defect.
# If restful-booker ever fixes input validation, these cases will become
# XPASS — a signal to remove the xfail marker and promote them to passing tests.
`,
    },
  ],

  quiz: [
    {
      question: "Which HTTP status code should a REST API return when a POST request creates a new resource successfully?",
      options: [
        "200 OK",
        "201 Created",
        "204 No Content",
        "202 Accepted",
      ],
      correctIndex: 1,
      explanation:
        "201 Created is the correct response for a successful resource creation. 200 OK signals a successful read or update. 204 No Content is used for successful deletes with no response body. 202 Accepted means the request was accepted but processing is not yet complete.",
    },
    {
      question: "What is the advantage of using pydantic for API response validation over manual field assertions?",
      options: [
        "pydantic is faster at making HTTP requests than the requests library",
        "pydantic validates the full structure and types in one step, raising a detailed ValidationError on any mismatch",
        "pydantic automatically retries failed requests",
        "pydantic generates the test payloads automatically",
      ],
      correctIndex: 1,
      explanation:
        "With manual assertions you check one field at a time and can miss fields you forgot to assert. pydantic parses the entire response into a typed model — if any field is missing or has the wrong type, ValidationError tells you exactly what failed and where.",
    },
    {
      question: "A pytest fixture with scope='session' runs:",
      options: [
        "Once per test function, providing isolated state for each test",
        "Once per test module (file)",
        "Once for the entire test session, shared across all tests that request it",
        "On every parametrize iteration independently",
      ],
      correctIndex: 2,
      explanation:
        "scope='session' means the fixture is set up once when the first test that needs it runs, and torn down after the last test in the session. It is ideal for expensive operations like obtaining an auth token — you pay the cost once and share the result across all tests.",
    },
    {
      question: "You have 10 invalid payload variations to test against a POST endpoint. What is the most maintainable way to write these in pytest?",
      options: [
        "Write 10 separate test functions, one per payload",
        "Put all payloads in a single test function with a for loop",
        "Use @pytest.mark.parametrize to run one test function with all 10 payloads as inputs",
        "Write a single test that sends all 10 requests and asserts at the end",
      ],
      correctIndex: 2,
      explanation:
        "@pytest.mark.parametrize generates 10 independent test cases from one function. Each case has its own pass/fail result and a generated name in the report. A for loop inside a single test stops at the first failure and loses visibility into which inputs passed.",
    },
    {
      question: "An API returns 200 OK for a POST request with a completely empty body, where required fields are missing. What is the correct QA response?",
      options: [
        "Accept it — if the server returns 200, the behaviour is by definition correct",
        "Mark the test as skipped since the API is unpredictable",
        "Document it as a defect: per REST convention the API should return 400 or 422, and use pytest.mark.xfail to record the known failure without blocking CI",
        "Delete the negative test — it only adds noise if it always fails",
      ],
      correctIndex: 2,
      explanation:
        "A 200 response for invalid input is a bug — REST convention requires 400 Bad Request or 422 Unprocessable Entity when required fields are missing. pytest.mark.xfail is the right tool: it documents the defect in the test suite, keeps CI green, and will surface as XPASS if the API is ever fixed — prompting removal of the marker.",
    },
  ],

  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",

  cs: {
    summary:
      "API testování s pytestem a requests: HTTP metody, JSON schema validace, autentizace, pozitivní a negativní testy.",
    explanation: `## API Testing (pytest + requests)

API testování ověřuje HTTP rozhraní přímo — bez prohlížeče. Každý endpoint má definované vstupy, výstupy a chování při chybách.

### Klíčové HTTP koncepty

Každá API odpověď obsahuje **status kód**, **hlavičky** a **tělo (JSON)**:

| Rozsah | Kategorie |
|--------|-----------|
| 2xx | Úspěch (200 OK, 201 Created, 204 No Content) |
| 4xx | Chyba klienta (400 Bad Request, 401 Unauthorized, 404 Not Found) |
| 5xx | Chyba serveru (500 Internal Server Error) |

### Pozitivní a negativní testy

**Pozitivní test** — ověří, že správný vstup vrátí očekávaný výstup.
**Negativní test** — ověří, že neplatný vstup vrátí chybu (ne 500, ne 200 s prázdnými daty).

### JSON Schema validace

Validace struktury odpovědi — ne jen status kódu:
- Správné datové typy (string, number, boolean)
- Povinná pole přítomna
- Hodnoty v povoleném rozsahu

### Fixtures a parametrize

**Fixtures** — znovupoužitelný setup (base URL, přihlašovací token, testovací data).
**parametrize** — spuštění stejného testu s různými vstupními hodnotami bez duplikování kódu.
`,
    whyItMatters:
      "API testing je základ moderního QA — je rychlejší než E2E testy, méně křehký a pokrývá business logiku přímo. Ovládat pytest + requests a JSON schema validaci je klíčová dovednost pro API a backend role.",
    quiz: [
      {
        question: "Jaký HTTP status kód vrací API při úspěšném vytvoření nového zdroje (POST)?",
        options: ["200 OK", "201 Created", "204 No Content", "202 Accepted"],
        correctIndex: 1,
        explanation:
          "201 Created signalizuje úspěšné vytvoření. 200 OK je pro úspěšné GET nebo PUT (aktualizace). 204 No Content je pro DELETE nebo operace bez těla odpovědi.",
      },
      {
        question: "Proč testovat negativní scénáře v API testech?",
        options: [
          "Negativní testy ověřují, že API vrátí 200 i pro neplatné vstupy",
          "Ověřují, že API správně odmítne neplatné vstupy a vrátí správné chybové kódy místo pádu serveru",
          "Negativní testy jsou pouze pro bezpečnostní testování",
          "Slouží k měření výkonu endpointů",
        ],
        correctIndex: 1,
        explanation:
          "API musí správně zpracovat neplatné vstupy — vrátit 400 nebo 422 místo 500. Pokud API při neplatném vstupu vrátí 500, jde o bezpečnostní riziko a chybu v error handlingu.",
      },
      {
        question: "Co validuje JSON Schema validace navíc oproti pouhé kontrole status kódu?",
        options: [
          "Rychlost odpovědi API",
          "Strukturu a datové typy těla odpovědi (pole, typy, formáty)",
          "Správnost HTTP hlaviček",
          "Autentizaci a autorizaci",
        ],
        correctIndex: 1,
        explanation:
          "Status kód 200 říká jen, že request uspěl — ale tělo může mít chybějící pole nebo špatné typy. JSON Schema validace zachytí tyto strukturální problémy dříve, než se projeví v UI nebo downstream systémech.",
      },
      {
        question: "Jak slouží pytest fixtures v API testech?",
        options: [
          "Generují náhodná testovací data",
          "Poskytují znovupoužitelný setup (base URL, auth token, testovací data) sdílený napříč testy",
          "Mockují HTTP odpovědi bez skutečného volání API",
          "Spouštějí testy paralelně",
        ],
        correctIndex: 1,
        explanation:
          "Fixtures v pytestem definují znovupoužitelný setup a teardown. Například fixture 'auth_token' se přihlásí jednou a vrátí token — test pak dostane token automaticky bez opakování login logiky.",
      },
      {
        question: "K čemu slouží @pytest.mark.parametrize v API testech?",
        options: [
          "Označení pomalých testů pro přeskočení v CI",
          "Spuštění stejného testu s různými vstupními hodnotami bez duplikování kódu",
          "Paralelní spuštění testů na více vláknech",
          "Označení expectedFailure testů",
        ],
        correctIndex: 1,
        explanation:
          "parametrize eliminuje copy-paste testů. Jeden test se spustí pro každou kombinaci vstupů — například validní email, email bez @, prázdný string — a pytest automaticky pojmenuje každý případ.",
      },
    ],
  },
};

export default topic;
