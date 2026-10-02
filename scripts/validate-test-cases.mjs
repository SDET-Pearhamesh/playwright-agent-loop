import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

import { STATUSES, planFingerprint } from './card-lib.mjs';

const CARD = /^## (JIRA-\d{3}) — \S.*$/;
const CASE = /^### (JIRA-\d{3})\.(\d+) — \S.*$/;

/** Returns a list of problems found in one test-case markdown file. */
export function validateTestCases(text, fileName = 'file') {
  const problems = [];
  const seenCards = new Set();
  const seenCases = new Set();
  let currentCard = null;
  let casesInCard = 0;

  const closeCard = () => {
    if (currentCard && casesInCard === 0) {
      problems.push(`${fileName}: ${currentCard} has no test cases`);
    }
  };

  text.split('\n').forEach((line, index) => {
    const where = `${fileName}:${index + 1}`;
    if (line.startsWith('### ')) {
      const match = CASE.exec(line);
      if (!match) {
        problems.push(`${where}: test case heading must look like "### JIRA-015.1 — Title"`);
        return;
      }
      const [, card, number] = match;
      if (card !== currentCard) {
        problems.push(`${where}: ${card}.${number} is outside its "## ${card}" section`);
      }
      if (seenCases.has(`${card}.${number}`)) {
        problems.push(`${where}: duplicate test case ${card}.${number}`);
      }
      seenCases.add(`${card}.${number}`);
      casesInCard += 1;
    } else if (line.startsWith('## ')) {
      closeCard();
      const match = CARD.exec(line);
      if (!match) {
        problems.push(`${where}: card heading must look like "## JIRA-015 — Title"`);
        currentCard = null;
        return;
      }
      if (match[1] === 'JIRA-000') {
        problems.push(`${where}: JIRA-000 is a placeholder ID`);
      }
      if (seenCards.has(match[1])) problems.push(`${where}: duplicate card ${match[1]}`);
      seenCards.add(match[1]);
      currentCard = match[1];
      casesInCard = 0;
    }
  });
  closeCard();
  return problems;
}

/** Returns the case IDs (for example JIRA-001.2) defined in a test-case file. */
export function collectCaseIds(text) {
  return text.split('\n').flatMap((line) => {
    const match = CASE.exec(line);
    return match ? [`${match[1]}.${match[2]}`] : [];
  });
}

/** Reports case IDs that appear in more than one file. */
export function findCrossFileDuplicates(filesByName) {
  const owner = new Map();
  const problems = [];
  for (const [fileName, text] of Object.entries(filesByName)) {
    for (const id of collectCaseIds(text)) {
      const first = owner.get(id);
      if (first && first !== fileName) {
        problems.push(`${fileName}: ${id} is already used in ${first}`);
      } else {
        owner.set(id, fileName);
      }
    }
  }
  return problems;
}

/** Validates a card file such as jira-tasks/JIRA-001-dropdowns.md. */
export function validateCardFile(text, fileName, files) {
  const problems = [];
  const idFromName = /^(JIRA-\d{3})-/.exec(fileName)?.[1];
  const title = /^# (JIRA-\d{3}) — \S.*$/m.exec(text);
  if (!title) problems.push(`${fileName}: first heading must look like "# JIRA-001 — Title"`);
  else if (title[1] !== idFromName) {
    problems.push(`${fileName}: heading ID ${title[1]} does not match the file name`);
  }
  const field = (name) => new RegExp(`^${name}: (.*)$`, 'm').exec(text)?.[1]?.trim();
  const status = field('Status');
  if (!status || !STATUSES.includes(status)) {
    problems.push(`${fileName}: Status must be one of ${STATUSES.join(', ')}`);
    return problems;
  }
  const by = field('Approved by');
  const on = field('Approved on');
  const hash = field('Plan hash');
  const generatedOn = field('Code generated on');
  if ([by, on, hash, generatedOn].includes(undefined)) {
    problems.push(
      `${fileName}: needs "Approved by:", "Approved on:", "Plan hash:" and "Code generated on:" lines`,
    );
    return problems;
  }
  const date = /^\d{4}-\d{2}-\d{2}$/;
  if (status === 'planned') {
    if ([by, on, hash, generatedOn].some((v) => v !== '-')) {
      problems.push(
        `${fileName}: a planned card must have "-" in every approval and generation field`,
      );
    }
  } else {
    if (by === '-' || by === '' || !date.test(on) || !/^[0-9a-f]{16}$/.test(hash)) {
      problems.push(
        `${fileName}: ${status} needs "Approved by", an "Approved on" date and a "Plan hash"`,
      );
    }
    if (status === 'generated' && !date.test(generatedOn)) {
      problems.push(`${fileName}: generated needs a "Code generated on" date`);
    } else if (status === 'approved' && generatedOn !== '-') {
      problems.push(`${fileName}: an approved card has no generated code yet`);
    }
  }
  if (files && status === 'approved' && hash && hash !== planFingerprint(idFromName, files)) {
    problems.push(
      `${fileName}: test cases changed after approval. Run: npm run card -- ${idFromName} revoke`,
    );
  }
  return problems;
}

function main() {
  const dir = new URL('../test-cases/', import.meta.url).pathname;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md');
  const contents = Object.fromEntries(files.map((f) => [f, readFileSync(join(dir, f), 'utf8')]));
  const cardDir = new URL('../jira-tasks/', import.meta.url).pathname;
  const cards = readdirSync(cardDir).filter((f) => /^JIRA-\d{3}-.*\.md$/.test(f));
  const problems = [
    ...Object.entries(contents).flatMap(([f, text]) => validateTestCases(text, f)),
    ...findCrossFileDuplicates(contents),
    ...cards.flatMap((f) => validateCardFile(readFileSync(join(cardDir, f), 'utf8'), f, contents)),
  ];
  if (problems.length > 0) {
    process.stderr.write(`${problems.join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write(
    `Validated ${String(files.length)} test-case file(s) and ${String(cards.length)} card file(s).\n`,
  );
}

if (import.meta.url === new URL(process.argv[1] ?? '', 'file://').href) main();
