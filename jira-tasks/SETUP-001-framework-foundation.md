# SETUP-001 — Framework foundation

Status: complete

## Scope

- Establish the Playwright + TypeScript project and shared test entry point.
- Add a base page and assertion class for the page-object convention.
- Add formatting, lint, type-check, commit-message, and pre-commit quality gates.
- Document Jira/setup IDs, one-PR-per-batch, branch naming, and human-only merge policy.
- Add `playwright.yml` for PR checks and `nightly.yml` for scheduled runs.
- Add a browser/framework smoke test that does not rely on the external target website.

## Acceptance criteria

- `npm ci`, `npm run verify`, and `npm test` pass locally.
- The PR workflow runs validation for pull requests targeting `main`.
- The nightly workflow is scheduled for 02:00 India Standard Time and supports manual runs.
- No feature-element handling tests are included in this setup card.
