import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/login.page';

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('', '');
  
  await page.getByTestId('account-nav').getByTestId('profile-link').waitFor({ state: 'visible'});
  
  await page.context().storageState({ path: 'tests/auth/admin.json' });
});