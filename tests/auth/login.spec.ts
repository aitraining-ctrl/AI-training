import { test, expect } from '../../fixtures';
import { env } from '../../config/env';

test.describe('Login', () => {
  // These tests check the login itself, so they start without the saved admin session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('AUTH-01: admin logs in with valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    const accountPage = await loginPage.login(env.adminEmail, env.adminPassword);

    await expect(accountPage.wrapper).toBeVisible();
    await expect(accountPage.customerEmail).toContainText(env.adminEmail);
  });

  test('AUTH-02: error is shown for a wrong password', async ({ loginPage, accountPage }) => {
    await loginPage.goto();
    await loginPage.login(env.adminEmail, 'wrong-password');

    await expect(loginPage.errorMessage).toHaveText('Error: Invalid email or password');
    await expect(accountPage.nav.root).toBeHidden();
  });
});
