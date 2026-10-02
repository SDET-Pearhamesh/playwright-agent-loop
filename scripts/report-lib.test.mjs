import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildEntry, metaFromEnv, nextBuildId, upsertBuild } from './report-lib.mjs';

describe('report-lib', () => {
  it('numbers builds sequentially from 1', () => {
    assert.equal(nextBuildId([]), 1);
    assert.equal(nextBuildId([{ id: 4 }, { id: 2 }]), 5);
  });
  it('summarises Allure statistics', () => {
    const entry = buildEntry({
      id: 3,
      summary: {
        statistic: { total: 8, passed: 6, failed: 1, broken: 1, skipped: 0 },
        time: { duration: 4200 },
      },
      meta: { trigger: 'nightly' },
      now: new Date('2026-10-02T00:00:00Z'),
    });
    assert.equal(entry.passRate, 75);
    assert.equal(entry.durationMs, 4200);
    assert.equal(entry.trigger, 'nightly');
  });
  it('handles an empty run without dividing by zero', () => {
    assert.equal(buildEntry({ id: 1, summary: {} }).passRate, 0);
  });
  it('keeps builds newest first and replaces a repeated id', () => {
    const list = upsertBuild([{ id: 1 }, { id: 2 }], { id: 2, total: 9 });
    assert.deepEqual(
      list.map((b) => b.id),
      [2, 1],
    );
    assert.equal(list[0].total, 9);
  });
  it('reads GitHub Actions metadata and defaults to local', () => {
    assert.equal(metaFromEnv({}).trigger, 'local');
    const meta = metaFromEnv({
      GITHUB_ACTIONS: 'true',
      GITHUB_EVENT_NAME: 'schedule',
      GITHUB_RUN_NUMBER: '7',
      GITHUB_REF_NAME: 'main',
      GITHUB_SHA: 'abcdef1234567',
      GITHUB_REPOSITORY: 'o/r',
      GITHUB_RUN_ID: '99',
    });
    assert.equal(meta.runLabel, 'nightly #7');
    assert.equal(meta.commit, 'abcdef1');
    assert.equal(meta.runUrl, 'https://github.com/o/r/actions/runs/99');
  });
});
