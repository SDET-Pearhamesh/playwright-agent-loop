import { test as base } from '@playwright/test';

import { pageFixtures } from './pages.fixtures';
import type { PageFixtures } from './pages.fixtures';

export { expect } from '@playwright/test';

export const test = base.extend<PageFixtures>(pageFixtures);
