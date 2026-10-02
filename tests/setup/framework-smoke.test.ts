import { expect, test } from '@fixtures/test';

test(
  'opens a browser page and evaluates a web-first assertion',
  { tag: ['@normal', '@fast', '@ui', '@framework'] },
  async ({ page }) => {
    await page.goto('about:blank');

    await expect(page).toHaveURL('about:blank');
  },
);
