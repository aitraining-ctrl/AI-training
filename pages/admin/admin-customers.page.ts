import { Page, Locator } from '@playwright/test';
import { AdminSidebar } from './admin-sidebar.component';

export class AdminCustomersPage {
  readonly page: Page;
  readonly sidebar: AdminSidebar;
  readonly heading: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new AdminSidebar(page);
    this.heading = page.getByRole('heading', { name: 'Customers', level: 1 });
    this.searchInput = page.getByRole('searchbox', { name: 'Search' });
  }

  async goto() {
    await this.page.goto('/app/customers');
  }

  async waitForLoaded() {
    await this.heading.waitFor();
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  rowByEmail(email: string): Locator {
    return this.page.getByRole('row').filter({ hasText: email });
  }
}
