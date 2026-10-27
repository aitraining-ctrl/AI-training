import { test as base, expect } from '@playwright/test';
import { Customer } from '../data/customer';
import { AuthHelper } from '../helpers/auth.helper';
import { loadCustomer } from '../helpers/customer.helper';
import { LoginPage } from '../pages/login/login.page';
import { AccountOverviewPage } from '../pages/account/overview.page';
import { AdminLoginPage } from '../pages/admin/admin-login.page';
import { AdminOrdersPage } from '../pages/admin/admin-orders.page';
import { StorePage } from '../pages/store/store.page';
import { PromoPage } from '../pages/home/promo.page';

type AuthFixtures = {
  authHelper: AuthHelper;
  loginPage: LoginPage;
  accountPage: AccountOverviewPage;
  adminLoginPage: AdminLoginPage;
  adminOrdersPage: AdminOrdersPage;
  /** Customer registered by the setup project on your stand. */
  customer: Customer;
  storePage: StorePage;
  promoPage: PromoPage;
};

export const test = base.extend<AuthFixtures>({
  authHelper: async ({ page }, use) => {
    await use(new AuthHelper(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountOverviewPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  adminOrdersPage: async ({ page }, use) => {
    await use(new AdminOrdersPage(page));
  },
  // eslint-disable-next-line no-empty-pattern
  customer: async ({}, use) => {
    await use(loadCustomer());
  },
  storePage: async ({ page }, use) => {
    await use(new StorePage(page));
  },
  promoPage: async ({ page }, use) => {
    await use(new PromoPage(page));
  },
});

export { expect };