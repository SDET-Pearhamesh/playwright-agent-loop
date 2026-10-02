# Playwright Element Handling Framework

An AI-assisted Playwright + TypeScript project for practicing browser automation against the
[LambdaTest Selenium Playground](https://www.testmuai.com/selenium-playground/). The framework
uses page objects, separate assertion classes, fixtures, lint rules, and GitHub Actions. Every
change is reviewed and merged by a human.

## Project conventions

- Feature cards use sequential IDs `JIRA-001` through `JIRA-999`.
- Framework-only work uses sequential IDs `SETUP-001` through `SETUP-999`.
- A single-card feature branch is named exactly after its ID (for example, `JIRA-001`).
- A multi-card daily batch uses one branch and one PR named for its covered range
  (for example, `JIRA-001-to-JIRA-005`). Each card remains individually traceable in the PR.
- A fix for a previously merged card uses `<ID>-fix` (for example, `JIRA-002-fix`). If the
  same card needs another fix later, add a sequence suffix (for example, `JIRA-002-fix-2`).
- Setup branches use their setup ID. Fixes to setup work use `<ID>-fix`.
- No AI agent may merge a PR. A human must approve and merge every PR.
- Test files are grouped by UI element, not by ticket. New cases for tables belong in the same
  table-handling test file; each case and plan references its Jira ID.
- Each element page object has an action/locator file and a separate assertion file.

## Workflow

```text
One or more Jira cards
        |
        v
Planner creates a plan and test cases for each card
        |
        v
Human approves the batch plan
        |
        v
Generator implements all approved cards on one batch branch
        |
        v
One PR -> playwright.yml checks -> AI review -> human review and merge
        |
        v
nightly.yml run -> report/artifacts -> failure analysis -> fix PR if needed
```

The planner, generator, and healer workflow will be added incrementally. A healer may propose
evidence-based locator or synchronization fixes, but must not weaken, remove, or bypass
assertions; its changes still require a human-reviewed PR.

## Project structure

```text
.github/
  workflows/              # playwright.yml (PR) and nightly.yml
  copilot-instructions.md # AI implementation and review guardrails
config/                   # Shared tag definitions
docs/adr/                 # Architecture decisions
jira-tasks/               # Ticket template and setup/feature records
src/
  fixtures/               # Shared Playwright test entry point
  pages/<element>/        # <Element>Page.ts + <Element>Page.assertions.ts
  support/base/           # Base page and assertion classes
tests/
  <element>/              # One growing test file per element
  setup/                  # Framework-health checks only
```

## Getting started

Requirements: Node.js 22 LTS or newer supported LTS, npm, and the Playwright Chromium browser.

```bash
npm ci
cp .env.example .env      # then set BASE_URL
npx playwright install chromium
npm run verify
npm test
```

The local framework-health smoke test uses a blank browser page and does not depend on the
external Selenium Playground being available.

## Current progress

- [x] `SETUP-001` — Playwright/TypeScript foundation, conventions, quality gates, PR/nightly
      workflow skeleton, and framework smoke test
- [ ] Add the Playwright element POM/fixture extension pattern and the first Jira card
- [ ] Add planner/generator/healer definitions with human approval gates
- [ ] Add ticket planning and batch workflow automation
- [ ] Add Allure reporting and publishable run history
- [ ] Add failure triage and healer PR workflow

## Security

- Configuration comes from environment variables. Copy `.env.example` to `.env` locally; `.env`
  is git-ignored and must never be committed.
- Store credentials only in GitHub secrets, and non-secret settings (such as `BASE_URL`) in
  GitHub variables.
- Do not add private URLs, credentials, or company-specific material to this repository.

## License

MIT
