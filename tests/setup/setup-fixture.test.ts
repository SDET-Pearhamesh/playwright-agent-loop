import { expect, test } from '@fixtures/test';

test.describe('setup fixture', () => {
  test(
    'opens the requested page',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    async ({ setup, playgroundPage }) => {
      await setup('Table Data Download');

      await playgroundPage.assert.isOnPage('Table Data Download');
    },
  );

  test(
    'handles a page whose heading differs from its link name',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    async ({ setup, playgroundPage }) => {
      await setup('Select Dropdown List');

      await playgroundPage.assert.isOnPage('Select Dropdown List');
    },
  );

  test(
    'handles a page without an H1',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    async ({ setup, playgroundPage }) => {
      await setup('Nested Frames');

      await playgroundPage.assert.isOnPage('Nested Frames');
    },
  );
});

test.describe('setup fixture cleanup', () => {
  test.describe.configure({ mode: 'serial' });

  test.fail(
    'a failing test body',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    async ({ setup, playgroundPage }) => {
      await setup('Table Data Download');

      await playgroundPage.assert.isOnPage('Table Pagination');
    },
  );

  test(
    'leaves no browser context open after a failure',
    { tag: ['@normal', '@fast', '@ui', '@framework'] },
    ({ browser }) => {
      expect(browser.contexts()).toHaveLength(0);
    },
  );
});
