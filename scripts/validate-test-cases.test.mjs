import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validateTestCases } from './validate-test-cases.mjs';

const good = `# Table handling
## JIRA-015 — Table data download
### JIRA-015.1 — Download as CSV
### JIRA-015.2 — Download as PDF
## JIRA-016 — Table data search
### JIRA-016.1 — Search by name
`;

describe('validateTestCases', () => {
  it('accepts well-formed files', () => {
    assert.deepEqual(validateTestCases(good), []);
  });
  it('rejects a case outside its card', () => {
    const text = good.replace('JIRA-016.1', 'JIRA-015.3');
    assert.match(validateTestCases(text).join('\n'), /outside its/);
  });
  it('rejects duplicate cases', () => {
    const text = good.replace('JIRA-015.2', 'JIRA-015.1');
    assert.match(validateTestCases(text).join('\n'), /duplicate test case/);
  });
  it('rejects bad headings and empty cards', () => {
    assert.match(validateTestCases('## Table\n').join('\n'), /card heading/);
    assert.match(validateTestCases('## JIRA-015 — A\n').join('\n'), /no test cases/);
    assert.match(
      validateTestCases('## JIRA-015 — A\n### 15.1 A\n').join('\n'),
      /test case heading/,
    );
  });
  it('rejects the placeholder ID', () => {
    assert.match(
      validateTestCases('## JIRA-000 — A\n### JIRA-000.1 — B\n').join('\n'),
      /placeholder/,
    );
  });
});
