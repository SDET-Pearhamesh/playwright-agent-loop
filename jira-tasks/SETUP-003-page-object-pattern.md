# SETUP-003 — Page object, assertions and fixture pattern

Status: in review

## Scope

- Reference implementation under `src/pages/example/`: `example.page.ts` (locators and actions) and
  `example.assertions.ts` (all `expect()` calls), reached in tests as `examplePage.assert.*`.
- Typed fixture registry in `src/fixtures/pages.fixtures.ts`, merged into `test` in
  `src/fixtures/test.ts`.
- `tests/setup/page-object-pattern.test.ts` exercises the pattern against a locally served page, so it
  does not depend on the external site.

## How to add a page for a Jira card

1. Create `src/pages/<element>/<element>.page.ts` extending `BasePage` (public locators, actions only).
2. Create `<element>.assertions.ts` extending `BaseAssertions<YourPage>`.
3. Register the page in `PageFixtures` and `pageFixtures`.
4. Add tests to the single `tests/<element>-handling.test.ts` file, with all four tag groups.

## Notes

- `playwright/expect-expect` is off; `framework/test-must-call-assert` replaces it because the plugin
  cannot see `page.assert.*` call chains.

## Acceptance criteria

- `npm run verify` and `npm test` pass.
- A test without an assertion is still rejected by lint.
