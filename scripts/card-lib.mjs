import { createHash } from 'node:crypto';

export const STATUSES = ['planned', 'approved', 'generated'];
export const CARD_ID = /^JIRA-\d{3}$/;

/** Returns the `## JIRA-000 — ...` sections of every test-case file, in a stable order. */
export function planSections(cardId, filesByName) {
  const heading = new RegExp(`^## ${cardId} — `);
  return Object.keys(filesByName)
    .sort()
    .flatMap((file) => {
      const lines = filesByName[file].split('\n');
      const start = lines.findIndex((line) => heading.test(line));
      if (start === -1) return [];
      const end = lines.findIndex((line, i) => i > start && /^## /.test(line));
      const body = lines.slice(start, end === -1 ? undefined : end);
      return [
        {
          file,
          text: body
            .map((line) => line.trimEnd())
            .join('\n')
            .trim(),
        },
      ];
    });
}

/** Fingerprint of the plan, so an edit after approval can be detected. */
export function planFingerprint(cardId, filesByName) {
  const hash = createHash('sha256');
  for (const { file, text } of planSections(cardId, filesByName)) {
    hash.update(`${file}\n${text}\n`);
  }
  return hash.digest('hex').slice(0, 16);
}

export function countCases(cardId, filesByName) {
  const cases = new RegExp(`^### ${cardId}\\.\\d+ — `, 'gm');
  return planSections(cardId, filesByName).reduce(
    (total, { text }) => total + (text.match(cases)?.length ?? 0),
    0,
  );
}

export function readField(text, name) {
  return new RegExp(`^\\*\\*${name}:\\*\\* (.*)$`, 'm').exec(text)?.[1]?.trim();
}

/** Replaces existing `**Name:** value` lines. Every field must already exist in the card file. */
export function writeFields(text, updates) {
  return Object.entries(updates).reduce((current, [name, value]) => {
    const line = new RegExp(`^\\*\\*${name}:\\*\\* .*$`, 'm');
    if (!line.test(current)) throw new Error(`Card file has no "**${name}:**" line`);
    return current.replace(line, `**${name}:** ${value}`);
  }, text);
}

/**
 * Decides whether a card action is allowed. Returns a list of reasons it is not.
 * state: { cardId, action, cardText, mainCardText, branch, files }
 */
export function checkAction({ cardId, action, cardText, mainCardText, branch, files }) {
  const reasons = [];
  if (mainCardText && readField(mainCardText, 'Status') === 'generated') {
    reasons.push(
      `${cardId} is already generated and merged to main. Create ${cardId}-fix for changes.`,
    );
    return reasons;
  }
  if (branch !== cardId) {
    reasons.push(`You are on "${branch}". Switch to the branch named ${cardId} first.`);
  }
  const status = readField(cardText, 'Status');
  const cases = countCases(cardId, files);
  if (cases === 0) reasons.push(`${cardId} has no test cases in test-cases/.`);

  if (action === 'approve') {
    if (status !== 'planned') reasons.push(`Only a planned card can be approved (now: ${status}).`);
  } else if (action === 'generate') {
    if (status === 'generated') {
      reasons.push(`Code for ${cardId} is already generated. Review the open PR instead.`);
    } else if (status !== 'approved') {
      reasons.push(`${cardId} is "${status}". A human must approve it first.`);
    } else if (readField(cardText, 'Plan hash') !== planFingerprint(cardId, files)) {
      reasons.push('The test cases changed after approval. Review them and approve again.');
    }
  } else if (action === 'complete') {
    if (status !== 'approved')
      reasons.push(`Only an approved card can be completed (now: ${status}).`);
    else if (readField(cardText, 'Plan hash') !== planFingerprint(cardId, files)) {
      reasons.push('The test cases changed after approval. Review them and approve again.');
    }
  } else if (action === 'revoke') {
    if (status !== 'approved')
      reasons.push(`Only an approved card can be revoked (now: ${status}).`);
  }
  return reasons;
}

/** Extracts title from card file. */
export function readTitle(cardText) {
  return new RegExp(`^# (JIRA-\\d{3}: .*)$`, 'm').exec(cardText)?.[1] ?? 'Unknown';
}

/** Summarizes a card's state for the status board. */
export function cardSummary(cardId, cardText, caseCount) {
  const status = readField(cardText, 'Status');
  const title = readTitle(cardText);
  const desc =
    status === 'planned'
      ? 'plan pending approval'
      : status === 'approved'
        ? `approved by ${readField(cardText, 'Approved by')} on ${readField(cardText, 'Approved on')}`
        : `generated on ${readField(cardText, 'Code generated on')}`;
  return `${title} — ${caseCount} cases, ${desc}`;
}
