import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import { BaseAssertions } from '@base/base.assertions';
import { LANDING_PAGE_TITLE, getPlaygroundPage } from '@config/playground-pages.constant';
import type { PlaygroundPageName } from '@config/playground-pages.constant';

import type { PlaygroundPage } from './playground.page';

export class PlaygroundAssertions extends BaseAssertions<PlaygroundPage> {
  public constructor(
    parent: PlaygroundPage,
    private readonly page: Page,
  ) {
    super(parent);
  }

  public async isLandingPage(): Promise<void> {
    await expect(this.page).toHaveTitle(LANDING_PAGE_TITLE);
  }

  /** Checks the URL, and the H1 when the page has one, against the registry entry. */
  public async isOnPage(name: PlaygroundPageName): Promise<void> {
    const entry = getPlaygroundPage(name);
    await expect(this.page).toHaveURL(new RegExp(`/selenium-playground/${entry.path}$`));
    if (entry.heading !== null) {
      await expect(this.parent.pageHeading()).toHaveText(entry.heading);
    }
  }
}
