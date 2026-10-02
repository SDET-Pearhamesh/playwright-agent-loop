## Summary

<!-- What changed and why. -->

## Covered cards

<!-- One PR per batch. List every ID, e.g. JIRA-001 ... JIRA-005, or SETUP-002. -->

| ID  | Description | Acceptance criteria covered |
| --- | ----------- | --------------------------- |
|     |             |                             |

## Review checklist

- [ ] Branch name follows the convention (`JIRA-001`, `JIRA-001-to-JIRA-005`, `SETUP-001`, `<ID>-fix`)
- [ ] Page actions and assertions are in separate files (`XPage.ts` / `XPage.assertions.ts`)
- [ ] Tests for an element extend that element's single test file
- [ ] Tests carry severity, duration, interface and domain tags
- [ ] No fixed waits, forced actions, focused tests, or weakened assertions
- [ ] No secrets, private URLs, or company-specific data
- [ ] `npm run verify` and `npm test` pass
