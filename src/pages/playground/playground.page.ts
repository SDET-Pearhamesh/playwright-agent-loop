import type { Locator, Page } from '@playwright/test';

import { BasePage } from '@base/base.page';
import { getPlaygroundPage } from '@config/playground-pages.constant';
import type { PlaygroundPageName } from '@config/playground-pages.constant';

import { PlaygroundAssertions } from './playground.assertions';

/** Landing page of the Selenium Playground and the way to reach any of its pages by name. */
export class PlaygroundPage extends BasePage {
  protected readonly path = '';

  public readonly assert: PlaygroundAssertions;

  public constructor(page: Page) {
    super(page);
    this.assert = new PlaygroundAssertions(this, page);
  }

  public pageHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  public async openPageByName(name: PlaygroundPageName): Promise<void> {
    await this.page
      .getByRole('link', { name: getPlaygroundPage(name).name, exact: true })
      .first()
      .click();
  }
}
