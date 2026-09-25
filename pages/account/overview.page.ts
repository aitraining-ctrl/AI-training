import { Page, Locator } from '@playwright/test';

export class AccountOverviewPage {
  readonly page: Page;
 
  constructor(page: Page) {
    this.page = page;
  }

  async isLoaded() {
    await this.page.waitForURL(/\/dk\/account/);
  }
}
