# Playwright Element Handling Framework

An AI-assisted Playwright + TypeScript project for practicing browser automation against the
[LambdaTest Selenium Playground](https://www.testmuai.com/selenium-playground/). The framework
uses page objects, separate assertion classes, fixtures, lint rules, and GitHub Actions. Every
change is reviewed and merged by a human.

## Project conventions

- Feature cards use sequential IDs `JIRA-001` through `JIRA-999`.
- Framework-only work uses sequential IDs `SETUP-001` through `SETUP-999`.
- One Jira card covers everything handled that day, however many elements that is. One card is
  one branch (named exactly after its ID, for example `JIRA-001`) and one PR.
- A fix for a previously merged card uses `<ID>-fix` (for example, `JIRA-002-fix`). If the
  same card needs another fix later, add a sequence suffix (for example, `JIRA-002-fix-2`).
- Setup branches use their setup ID. Fixes to setup work use `<ID>-fix`.
- No AI agent may merge a PR. A human must approve and merge every PR.
- Test files are grouped by UI element, not by ticket. New cases for tables belong in the same
  table-handling test file; each case and plan references its Jira ID.
- Each element page object has an action/locator file and a separate assertion file.

## Workflow

```text
One Jira card per day (JIRA-001, JIRA-002, ...) covering that day's elements
        |
        v
Planner writes test cases for every element in the card
        |
        v
Human runs: npm run card -- JIRA-001 approve (records name, date, plan fingerprint)
        |
        v
Generator (/jira-generate) implements all elements, only if every guard passes
        |
        v
One PR -> playwright.yml checks -> AI review -> human review and merge
        |
        v
nightly.yml run -> report/artifacts -> failure analysis -> fix PR if needed
```

See [AI agents](#ai-agents) for the planner, generator and healer. A healer may only propose
evidence-based locator or synchronisation fixes and must never weaken, remove or bypass
assertions; its changes still require a human-reviewed PR.

## Project structure

```text
.github/
  agents/                 # Planner, generator and healer agents (Playwright MCP)
  prompts/                # /jira-plan, /jira-generate, /jira-status commands
  workflows/              # playwright.yml (PR), nightly.yml, copilot-setup-steps.yml
  copilot-instructions.md # AI implementation and review guardrails
  pull_request_template.md, PULL_REQUEST_TEMPLATE/setup.md
.vscode/mcp.json          # Playwright test MCP server used by the agents
config/                   # Shared tag definitions
eslint-rules/             # Custom lint rules and their tests
jira-tasks/               # JIRA card records (created by the planner), templates/
scripts/                  # Card commands, test-case validator, report publisher
docker/dashboard/         # Password-protected Allure dashboard (nginx)
docker-compose.yml        # Dashboard service
test-cases/               # <element>-handling.md plans (JIRA-015, JIRA-015.1 ...)
src/
  fixtures/               # Typed fixtures and the shared test entry point
  pages/<element>/        # <element>.page.ts + <element>.assertions.ts
  support/                # Base classes and env helpers
tests/
  <element>-handling.test.ts  # One growing test file per element
  setup/                  # Framework-health checks and the agent seed test
```

## AI agents

Three agents live in [.github/agents/](./.github/agents) and use the Playwright test MCP server
(`.vscode/mcp.json`, started with `npx playwright run-test-mcp-server`; no extra dependency).
Open the repo in VS Code and pick the agent in Copilot Chat.

| Agent                       | Does                                                                                      | Never                                         |
| --------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------- |
| `playwright-test-planner`   | Explores the pages and writes `test-cases/<element>-handling.md` and card files           | Writes code or opens PRs                      |
| `playwright-test-generator` | Writes page, assertions, fixture and test code for approved cards; prepares the card's PR | Weakens assertions, skips tests, merges       |
| `playwright-test-healer`    | Fixes locators and synchronisation on `<ID>-fix` branches, with evidence                  | Changes assertions or expected values, merges |

Daily flow: planner writes the test cases for the day's card, a human approves them, generator
implements every element on the card branch, then the one PR goes through checks and human review.
All three start from the seed test `tests/setup/seed.test.ts`.

## Planning artifacts

- Cards: `jira-tasks/JIRA-###-<name>.md` from [card.md](./jira-tasks/templates/card.md), one per
  day, listing every element covered.
- Test cases: `test-cases/<element>-handling.md` from [TEMPLATE.md](./test-cases/TEMPLATE.md), with
  `## JIRA-015` headings and `### JIRA-015.1` cases. `npm run validate:cases` checks the format.

## The `setup` fixture

Every Playground test starts with `setup(pageName)` from `src/fixtures/test.ts`:

```ts
test('...', { tag: [...] }, async ({ setup, tablePage }) => {
  await setup('Table Data Download');
  // test code
});
```

`setup` opens the Playground and asserts the landing title ("Selenium Grid Online | Run Selenium
Test On Cloud"), opens the named page, then asserts the URL and the page heading. The test body
runs after it. Playwright closes the browser and context after every test, pass or fail.
Valid names, paths and headings live in `config/playground-pages.constant.ts` (44 pages). The
browser tab title is not used to identify a page, because most pages share the same one.

## Card commands

A card moves through guarded states. Each step is one command, and each guard blocks mistakes.

| Step | Command                                       | Who             | What it does                                                                                                   |
| ---- | --------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| 1    | `/jira-plan JIRA-001` (Copilot Chat)          | Planner agent   | Writes test cases and the card file as `planned`                                                               |
| 2    | `npm run card -- JIRA-001 approve` (terminal) | **Human only**  | Asks you to type the card ID, then records your git name, the date and a fingerprint of the plan as `approved` |
| 3    | `/jira-generate JIRA-001` (Copilot Chat)      | Generator agent | Runs `can-generate` first, builds the code, then marks the card `generated`                                    |
| -    | `npm run card -- JIRA-001 status`             | Anyone          | Shows state, case count and whether the plan changed                                                           |
| -    | `npm run card -- JIRA-001 revoke`             | Human           | Returns an approved card to `planned` so the plan can be edited                                                |

What the guards stop:

- Generating from a plan nobody approved. Approval needs an interactive terminal, so an agent cannot do it.
- Generating from a plan edited after approval. The fingerprint no longer matches, so you must approve again. CI (`validate:cases`) fails an approved card whose plan changed.
- Approving or generating from the wrong branch. You must be on the branch named after the card.
- Generating twice. A `generated` card is refused, and a card already generated on `main` is locked. Use `JIRA-001-fix` for later changes.

The five status lines in a card file are managed by these commands only. Do not edit them by hand.

## Test reports dashboard

Tests write Allure results (`allure-results/`). Each published run becomes a numbered build in a
password-protected dashboard served by Docker, with a build dropdown (Latest or any build number),
summary cards, a pass-rate trend and the full Allure report.

```bash
# one-off: put DASHBOARD_USER and DASHBOARD_PASSWORD in .env (see .env.example)
npm test                      # writes allure-results/
npm run report:publish        # creates the next build in report-site/
npm run dashboard:up          # http://localhost:8088, log in with the .env credentials
```

Pipeline runs upload an `allure-results-*` artifact (30 days). To add a CI run to the dashboard,
download the artifact zip and run `npm run report:publish -- --zip <file.zip>`. Java is required to
build reports locally. Stop the dashboard with `npm run dashboard:down`. `report-site/` is
git-ignored, and credentials live only in `.env`.

## Adding a page object

Follow `src/pages/example/`: `<element>.page.ts` holds public locators and actions,
`<element>.assertions.ts` holds every `expect()`, and tests call `<element>Page.assert.*`. Register the
page in `src/fixtures/pages.fixtures.ts`.

## Lint rules

Custom rules in [eslint-rules/](./eslint-rules) run with `npm run lint`: tests need all four tag
groups (from `config/tags.constant.ts`) and an assertion, tests cannot call `page.*()` directly, and
assertion methods must contain `expect()`. Rule tests: `npm run test:rules`.

## Pull request format

Every PR must use a template and keep its section headings (Type, Feature or Setup,
Problem / Description, What was added, Scenarios covered, Validation):

- JIRA cards: [.github/pull_request_template.md](./.github/pull_request_template.md)
- `SETUP-###` work: [.github/PULL_REQUEST_TEMPLATE/setup.md](./.github/PULL_REQUEST_TEMPLATE/setup.md)
  (open with `?template=setup.md` on the compare URL)

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
- [x] `SETUP-002` — custom lint rules (tags, assertions, no raw `page` in tests) with unit tests
- [x] `SETUP-003` — reference page object, assertions class and typed fixtures (`src/pages/example/`)
- [x] `SETUP-004` — card and test-case templates with an ID validator
- [x] `SETUP-005` — Playwright MCP config and planner/generator/healer agents with human approval gates
- [x] `SETUP-006` — `setup` fixture, page registry, one card per day, approval fields
- [x] `SETUP-007` — guarded card commands (plan, approve, generate) and fingerprinting
- [x] `SETUP-008` — Allure reporting and password-protected Docker dashboard
- [ ] `JIRA-001` — first card (planner → approval → generator → one PR)
- [ ] Add AI review and the 24h/48h stale-PR reminder
- [ ] Add failure triage and healer PR workflow

## Security

- Configuration comes from environment variables. Copy `.env.example` to `.env` locally; `.env`
  is git-ignored and must never be committed.
- Store credentials only in GitHub secrets, and non-secret settings (such as `BASE_URL`) in
  GitHub variables.
- Do not add private URLs, credentials, or company-specific material to this repository.

## License

MIT
