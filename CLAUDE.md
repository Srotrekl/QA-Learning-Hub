# QA Learning Hub — Claude Code konvence

## Pravidla pro tento projekt

### Obsah odděleně od kódu

- Témata patří do `content/topics/*.ts` — nikdy do JSX komponent.
- Přidání nového tématu = nový soubor v `/content/topics`, žádný zásah do komponent.

### Accessibility (a11y) — POVINNÉ

- Keyboard navigace na všech interaktivních prvcích (taby, kvíz, tlačítka).
- `aria-*` atributy, správné `role`, focus stavy viditelné.
- Kontrast WCAG AA minimum.

### localStorage

- localStorage používej POUZE v Next.js / Vercel prostředí.
- NIKDY ne v Claude artifact nebo preview verzi.
- Použití: progress témat, theme toggle.

### Design tokeny

- Barvy, spacing a typografie z CSS custom properties v `globals.css`.
- Žádné hardcoded hex hodnoty nebo náhodné px hodnoty v komponentách.

### relatedRepoUrl — povolená repa

Používej pouze tyto ověřené URL, žádné jiné nevymýšlej:

- `https://github.com/Srotrekl/llm-qa-playground`
- `https://github.com/Srotrekl/qa-automation-showcase`
- `https://github.com/Srotrekl/k6-performance-showcase`

### Python kód

- Runnable Python přes Pyodide (lazy-loaded při kliknutí na "Vyzkoušej").
- Pokud Pyodide selže: read-only ukázka s předvyplněným terminálovým výstupem.
- JS/TS vždy runnable přes Sandpack.

### Stack

- Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui
- Vitest + React Testing Library pro unit testy
- Playwright + axe-core pro E2E a11y testy
