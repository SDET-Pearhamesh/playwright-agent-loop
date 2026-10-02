import { getTestBody, isTestCall, loadTagGroups } from './helpers.mjs';

const GROUPS = [
  ['SEVERITY_TAGS', 'severity'],
  ['DURATION_TAGS', 'duration'],
  ['INTERFACE_TAGS', 'interface'],
  ['DOMAIN_TAGS', 'domain'],
];

export default {
  meta: {
    type: 'problem',
    schema: [{ type: 'object', properties: { tagsFile: { type: 'string' } } }],
    messages: {
      missingTags:
        'test() needs `{ tag: [...] }` with a severity, duration, interface and domain tag.',
      missingGroup: 'test() is missing a {{group}} tag. Allowed: {{allowed}}.',
      unknownTag: 'Tag {{tag}} is not defined in config/tags.constant.ts.',
      nonLiteral: 'Tags must be string literals so they can be checked.',
    },
  },
  create(context) {
    const groups = loadTagGroups(context.options[0]?.tagsFile ?? undefined);
    const known = new Set(Object.values(groups).flat());

    return {
      CallExpression(node) {
        if (!isTestCall(node) || !getTestBody(node)) return;
        const details = node.arguments.find((arg) => arg.type === 'ObjectExpression');
        const tagProp = details?.properties.find(
          (prop) => prop.type === 'Property' && prop.key.name === 'tag',
        );
        if (!tagProp) {
          context.report({ node, messageId: 'missingTags' });
          return;
        }
        const value = tagProp.value;
        const elements = value.type === 'ArrayExpression' ? value.elements : [value];
        const tags = [];
        for (const element of elements) {
          if (element?.type === 'Literal' && typeof element.value === 'string') {
            tags.push(element.value);
          } else {
            context.report({ node: element ?? tagProp, messageId: 'nonLiteral' });
            return;
          }
        }
        for (const tag of tags) {
          if (!known.has(tag))
            context.report({ node: tagProp, messageId: 'unknownTag', data: { tag } });
        }
        for (const [key, label] of GROUPS) {
          const allowed = groups[key] ?? [];
          if (!tags.some((tag) => allowed.includes(tag))) {
            context.report({
              node: tagProp,
              messageId: 'missingGroup',
              data: { group: label, allowed: allowed.join(', ') },
            });
          }
        }
      },
    };
  },
};
