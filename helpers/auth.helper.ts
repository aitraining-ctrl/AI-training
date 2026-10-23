import { Page } from '@playwright/test';
import { env } from '../config/env';
import { Customer } from '../data/customer';
import { LoginPage } from '../pages/login/login.page';
import { AdminLoginPage } from '../pages/admin/admin-login.page';

export class AuthHelper {
  constructor(private page: Page) {}

  /** Opens the session link: the stand cookie is set and the browser lands on the storefront. */
  async openSession() {
    const response = await this.page.goto(env.sessionUrl);
    if (response?.status() === 403) {
      throw new Error(
        'The stand rejected SESSION_URL (403). The link may be revoked or the stand handed over: take a fresh link from your task.',
      );
    }
    if (response && response.status() >= 500) {
      throw new Error(
        `The stand does not respond (HTTP ${response.status()}). It may be starting or stopped: wait a minute and rerun, then contact the support of your task.`,
      );
    }
    await this.page.waitForURL(/\/dk(\/|$)/);
  }

  async loginAsAdmin() {
    const adminLoginPage = new AdminLoginPage(this.page);
    if (env.adminUrl) {
      await this.page.goto(env.adminUrl);
    } else {
      await adminLoginPage.goto();
    }
    return await adminLoginPage.login(env.adminEmail, env.adminPassword);
  }

  async registerCustomer(customer: Customer) {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    const registerPage = await loginPage.openRegister();
    return await registerPage.register(customer);
  }
}
