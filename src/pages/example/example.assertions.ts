import { expect } from '@playwright/test';

import { BaseAssertions } from '@base/base.assertions';

import type { ExamplePage } from './example.page';

export class ExampleAssertions extends BaseAssertions<ExamplePage> {
  public async greetingIsHidden(): Promise<void> {
    await expect(this.parent.greeting).toBeHidden();
  }

  public async greetingHasText(text: string): Promise<void> {
    await expect(this.parent.greeting).toHaveText(text);
  }
}
