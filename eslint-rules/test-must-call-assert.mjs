import { containsNode, getTestBody, isExpectCall, isTestCall } from './helpers.mjs';

const isAssertCall = (node) =>
  node.type === 'CallExpression' &&
  node.callee.type === 'MemberExpression' &&
  containsNode(node.callee, (inner) => inner.type === 'Identifier' && inner.name === 'assert');

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noAssert: 'A test must verify something: call a page `.assert.*` method or `expect()`.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        if (!isTestCall(node)) return;
        const body = getTestBody(node);
        if (!body) return;
        if (!containsNode(body.body, (inner) => isAssertCall(inner) || isExpectCall(inner))) {
          context.report({ node, messageId: 'noAssert' });
        }
      },
    };
  },
};
