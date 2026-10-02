import type { Fixtures, PlaywrightTestArgs, PlaywrightTestOptions } from '@playwright/test';

import type { PlaygroundPageName } from '@config/playground-pages.constant';
import { PlaygroundPage } from '@pages/playground/playground.page';

export interface SetupFixtures {
  /** Opens the landing page, checks it, goes to `pageName` and checks that page. */
  setup: (pageName: PlaygroundPageName) => Promise<void>;
  playgroundPage: PlaygroundPage;
}

export const setupFixtures: Fixtures<
  SetupFixtures,
  object,
  PlaywrightTestArgs & PlaywrightTestOptions
> = {
  playgroundPage: async ({ page }, use) => {
    await use(new PlaygroundPage(page));
  },

  setup: async ({ playgroundPage }, use) => {
    // The browser, context and page belong to Playwright's built-in fixtures, which are closed after
    // every test whether it passed or failed, so nothing is left running.
    await use(async (pageName) => {
      await playgroundPage.open();
      await playgroundPage.assert.isLandingPage();
      await playgroundPage.openPageByName(pageName);
      await playgroundPage.assert.isOnPage(pageName);
    });
  },
};
