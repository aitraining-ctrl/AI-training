import { test as setup } from '@playwright/test';
import { ADMIN_STORAGE_STATE } from '../../config/env';
import { AuthHelper } from '../../helpers/auth.helper';

// The admin app of a cold stand can take a while to render its first page.
setup.setTimeout(90_000);

setup('open stand session and log in to admin', async ({ page }) => {
  const auth = new AuthHelper(page);

  await auth.openSession();
  const ordersPage = await auth.loginAsAdmin();
  await ordersPage.waitForLoaded();

  await page.context().storageState({ path: ADMIN_STORAGE_STATE });
});
