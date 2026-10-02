# SETUP-004 — Card, batch and test-case templates

Status: in review

## Scope

- `jira-tasks/templates/card.md` — one Jira card (`jira-tasks/JIRA-###-<name>.md`).
- `jira-tasks/templates/batch.md` — one daily batch (one branch, one PR, many cards).
- `test-cases/TEMPLATE.md` — one file per element, `## JIRA-015` per card, `### JIRA-015.1` per case.
- `scripts/validate-test-cases.mjs` checks real files in `test-cases/` (run by `npm run verify`).

## Validator rules

- Card headings are `## JIRA-015 — Title`; case headings are `### JIRA-015.1 — Title`.
- A case must sit under its own card; no duplicate cards or cases; no empty cards.
- `JIRA-000` is a placeholder and is rejected.

## Acceptance criteria

- `npm run verify` passes, including the validator unit tests.
- A malformed test-case file fails `npm run validate:cases`.
