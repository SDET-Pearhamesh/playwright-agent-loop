import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { checkAction, countCases, planFingerprint, readField, writeFields } from './card-lib.mjs';

const files = {
  'dropdown-handling.md':
    '## JIRA-001 — Day\n### JIRA-001.1 — A\n\n## JIRA-002 — Other\n### JIRA-002.1 — B\n',
  'table-handling.md': '## JIRA-001 — Day\n### JIRA-001.2 — C\n### JIRA-001.3 — D\n',
};
const cardWith = (status, hash = '-') =>
  `# JIRA-001 — Day\nStatus: ${status}\nApproved by: -\nApproved on: -\nPlan hash: ${hash}\nCode generated on: -\n`;
const base = { cardId: 'JIRA-001', branch: 'JIRA-001', mainCardText: null, files };

describe('plan fingerprint', () => {
  it('counts cases only for the card across files', () => {
    assert.equal(countCases('JIRA-001', files), 3);
  });
  it('ignores other cards and trailing whitespace, but notices real edits', () => {
    const same = planFingerprint('JIRA-001', files);
    const otherCardEdited = {
      ...files,
      'dropdown-handling.md': files['dropdown-handling.md'] + '### JIRA-002.2 — E\n',
    };
    assert.equal(planFingerprint('JIRA-001', otherCardEdited), same);
    const edited = {
      ...files,
      'table-handling.md': files['table-handling.md'].replace('C', 'Changed'),
    };
    assert.notEqual(planFingerprint('JIRA-001', edited), same);
  });
});

describe('checkAction', () => {
  const hash = planFingerprint('JIRA-001', files);
  it('lets a planned card be approved on its branch', () => {
    assert.deepEqual(
      checkAction({ ...base, action: 'approve', cardText: cardWith('planned') }),
      [],
    );
  });
  it('blocks approval on the wrong branch', () => {
    const out = checkAction({
      ...base,
      branch: 'main',
      action: 'approve',
      cardText: cardWith('planned'),
    });
    assert.match(out.join(' '), /Switch to the branch/);
  });
  it('blocks generation for a planned card', () => {
    const out = checkAction({ ...base, action: 'generate', cardText: cardWith('planned') });
    assert.match(out.join(' '), /approve it first/);
  });
  it('allows generation when approved and unchanged', () => {
    assert.deepEqual(
      checkAction({ ...base, action: 'generate', cardText: cardWith('approved', hash) }),
      [],
    );
  });
  it('blocks generation when the plan changed after approval', () => {
    const out = checkAction({
      ...base,
      action: 'generate',
      cardText: cardWith('approved', 'deadbeefdeadbeef'),
    });
    assert.match(out.join(' '), /changed after approval/);
  });
  it('blocks regeneration of a card already generated on the branch', () => {
    const out = checkAction({ ...base, action: 'generate', cardText: cardWith('generated', hash) });
    assert.match(out.join(' '), /already generated/);
  });
  it('locks a card that is generated on main', () => {
    const out = checkAction({
      ...base,
      action: 'generate',
      cardText: cardWith('approved', hash),
      mainCardText: cardWith('generated', hash),
    });
    assert.match(out.join(' '), /JIRA-001-fix/);
  });
});

describe('fields', () => {
  it('reads and writes lines, and rejects a missing line', () => {
    const text = cardWith('planned');
    assert.equal(readField(text, 'Status'), 'planned');
    assert.equal(readField(writeFields(text, { Status: 'approved' }), 'Status'), 'approved');
    assert.throws(() => writeFields(text, { Nope: 'x' }), /no "Nope:"/);
  });
});
