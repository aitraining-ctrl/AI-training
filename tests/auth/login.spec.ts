import { test, expect } from '../../fixtures';
import { SESSION_STORAGE_STATE } from '../../config/env';

test.describe('Login', () => {
  // These tests check the login itself: keep the stand cookie, drop the logged-in customer.
  test.use({ storageState: SESSION_STORAGE_STATE });

  test('AUTH-01: customer logs in with valid credentials', async ({ loginPage, customer }) => {
    await loginPage.goto();
    const accountPage = await loginPage.login(customer.email, customer.password);

    await expect(accountPage.wrapper).toBeVisible();
    await expect(accountPage.customerEmail).toContainText(customer.email);
  });

  test('AUTH-02: error is shown for a wrong password', async ({ loginPage, accountPage, customer }) => {
    await loginPage.goto();
    await loginPage.login(customer.email, 'wrong-password');

    await expect(loginPage.errorMessage).toHaveText('Error: Invalid email or password');
    await expect(accountPage.nav.root).toBeHidden();
  });
});
