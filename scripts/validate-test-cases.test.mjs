import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  findCrossFileDuplicates,
  validateCardFile,
  validateTestCases,
} from './validate-test-cases.mjs';

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

const card = (status, by, on, hash = '-', generated = '-') => `# JIRA-001 — Dropdowns and tables

Status: ${status}
Approved by: ${by}
Approved on: ${on}
Plan hash: ${hash}
Code generated on: ${generated}
`;
const HASH = '0123456789abcdef';

describe('findCrossFileDuplicates', () => {
  it('accepts numbers that continue across element files', () => {
    const files = {
      'a.md': '## JIRA-001 — A\n### JIRA-001.1 — X\n',
      'b.md': '## JIRA-001 — A\n### JIRA-001.2 — Y\n',
    };
    assert.deepEqual(findCrossFileDuplicates(files), []);
  });
  it('rejects a number reused in another file', () => {
    const files = {
      'a.md': '## JIRA-001 — A\n### JIRA-001.1 — X\n',
      'b.md': '## JIRA-001 — A\n### JIRA-001.1 — Y\n',
    };
    assert.match(findCrossFileDuplicates(files).join('\n'), /already used in a.md/);
  });
});

describe('validateCardFile', () => {
  const name = 'JIRA-001-dropdowns-and-tables.md';
  it('accepts planned, approved and generated cards', () => {
    assert.deepEqual(validateCardFile(card('planned', '-', '-'), name), []);
    assert.deepEqual(validateCardFile(card('approved', 'Pratham', '2026-10-02', HASH), name), []);
    const generated = card('generated', 'Pratham', '2026-10-02', HASH, '2026-10-03');
    assert.deepEqual(validateCardFile(generated, name), []);
  });
  it('rejects approval without a name, date or plan hash', () => {
    assert.match(validateCardFile(card('approved', '-', '-'), name).join('\n'), /needs/);
    assert.match(
      validateCardFile(card('approved', 'P', '2026-10-02'), name).join('\n'),
      /Plan hash/,
    );
  });
  it('rejects a planned card that already has approval fields', () => {
    assert.match(validateCardFile(card('planned', 'Pratham', '-'), name).join('\n'), /planned/);
  });
  it('rejects a generated card without a generation date', () => {
    const text = card('generated', 'P', '2026-10-02', HASH);
    assert.match(validateCardFile(text, name).join('\n'), /Code generated on/);
  });
  it('rejects unknown status and mismatched IDs', () => {
    assert.match(validateCardFile(card('done', '-', '-'), name).join('\n'), /Status must be/);
    assert.match(validateCardFile(card('planned', '-', '-'), 'JIRA-002-x.md').join('\n'), /match/);
  });
  it('rejects an approved card whose test cases changed', () => {
    const files = { 'a.md': '## JIRA-001 — A\n### JIRA-001.1 — X\n' };
    const text = card('approved', 'P', '2026-10-02', HASH);
    assert.match(validateCardFile(text, name, files).join('\n'), /changed after approval/);
  });
});
