import { Page, Locator } from '@playwright/test';
import { AdminOrdersPage } from './admin-orders.page';

export class AdminLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Continue with Email' });
  }

  async goto() {
    await this.page.goto('/app/login');
  }

  async login(email: string, password: string): Promise<AdminOrdersPage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    return new AdminOrdersPage(this.page);
  }
}
