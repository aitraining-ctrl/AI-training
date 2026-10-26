import { test as base, expect } from '@playwright/test';
import { AuthHelper } from '../helpers/auth.helper';
import { LoginPage } from '../pages/login/login.page';
import { AccountOverviewPage } from '../pages/account/overview.page';
import { StorePage } from '../pages/store/store.page';

type AuthFixtures = {
  authHelper: AuthHelper;
  loginPage: LoginPage;
  accountPage: AccountOverviewPage;
  storePage: StorePage;
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
  storePage: async ({ page }, use) => {
    await use(new StorePage(page));
  },
});

export { expect };
