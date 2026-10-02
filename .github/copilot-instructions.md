# Repository-wide implementation rules

- Use Playwright Test and TypeScript. Do not add Cucumber or another BDD layer.
- Use `JIRA-001` through `JIRA-999` for feature cards and `SETUP-001` through `SETUP-999` for
  framework work. Preserve these IDs in plans, test cases, PR descriptions, and commits.
- One Jira card covers everything handled that day, however many elements that is. One card is one
  branch (named after the ID) and one PR. Never split a card into one PR per element, and never
  combine several cards in one branch.
- A feature branch uses the card ID. A fix branch uses `<ID>-fix`, with an
  incrementing suffix for later fixes to the same card. Setup branches use their setup ID.
- Every PR description must follow a template and keep its headings: `.github/pull_request_template.md`
  for JIRA cards and `.github/PULL_REQUEST_TEMPLATE/setup.md` for `SETUP-###`
  work. Fill every section with real details; do not leave placeholder text. Validation must state
  the commands run and their results.
- Never edit a card's `Status`, `Approved by`, `Approved on`, `Plan hash` or `Code generated on`
  lines. Only the `npm run approve|revoke|done JIRA-###` commands change them, and approval is human-only.
- Never generate code unless `npm run generate JIRA-###` succeeds.
- Never merge a PR. AI agents may review and propose changes only; human approval and merge are
  mandatory.
- Group tests by element. Extend that element's existing test file for future cards rather than
  making one new test file per Jira card.
- Each page object owns locators and user actions only. Put Playwright `expect` calls in the
  corresponding `*.assertions.ts` class.
- Tests should use the shared entry point in `src/fixtures/test.ts`. Add typed fixtures there or
  compose typed fixture modules as the framework grows; do not use broad `Function` fixture types.
- Prefer role, label, and test-id locators. Do not use fixed waits, forced actions, focused tests,
  or unreviewed XPath selectors.
- Lint enforces these rules (see `eslint-rules/`): every test has severity, duration, interface and
  domain tags, every test asserts, tests do not call `page.*()` directly, and every public method
  in `*.assertions.ts` contains `expect()`. Never disable them to get a test through.
- Use test tags for severity, duration, interface, and element/domain. Keep their definitions in
  `config/tags.constant.ts`.
- Use `test.step()` for meaningful multi-action flows that improve reports. Do not add meaningless
  wrappers around every single operation.
- A healer may propose evidence-backed locator or synchronization changes. It must never weaken,
  remove, skip, or bypass assertions. Healer changes still go through a human-reviewed PR.
- Do not add secrets, private URLs, or company-specific data. Read configuration from environment
  variables and keep credentials in GitHub secrets.
- Before completing code changes, run `npm run verify` and the relevant Playwright tests.
