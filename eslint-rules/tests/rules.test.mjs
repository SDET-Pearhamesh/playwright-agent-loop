import { RuleTester } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, it } from 'node:test';

import assertMethodMustExpect from '../assert-method-must-expect.mjs';
import noPlaywrightApiInTest from '../no-playwright-api-in-test.mjs';
import testMustCallAssert from '../test-must-call-assert.mjs';
import testTagsRequired from '../test-tags-required.mjs';

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parser: tseslint.parser } });
const tags = "{ tag: ['@normal', '@fast', '@ui', '@table'] }";

tester.run('test-tags-required', testTagsRequired, {
  valid: [`test('x', ${tags}, async () => {});`, `test.skip('x', ${tags}, async () => {});`],
  invalid: [
    { code: "test('x', async () => {});", errors: [{ messageId: 'missingTags' }] },
    {
      code: "test('x', { tag: ['@normal', '@fast', '@ui'] }, async () => {});",
      errors: [{ messageId: 'missingGroup' }],
    },
    {
      code: "test('x', { tag: ['@normal', '@fast', '@ui', '@table', '@bogus'] }, async () => {});",
      errors: [{ messageId: 'unknownTag' }],
    },
    {
      code: "test('x', { tag: [...t] }, async () => {});",
      errors: [{ messageId: 'nonLiteral' }],
    },
  ],
});

tester.run('no-playwright-api-in-test', noPlaywrightApiInTest, {
  valid: ["test('x', async ({ tablePage }) => { await tablePage.search('a'); });"],
  invalid: [
    {
      code: "test('x', async ({ page }) => { await page.locator('a').click(); });",
      errors: [{ messageId: 'noPageApi' }],
    },
    {
      code: "test('x', async ({ page }) => { await page.goto('/'); });",
      errors: [{ messageId: 'noPageApi' }],
    },
  ],
});

tester.run('test-must-call-assert', testMustCallAssert, {
  valid: [
    "test('x', async ({ tablePage }) => { await tablePage.assert.hasRows(); });",
    "test('x', async ({ page }) => { await expect(page).toHaveURL('/'); });",
  ],
  invalid: [
    {
      code: "test('x', async ({ tablePage }) => { await tablePage.search('a'); });",
      errors: [{ messageId: 'noAssert' }],
    },
  ],
});

tester.run('assert-method-must-expect', assertMethodMustExpect, {
  valid: [
    'class A { public async hasRows(): Promise<void> { await expect(this.l).toHaveCount(1); } }',
    'class A { private helper(): void {} }',
    'class A { public constructor(p: string) {} }',
  ],
  invalid: [
    {
      code: 'class A { public async hasRows(): Promise<void> { await this.l.count(); } }',
      errors: [{ messageId: 'noExpect' }],
    },
  ],
});
