import type { Topic } from "@/lib/types";

const topic: Topic = {
  slug: "pytest-basics",
  title: "pytest Basics",
  category: "fundamentals",
  difficulty: "junior",
  summary:
    "pytest fundamentals: fixtures, parametrize, markers, and test structure for clean, maintainable test suites.",
  explanation: `## pytest Basics

pytest is Python's most popular testing framework. It's concise, powerful, and scales from a single test file to hundreds of tests.

### Fixtures

Fixtures are reusable setup/teardown functions. Use \`@pytest.fixture\` to define them and inject them by name:

\`\`\`python
@pytest.fixture
def api_client():
    client = APIClient(base_url="https://api.example.com")
    yield client
    client.close()
\`\`\`

### Parametrize

Run the same test with multiple inputs using \`@pytest.mark.parametrize\`:

\`\`\`python
@pytest.mark.parametrize("email", ["", "notanemail", "a@b"])
def test_invalid_email_rejected(email):
    assert not is_valid_email(email)
\`\`\`

### Markers

Mark tests with custom labels: \`@pytest.mark.slow\`, \`@pytest.mark.smoke\`. Run subsets with \`pytest -m smoke\`.

### Structure

Keep test files next to the code (\`tests/\` folder), use descriptive names (\`test_\` prefix), and keep each test focused on one behavior.
`,
  whyItMatters:
    "pytest is the default testing tool in Python QA stacks. Understanding fixtures, parametrize, and markers is the foundation for writing any Python test suite — API, UI, or otherwise.",
  codeExamples: [
    {
      label: "Fixtures and parametrize",
      language: "python",
      runnable: false,
      code: `import pytest

@pytest.fixture
def user_data():
    return {"name": "Alice", "age": 30}

def test_user_name(user_data):
    assert user_data["name"] == "Alice"

@pytest.mark.parametrize("age,expected", [
    (17, False),
    (18, True),
    (65, True),
])
def test_is_adult(age, expected):
    assert (age >= 18) == expected`,
    },
  ],
  quiz: [
    {
      question: "What decorator is used to create a pytest fixture?",
      options: ["@pytest.setup", "@pytest.fixture", "@pytest.before_each", "@fixture"],
      correctIndex: 1,
      explanation:
        "@pytest.fixture marks a function as a fixture. Any test that lists the fixture name as a parameter receives it automatically — pytest handles the injection.",
    },
    {
      question: "How do you run the same test with multiple input values in pytest?",
      options: [
        "Write a for loop inside the test function",
        "Create separate test functions for each case",
        "Use @pytest.mark.parametrize",
        "Use pytest.repeat()",
      ],
      correctIndex: 2,
      explanation:
        "@pytest.mark.parametrize generates separate test cases for each value set. Each case is reported individually — so if one fails, you see exactly which input caused the failure.",
    },
    {
      question: "What does the 'yield' keyword in a fixture do?",
      options: [
        "Returns a value to the test and stops execution",
        "Separates setup (before yield) from teardown (after yield)",
        "Marks the fixture as async",
        "Passes the fixture to child fixtures",
      ],
      correctIndex: 1,
      explanation:
        "yield in a fixture splits it into setup (before yield) and teardown (after yield). The value yielded is injected into the test. Teardown runs after the test completes, even if it fails.",
    },
    {
      question: "Which command runs only tests marked with @pytest.mark.smoke?",
      options: [
        "pytest --tag=smoke",
        "pytest -k smoke",
        "pytest -m smoke",
        "pytest --filter smoke",
      ],
      correctIndex: 2,
      explanation:
        "pytest -m smoke runs only tests with the @pytest.mark.smoke marker. -k is for keyword matching on test names. Markers must be registered in pytest.ini to avoid warnings.",
    },
    {
      question: "What is the recommended naming convention for pytest test files?",
      options: [
        "Files must end with _spec.py",
        "Files must start or end with test_ or _test.py",
        "Files can have any name — pytest finds tests by function name",
        "Files must be in a folder named tests/",
      ],
      correctIndex: 1,
      explanation:
        "By default pytest collects test files named test_*.py or *_test.py. Test functions must start with test_. This is configurable in pytest.ini but the defaults are the standard convention.",
    },
  ],
  relatedRepoUrl: "https://github.com/Srotrekl/qa-automation-showcase",

  cs: {
    summary:
      "Základy pytestem: fixtures, parametrize, markery a struktura testovacích projektů.",
    explanation: `## Pytest Basics

pytest je nejrozšířenější testovací framework pro Python. Nabízí automatické discovery testů, fixtures a výkonné pluginy.

### Fixtures

Fixtures poskytují setup a teardown dat nebo prostředí, které testy potřebují:

\`\`\`python
@pytest.fixture
def db_connection():
    conn = create_connection()
    yield conn
    conn.close()   # teardown po testu
\`\`\`

**Scope fixtures**: \`function\` (výchozí), \`class\`, \`module\`, \`session\` — ovlivňuje, jak často se fixture inicializuje.

### Parametrize

Spustí stejný test s různými vstupními hodnotami:

\`\`\`python
@pytest.mark.parametrize("email,valid", [
    ("user@example.com", True),
    ("not-an-email", False),
    ("", False),
])
def test_email_validation(email, valid):
    assert validate_email(email) == valid
\`\`\`

### Markery

Označování a filtrování testů:
- \`@pytest.mark.slow\` — přeskočit v rychlých bězích
- \`@pytest.mark.smoke\` — jen kritická cesta
- \`@pytest.mark.skip\` / \`@pytest.mark.xfail\` — known issues

### Struktura projektu

\`\`\`
tests/
  conftest.py       ← sdílené fixtures
  test_auth.py
  test_api.py
pytest.ini          ← konfigurace, vlastní markery
\`\`\`
`,
    whyItMatters:
      "pytest je průmyslový standard pro Python QA projekty. Ovládnutí fixtures, parametrize a markerů je základ pro API testování, integrační testy a CI pipeline — dovednosti hledané v každém QA inzerátu pro Python projekty.",
    quiz: [
      {
        question: "Co je pytest fixture?",
        options: [
          "Formát pro assertion zprávy",
          "Znovupoužitelná funkce pro setup/teardown dat nebo prostředí před/po testu",
          "Plugin pro generování HTML reportů",
          "Dekorátor pro přeskočení pomalých testů",
        ],
        correctIndex: 1,
        explanation:
          "Fixture je funkce dekorovaná @pytest.fixture, která poskytuje data nebo prostředí testu. yield umožňuje teardown po dokončení testu — pytest garantuje spuštění teardown i při selhání.",
      },
      {
        question: "Jaký je scope 'session' u pytest fixtures?",
        options: [
          "Fixture se inicializuje před každou testovací funkcí",
          "Fixture se inicializuje jednou za celé testovací sezení pro všechny testy",
          "Fixture je sdílena v rámci jedné testovací třídy",
          "Fixture se inicializuje jednou za každý testovací modul",
        ],
        correctIndex: 1,
        explanation:
          "scope='session' znamená, že fixture se vytvoří jednou a sdílí se napříč celým testovacím sezením. Ideální pro drahé operace jako připojení k databázi nebo auth token — vytvoří se jednou, teardown proběhne na konci.",
      },
      {
        question: "K čemu slouží soubor conftest.py?",
        options: [
          "Konfigurace pytest reportů a výstupu",
          "Sdílené fixtures a helpery dostupné všem testům v adresáři bez importu",
          "Definice vlastních assertion zpráv",
          "Nastavení timeoutů a retry logiky",
        ],
        correctIndex: 1,
        explanation:
          "conftest.py je speciální soubor, který pytest automaticky načte. Fixtures definované zde jsou dostupné všem testům v adresáři a podadresářích bez nutnosti explicitního importu. Jeden conftest.py v root projektu pokryje celou test suite.",
      },
      {
        question: "Jak @pytest.mark.parametrize zkracuje testovací kód?",
        options: [
          "Sloučí více assertion do jednoho testu",
          "Spustí jednu testovací funkci s různými vstupními kombinacemi místo duplikování testu",
          "Automaticky vygeneruje hraniční hodnoty",
          "Umožní sdílet testovací data mezi soubory",
        ],
        correctIndex: 1,
        explanation:
          "parametrize eliminuje copy-paste. Místo 5 téměř identických testovacích funkcí napíšeš jednu s @pytest.mark.parametrize a seznam vstupů. pytest spustí funkci pro každou kombinaci a pojmenuje každý případ pro přehledné reporty.",
      },
      {
        question: "Co dělá @pytest.mark.xfail?",
        options: [
          "Přeskočí test a nezapočítá ho do výsledků",
          "Označí test jako očekávaně selhávající — pokud selže, pytest ho reportuje jako xfail (ne failure)",
          "Označí test jako kritický — přeruší suite při selhání",
          "Spustí test paralelně s ostatními",
        ],
        correctIndex: 1,
        explanation:
          "xfail označuje test pro known bug nebo chování, které ještě není implementováno. Pokud test selže, pytest ho označí jako xfail (expected failure) a neselhá suite. Pokud by test prošel (XPASS), může to signalizovat, že bug byl opraven a marker lze odstranit.",
      },
    ],
  },
};

export default topic;
