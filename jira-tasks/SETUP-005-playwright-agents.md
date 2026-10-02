# SETUP-005 — Playwright MCP and planner, generator, healer agents

Status: in review

## Scope

- Generated with `npx playwright init-agents --loop=vscode`, then rewritten to follow our rules.
- `.vscode/mcp.json`: Playwright test MCP server (`npx playwright run-test-mcp-server`), now tracked
  (removed from `.gitignore`). It contains no secrets.
- `.github/agents/`: planner, generator and healer.
- `tests/setup/seed.test.ts` replaces the generated `seed.spec.ts` and follows our lint rules.
- `.github/workflows/copilot-setup-steps.yml`: fixed (the generated file ran a non-existent
  `npx run build` step) and aligned with our Node and action versions.
- Removed the empty `specs/` folder; plans go to `test-cases/`.

## Agent rules

- Planner: writes `test-cases/<element>-handling.md` in our format, validated by
  `npm run validate:cases`; stops for human approval.
- Generator: page + assertions + fixture + one test file per element; never raw `page` in tests,
  never skips or weakens tests; one branch and one PR per batch; never merges.
- Healer: locators and synchronisation only, with evidence; real defects are reported, not hidden.

## Acceptance criteria

- `npm run verify` and `npm test` pass.
- Agents reference only files and tags that exist in this repo.
