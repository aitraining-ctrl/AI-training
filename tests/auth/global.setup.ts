import { test as setup } from '@playwright/test';
import { ADMIN_STORAGE_STATE } from '../../config/env';
import { AuthHelper } from '../../helpers/auth.helper';

setup('authenticate as admin', async ({ page }) => {
  const accountPage = await new AuthHelper(page).loginAsAdmin();
  await accountPage.waitForLoaded();

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
