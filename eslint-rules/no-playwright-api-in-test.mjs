export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      noPageApi:
        'Do not call `page.{{name}}()` in a test. Use a page object method from src/pages instead.',
    },
  },
  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          callee.object.name === 'page' &&
          callee.property.type === 'Identifier'
        ) {
          context.report({
            node,
            messageId: 'noPageApi',
            data: { name: callee.property.name },
          });
        }
      },
    };
  },
};
