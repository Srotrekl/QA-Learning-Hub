# Contributing

## Adding a topic

1. Create `content/topics/<slug>.ts` — follow the `Topic` type from `lib/types.ts`.
2. Add at least one `codeExample` and five `quiz` questions with explanations.
3. Set `relatedRepoUrl` only to verified public repos (see `CLAUDE.md`).
4. Run `npm test` — all tests must pass.
5. Run `npm run build` — build must succeed.

## Code style

- `npm run format` before committing (prettier + tailwind class sorting).
- `npm run lint` must pass with zero warnings.

## Tests

- Component tests in `tests/components/` using Vitest + React Testing Library.
- E2E smoke test in `tests/e2e/smoke.spec.ts` using Playwright.

## Pull request

Use the PR template — fill in description and checklist.
