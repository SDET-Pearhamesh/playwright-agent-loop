import { expect, test } from '@fixtures/test';

// Starting point for the planner, generator and healer agents. Keep it independent of the site.
test('seed', { tag: ['@normal', '@fast', '@ui', '@framework'] }, async ({ page }) => {
  await page.goto('about:blank');

  await expect(page).toHaveURL('about:blank');
});
