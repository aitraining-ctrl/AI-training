import { test, expect } from '../../fixtures/auth.fixtures';

test.describe('AUTH-01: Login success', () => {
  test.use({ storageState: 'tests/auth/admin.json' });

  test('Check that profile page is visible after login', async ({ page, accountPage }) => {
    await page.goto('/dk/account'); 
    await page.getByTestId('account-nav').getByTestId('profile-link').click();

    await accountPage.isLoaded();
    
    await expect(page).toHaveURL(/\/dk\/account\/profile/);
  });
});