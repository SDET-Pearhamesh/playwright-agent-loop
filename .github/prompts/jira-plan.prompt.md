---
description: 'JIRA-001 generate test-cases: plan every element in a card'
agent: playwright-test-planner
---

Plan card `${input:cardId:JIRA-001}`.

1. Run `npm run card -- ${input:cardId:JIRA-001} status` if the card file exists. If its status is
   not `planned`, stop and report the status. Never overwrite an approved or generated plan.
2. Follow your planner steps for the elements and pages I name below (or listed in the card file).
3. Finish with `npm run validate:cases`, then tell me the plan is ready and that I must run
   `npm run card -- ${input:cardId:JIRA-001} approve` myself.
