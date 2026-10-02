import { containsNode, isExpectCall } from './helpers.mjs';

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noExpect: 'Assertion method `{{name}}` must contain at least one `expect()` call.',
    },
  },
  create(context) {
    return {
      MethodDefinition(node) {
        if (node.kind !== 'method' || node.key.type !== 'Identifier') return;
        if (node.accessibility === 'private' || node.accessibility === 'protected') return;
        if (!containsNode(node.value.body, isExpectCall)) {
          context.report({ node, messageId: 'noExpect', data: { name: node.key.name } });
        }
      },
    };
  },
};
