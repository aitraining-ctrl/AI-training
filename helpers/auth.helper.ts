import { Page } from '@playwright/test';
import { env } from '../config/env';
import { LoginPage } from '../pages/login/login.page';

export class AuthHelper {
  constructor(private page: Page) {}

  async loginAsAdmin() {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    return await loginPage.login(env.adminEmail, env.adminPassword);
  }
}
