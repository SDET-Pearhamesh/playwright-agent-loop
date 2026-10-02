import { test as base } from '@playwright/test';

import { pageFixtures } from './pages.fixtures';
import type { PageFixtures } from './pages.fixtures';
import { setupFixtures } from './setup.fixtures';
import type { SetupFixtures } from './setup.fixtures';

export { expect } from '@playwright/test';

export const test = base.extend<PageFixtures & SetupFixtures>({
  ...pageFixtures,
  ...setupFixtures,
});
