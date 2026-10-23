import { Page, Locator } from '@playwright/test';

/** Sidebar shared by all Medusa Admin (/app/*) pages. The admin UI has no data-testid: use roles. */
export class AdminSidebar {
  readonly root: Locator;
  readonly ordersLink: Locator;
  readonly productsLink: Locator;
  readonly customersLink: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('complementary');
    this.ordersLink = this.root.getByRole('link', { name: 'Orders' });
    this.productsLink = this.root.getByRole('link', { name: 'Products' });
    this.customersLink = this.root.getByRole('link', { name: 'Customers' });
    this.userMenu = this.root.getByRole('button', { name: /@/ });
  }
}
