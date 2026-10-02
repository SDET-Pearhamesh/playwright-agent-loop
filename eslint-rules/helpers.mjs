import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

const TAGS_FILE = new URL('../config/tags.constant.ts', import.meta.url);

/** Reads tag groups from config/tags.constant.ts so the tag list has one source of truth. */
export function loadTagGroups(file = TAGS_FILE) {
  const source = readFileSync(file, 'utf8');
  const groups = {};
  for (const match of source.matchAll(/export const (\w+_TAGS) = \[([\s\S]*?)\] as const;/g)) {
    groups[match[1]] = [...match[2].matchAll(/'(@[^']+)'/g)].map((tag) => tag[1]);
  }
  return groups;
}

export function isTestCall(node) {
  const { callee } = node;
  if (callee.type === 'Identifier') return callee.name === 'test';
  return (
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'test' &&
    callee.property.type === 'Identifier' &&
    ['only', 'fixme', 'skip'].includes(callee.property.name)
  );
}

export function getTestBody(node) {
  return node.arguments.find(
    (arg) => arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression',
  );
}

/** Walks a subtree and reports whether any node satisfies the predicate. */
export function containsNode(root, predicate) {
  const seen = new Set();
  const visit = (node) => {
    if (!node || typeof node.type !== 'string' || seen.has(node)) return false;
    seen.add(node);
    if (predicate(node)) return true;
    return Object.entries(node).some(([key, value]) => {
      if (key === 'parent') return false;
      return Array.isArray(value) ? value.some(visit) : visit(value);
    });
  };
  return visit(root);
}

export function isExpectCall(node) {
  if (node.type !== 'CallExpression') return false;
  let callee = node.callee;
  while (callee.type === 'MemberExpression') callee = callee.object;
  return callee.type === 'Identifier' && callee.name === 'expect';
}
