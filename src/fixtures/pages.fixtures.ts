import type { Fixtures, PlaywrightTestArgs, PlaywrightTestOptions } from '@playwright/test';

import { ExamplePage } from '@pages/example/example.page';

/** Add one entry per page object. Keys become fixture names in tests. */
export interface PageFixtures {
  examplePage: ExamplePage;
}

export const pageFixtures: Fixtures<
  PageFixtures,
  object,
  PlaywrightTestArgs & PlaywrightTestOptions
> = {
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },
};
