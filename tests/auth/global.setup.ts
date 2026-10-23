import { test as setup } from '@playwright/test';
import { CUSTOMER_STORAGE_STATE, SESSION_STORAGE_STATE } from '../../config/env';
import { createCustomer } from '../../data/customer';
import { AuthHelper } from '../../helpers/auth.helper';
import { saveCustomer } from '../../helpers/customer.helper';

setup('open stand session and register customer', async ({ page }) => {
  const auth = new AuthHelper(page);

  await auth.openSession();
  await page.context().storageState({ path: SESSION_STORAGE_STATE });

  const customer = createCustomer();
  const accountPage = await auth.registerCustomer(customer);
  await accountPage.waitForLoaded();

  saveCustomer(customer);
  await page.context().storageState({ path: CUSTOMER_STORAGE_STATE });
});
