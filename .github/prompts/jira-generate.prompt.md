---
description: 'JIRA-001 generate code: build the approved card, only if all gates pass'
agent: playwright-test-generator
---

Generate code for card `${input:cardId:JIRA-001}`.

1. Run `npm run card -- ${input:cardId:JIRA-001} can-generate`. If it exits non-zero, print its
   reasons and stop. Do not work around it, and do not edit the card file's status fields.
2. Follow your generator steps for every element in the card.
3. When `npm run verify` and `npm test` pass, run `npm run card -- ${input:cardId:JIRA-001} complete`.
4. Commit nothing without asking me. Tell me the card is ready for a PR.
