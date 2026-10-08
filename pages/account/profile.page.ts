import { Page, Locator } from '@playwright/test';
import { AccountNav } from './account-nav.component';

export class ProfilePage {
  readonly page: Page;
  readonly nav: AccountNav;
  readonly wrapper: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = new AccountNav(page);
    this.wrapper = page.getByTestId('profile-page-wrapper');
  }

  async goto() {
    await this.page.goto('/dk/account/profile');
  }

  async waitForLoaded() {
    await this.wrapper.waitFor();
  }
}
