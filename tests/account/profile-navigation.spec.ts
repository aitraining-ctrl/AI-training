import { test, expect } from '../../fixtures';

test.describe('Account navigation', () => {
  test('ACC-01: profile page opens from the account navigation', async ({ page, accountPage }) => {
    await accountPage.goto();
    const profilePage = await accountPage.openProfile();

    await expect(page).toHaveURL(/\/dk\/account\/profile$/);
    await expect(profilePage.wrapper).toBeVisible();
  });
});
