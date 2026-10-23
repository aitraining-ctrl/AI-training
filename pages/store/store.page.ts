import { Page, Locator } from '@playwright/test';
import { ProductPage } from './product.page';

export type SortOption = 'Latest Arrivals' | 'Price: Low -> High' | 'Price: High -> Low';

/** Catalog with all products: /dk/store. */
export class StorePage {
  readonly page: Page;
  readonly title: Locator;
  readonly productsList: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('store-page-title');
    this.productsList = page.getByTestId('products-list');
    this.productCards = this.productsList.getByTestId('product-wrapper');
    this.productTitles = this.productCards.getByTestId('product-title');
  }

  async goto() {
    await this.page.goto('/dk/store');
  }

  async waitForLoaded() {
    await this.productsList.waitFor();
  }

  productCard(title: string): Locator {
    return this.productCards.filter({ has: this.page.getByTestId('product-title').getByText(title, { exact: true }) });
  }

  async sortBy(option: SortOption) {
    await this.page.getByTestId('radio-label').getByText(option, { exact: true }).click();
  }

  async openProduct(title: string): Promise<ProductPage> {
    await this.productCard(title).click();
    return new ProductPage(this.page);
  }
}
