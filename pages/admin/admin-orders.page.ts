import { Page, Locator } from '@playwright/test';
import { AdminSidebar } from './admin-sidebar.component';
import { AdminCustomersPage } from './admin-customers.page';

export class AdminOrdersPage {
  readonly page: Page;
  readonly sidebar: AdminSidebar;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new AdminSidebar(page);
    this.heading = page.getByRole('heading', { name: 'Orders', level: 1 });
  }

  async goto() {
    await this.page.goto('/app/orders');
  }

  async waitForLoaded() {
    await this.heading.waitFor();
  }

  async openCustomers(): Promise<AdminCustomersPage> {
    await this.sidebar.customersLink.click();
    return new AdminCustomersPage(this.page);
  }
}
