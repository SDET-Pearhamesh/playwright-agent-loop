import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

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

function main() {
  const dir = new URL('../test-cases/', import.meta.url).pathname;
  const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md');
  const problems = files.flatMap((f) => validateTestCases(readFileSync(join(dir, f), 'utf8'), f));
  if (problems.length > 0) {
    process.stderr.write(`${problems.join('\n')}\n`);
    process.exit(1);
  }
  process.stdout.write(`Validated ${String(files.length)} test-case file(s).\n`);
}

if (import.meta.url === new URL(process.argv[1] ?? '', 'file://').href) main();
