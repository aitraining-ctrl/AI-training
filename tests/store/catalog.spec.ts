import { test, expect } from '../../fixtures';
import { SESSION_STORAGE_STATE } from '../../config/env';

test.describe('Catalog', () => {
  // The storefront is browsed by a guest: keep the stand cookie, drop the logged-in customer.
  test.use({ storageState: SESSION_STORAGE_STATE });

  test('STORE-01: catalog lists every published product', async ({ storePage, adminApi }) => {
    // API: the expected list comes from the stand itself, not from a hardcoded count.
    const published = await adminApi.getPublishedProducts();
    const expectedTitles = published.map((product) => product.title).sort();

    await storePage.goto();

    await expect(storePage.title).toHaveText('All products');
    await expect(storePage.productTitles).toHaveCount(expectedTitles.length);
    expect((await storePage.productTitles.allInnerTexts()).sort()).toEqual(expectedTitles);
  });

  test('STORE-02: product page opens from the catalog card', async ({ page, storePage }) => {
    await storePage.goto();
    const productPage = await storePage.openProduct('Medusa T-Shirt');

    await expect(page).toHaveURL(/\/dk\/products\/t-shirt$/);
    await expect(productPage.title).toHaveText('Medusa T-Shirt');
    await expect(productPage.price).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });
});
