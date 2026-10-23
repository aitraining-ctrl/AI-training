import { Page, Locator } from '@playwright/test';
import { Customer } from '../../data/customer';
import { AccountOverviewPage } from '../account/overview.page';

export class RegisterPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('first-name-input');
    this.lastNameInput = page.getByTestId('last-name-input');
    this.emailInput = page.getByTestId('email-input');
    this.phoneInput = page.getByTestId('phone-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitButton = page.getByTestId('register-button');
  }

  async register(customer: Customer): Promise<AccountOverviewPage> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.emailInput.fill(customer.email);
    await this.passwordInput.fill(customer.password);
    await this.submitButton.click();

    return new AccountOverviewPage(this.page);
  }
}
