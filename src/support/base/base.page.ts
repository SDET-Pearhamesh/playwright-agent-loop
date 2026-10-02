import type { Page } from '@playwright/test';

export abstract class BasePage {
  protected abstract readonly path: string;

  public constructor(protected readonly page: Page) {}

  public async open(): Promise<void> {
    await this.page.goto(this.path);
  }
}
