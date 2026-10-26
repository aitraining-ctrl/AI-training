import { Page, Locator } from '@playwright/test';

/**
 * All-products listing at /dk/store.
 *
 * Every product in the sandbox costs the same (€10.00), so the price sort has
 * no tiebreaker — see the sort specs.
 */
export class StorePage {
  readonly page: Page;
  readonly title: Locator;
  readonly productList: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly sortOptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('store-page-title');
    this.productList = page.getByTestId('products-list');
    this.productCards = page.getByTestId('product-wrapper');
    this.productTitles = page.getByTestId('product-title');
    this.productPrices = page.getByTestId('price');
    this.sortOptions = page.getByTestId('radio-label');
  }

  async goto() {
    await this.page.goto('/dk/store');
  }

  /** Waits until the client-rendered list has painted at least one card. */
  async waitForLoaded() {
    await this.productCards.first().waitFor({ state: 'visible' });
  }

  /** Product names in the order they are currently rendered. */
  async productNames(): Promise<string[]> {
    return this.productTitles.allTextContents();
  }

  /** Clicks a sort option by its visible label. */
  async sortBy(label: string) {
    await this.sortOptions.filter({ hasText: label }).first().click();
  }
}
