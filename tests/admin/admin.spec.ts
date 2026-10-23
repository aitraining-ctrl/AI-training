import { test, expect } from '../../fixtures';
import { env, SESSION_STORAGE_STATE } from '../../config/env';

test.describe('Admin', () => {
  test.describe('Login', () => {
    // This test checks the admin login itself: keep the stand cookie, drop the admin session.
    test.use({ storageState: SESSION_STORAGE_STATE });

    test('ADM-01: admin logs in with valid credentials', async ({ adminLoginPage }) => {
      await adminLoginPage.goto();
      const ordersPage = await adminLoginPage.login(env.adminEmail, env.adminPassword);

      await expect(ordersPage.heading).toBeVisible();
      await expect(ordersPage.sidebar.userMenu).toContainText(env.adminEmail);
    });
  });

  test('ADM-02: customer registered on the storefront is listed in admin', async ({
    adminOrdersPage,
    customer,
  }) => {
    await adminOrdersPage.goto();
    const customersPage = await adminOrdersPage.openCustomers();
    await customersPage.search(customer.email);

    await expect(customersPage.rowByEmail(customer.email)).toBeVisible();
  });
});
