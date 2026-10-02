# <Element> handling — test cases

One file per element. New cards for the same element add a new `##` section here, and their tests
go into the same `tests/<element>-handling.test.ts` file.

## JIRA-000 — <Card title>

Page: <Selenium Playground page name>

### JIRA-000.1 — <Scenario title>

- Tags: `@normal @fast @ui @<domain>`
- Preconditions: <state before the test>
- Steps:
  1. <action>
  2. <action>
- Expected: <observable result, which becomes a page `assert.*` method>

### JIRA-000.2 — <Scenario title>

- Tags: `@minor @fast @ui @<domain>`
- Preconditions: <state before the test>
- Steps:
  1. <action>
- Expected: <observable result>
