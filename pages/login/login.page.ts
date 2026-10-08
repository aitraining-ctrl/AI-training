import { Page, Locator } from '@playwright/test';
import { AccountOverviewPage } from '../account/overview.page';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('sign-in-button');
    this.errorMessage = page.getByTestId('login-error-message');
  }

  async goto() {
    await this.page.goto('/dk/account');
  }

  async login(email: string, password: string): Promise<AccountOverviewPage> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();

    return new AccountOverviewPage(this.page);
  }
}
