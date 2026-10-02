# SETUP-002 — Custom lint rules and tags

Status: in review

## Scope

- Add a local ESLint plugin in `eslint-rules/` with four framework rules.
- Read the allowed tags from `config/tags.constant.ts` (single source of truth).
- Unit-test every rule with ESLint `RuleTester` (`npm run test:rules`, part of `npm run verify`).

## Rules

| Rule                                  | Applies to                     | Enforces                                                          |
| ------------------------------------- | ------------------------------ | ----------------------------------------------------------------- |
| `framework/test-tags-required`        | `tests/**/*.test.ts`           | One severity, duration, interface and domain tag; no unknown tags |
| `framework/test-must-call-assert`     | `tests/**/*.test.ts`           | Each test calls a page `.assert.*` method or `expect()`           |
| `framework/no-playwright-api-in-test` | tests, except `tests/setup/`   | No `page.*()` calls in tests; use page object methods             |
| `framework/assert-method-must-expect` | `src/pages/**/*.assertions.ts` | Each public assertion method contains `expect()`                  |

## Acceptance criteria

- `npm run verify` passes, including the rule unit tests.
- A deliberately bad test and assertions file are rejected by the real ESLint config.
