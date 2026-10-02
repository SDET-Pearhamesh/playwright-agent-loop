import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { URL, fileURLToPath } from 'node:url';

import {
  CARD_ID,
  checkAction,
  countCases,
  planFingerprint,
  planSections,
  readField,
  writeFields,
} from './card-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const USAGE = `Commands (run from the terminal):

  npm run plan JIRA-001       check the card can be planned, then tell the planner agent
  npm run approve JIRA-001    human only: confirm the plan and lock it
  npm run generate JIRA-001   check the card can be generated, then tell the generator agent
  npm run done JIRA-001       generator runs this last: marks the card generated
  npm run revoke JIRA-001     human only: take back an approval to edit the plan
  npm run status JIRA-001     show where the card is`;

const git = (...args) => {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
};

const today = () => new Date().toISOString().slice(0, 10);

function load(cardId) {
  const dir = join(root, 'jira-tasks');
  const name = readdirSync(dir).find((f) => f.startsWith(`${cardId}-`) && f.endsWith('.md'));
  if (!name) throw new Error(`No card file jira-tasks/${cardId}-<name>.md. Run the planner first.`);
  const casesDir = join(root, 'test-cases');
  const files = Object.fromEntries(
    readdirSync(casesDir)
      .filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md')
      .map((f) => [f, readFileSync(join(casesDir, f), 'utf8')]),
  );
  const path = join(dir, name);
  const mainCardText =
    git('show', `main:jira-tasks/${name}`) ?? git('show', `origin/main:jira-tasks/${name}`);
  return {
    path,
    state: {
      cardId,
      cardText: readFileSync(path, 'utf8'),
      mainCardText,
      branch: git('rev-parse', '--abbrev-ref', 'HEAD') ?? 'unknown',
      files,
    },
  };
}

function fail(reasons) {
  process.stderr.write(`Blocked:\n${reasons.map((r) => `  - ${r}`).join('\n')}\n`);
  process.exit(1);
}

async function confirm(cardId, summary) {
  if (!process.stdin.isTTY) fail(['Approval needs an interactive terminal. Run it yourself.']);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${summary}\nType ${cardId} to approve: `);
  rl.close();
  if (answer.trim() !== cardId) fail(['Approval cancelled.']);
}

async function main() {
  const [action, cardId] = process.argv.slice(2);
  if (!cardId || !CARD_ID.test(cardId) || !action) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (action === 'plan') {
    const dir = join(root, 'jira-tasks');
    const existing = readdirSync(dir).find((f) => f.startsWith(`${cardId}-`) && f.endsWith('.md'));
    const branch = git('rev-parse', '--abbrev-ref', 'HEAD') ?? 'unknown';
    const reasons = [];
    if (branch !== cardId)
      reasons.push(`You are on "${branch}". Switch to the branch named ${cardId} first.`);
    if (existing && readField(readFileSync(join(dir, existing), 'utf8'), 'Status') !== 'planned') {
      reasons.push(`${cardId} is already past planning. Run: npm run status ${cardId}`);
    }
    if (reasons.length > 0) fail(reasons);
    process.stdout.write(`OK. In Copilot Chat, pick the planner agent and type: plan ${cardId}\n`);
    return;
  }
  const { path, state } = load(cardId);
  const { files, cardText } = state;
  const hash = planFingerprint(cardId, files);

  if (action === 'status') {
    const status = readField(cardText, 'Status');
    const sections =
      planSections(cardId, files)
        .map((s) => s.file)
        .join(', ') || 'none';
    const approvedHash = readField(cardText, 'Plan hash');
    const stale = status === 'approved' && approvedHash !== hash ? ' (changed since approval)' : '';
    process.stdout.write(
      `${cardId}: ${status}\n  branch: ${state.branch}\n  cases: ${countCases(cardId, files)} in ${sections}\n` +
        `  approved by: ${readField(cardText, 'Approved by')} on ${readField(cardText, 'Approved on')}\n` +
        `  plan: ${hash}${stale}\n`,
    );
    return;
  }

  const gate = {
    approve: 'approve',
    generate: 'generate',
    done: 'complete',
    revoke: 'revoke',
  }[action];
  if (!gate) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  const reasons = checkAction({ ...state, action: gate });
  if (reasons.length > 0) fail(reasons);

  if (action === 'generate') {
    process.stdout.write(
      `OK: ${cardId} is approved and its plan (${hash}) is unchanged.\nIn Copilot Chat, pick the generator agent and type: generate ${cardId}\n`,
    );
  } else if (action === 'approve') {
    const by = git('config', 'user.name');
    if (!by) fail(['Set your name first: git config user.name "Your Name"']);
    await confirm(
      cardId,
      `${cardId}: ${countCases(cardId, files)} cases, plan ${hash}. Approving locks this plan.`,
    );
    writeFileSync(
      path,
      writeFields(cardText, {
        Status: 'approved',
        'Approved by': by,
        'Approved on': today(),
        'Plan hash': hash,
      }),
    );
    process.stdout.write(`${cardId} approved by ${by}. Next: npm run generate ${cardId}\n`);
  } else if (action === 'done') {
    writeFileSync(
      path,
      writeFields(cardText, { Status: 'generated', 'Code generated on': today() }),
    );
    process.stdout.write(`${cardId} marked generated.\n`);
  } else {
    writeFileSync(
      path,
      writeFields(cardText, {
        Status: 'planned',
        'Approved by': '-',
        'Approved on': '-',
        'Plan hash': '-',
      }),
    );
    process.stdout.write(`${cardId} is planned again. Edit the test cases, then approve.\n`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
