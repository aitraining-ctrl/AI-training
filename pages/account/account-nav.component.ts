import { Page, Locator } from '@playwright/test';

/** Side navigation shared by all /dk/account/* pages. */
export class AccountNav {
  readonly root: Locator;
  readonly overviewLink: Locator;
  readonly profileLink: Locator;
  readonly addressesLink: Locator;
  readonly ordersLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('account-nav');
    this.overviewLink = this.root.getByTestId('overview-link');
    this.profileLink = this.root.getByTestId('profile-link');
    this.addressesLink = this.root.getByTestId('addresses-link');
    this.ordersLink = this.root.getByTestId('orders-link');
    this.logoutButton = this.root.getByTestId('logout-button');
  }
}
