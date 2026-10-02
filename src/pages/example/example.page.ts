import type { Locator, Page } from '@playwright/test';

import { BasePage } from '@base/base.page';

import { ExampleAssertions } from './example.assertions';

/**
 * Reference page object. Copy this shape for every element page:
 * locators are public (the assertions class reads them), actions live here,
 * and all `expect()` calls live in the matching `*.assertions.ts`.
 */
export class ExamplePage extends BasePage {
  public static readonly route = '**/__framework-example__';

  protected readonly path = '__framework-example__';

  public readonly nameInput: Locator;
  public readonly greetButton: Locator;
  public readonly greeting: Locator;
  public readonly assert: ExampleAssertions;

  public constructor(page: Page) {
    super(page);
    this.nameInput = page.getByLabel('Name');
    this.greetButton = page.getByRole('button', { name: 'Greet' });
    this.greeting = page.getByTestId('greeting');
    this.assert = new ExampleAssertions(this);
  }

  public async greet(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.greetButton.click();
  }
}
