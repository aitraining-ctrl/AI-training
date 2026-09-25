import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';

export class AuthHelper {
  constructor(private page: Page) {}

  async loginAs(role: 'admin' | 'user') {
    const credentials = role === 'admin' 
      ? { email: 'admin@sandbox.local', password: 'supersecret' }
      : { email: 'user@sandbox.local', password: 'supersecret' };

    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    return await loginPage.login(credentials.email, credentials.password);
  }
}