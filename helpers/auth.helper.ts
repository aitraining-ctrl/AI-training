import { Page } from '@playwright/test';
import { env } from '../config/env';
import { LoginPage } from '../pages/login/login.page';

export class AuthHelper {
  constructor(private page: Page) {}

  /**
   * Clears the host's access gate. The sandbox answers 403 to every request
   * until the session link has been visited, so this must run before any
   * navigation. No-op when SESSION_LINK is unset.
   */
  async openSession() {
    if (!env.sessionLink) return;
    const base = env.baseUrl.replace(/\/+$/, '');
    const link = /^https?:\/\//i.test(env.sessionLink)
      ? env.sessionLink
      : `${base}/${env.sessionLink.replace(/^\/+/, '')}`;
    await this.page.goto(link, { waitUntil: 'domcontentloaded' });
  }

  async loginAsAdmin() {
    await this.openSession();
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    return await loginPage.login(env.adminEmail, env.adminPassword);
  }
}
