import { Page, Locator } from '@playwright/test';

/**
 * Catalog with all products: /dk/store.
 *
 * DELIBERATELY BRITTLE LOCATORS — training fixture for topic 9 (locator
 * maintenance and self-healing). See `LOCATOR-EXERCISE.md`.
 *
 * Every element below has a `data-testid` in the sandbox markup, so none of
 * these locators needed a class chain, a generated id or a visible label. That
 * is the point: each is broken on purpose, and its comment says why.
 *
 * These members are not dead code. LOC-01 asserts against every one of them on
 * two snapshots — the page as captured and the page after a routine release.
 */
export class StorePage {
  readonly page: Page;

  // BRITTLE: a Tailwind class chain. The cards are
  // `<ul data-testid="products-list"> <li> <a.group> <div data-testid="product-wrapper">`.
  // Renaming `.group` (or `.grid`) breaks it, and the selector then matches
  // the four anchors instead of the one list.
  // Replace with `page.getByTestId('products-list')`.
  readonly productsList: Locator;

  // BRITTLE: positional CSS over the card markup. `p.txt-medium` matches the
  // price paragraph as well as the title — eight elements for four cards — so a
  // strict-mode violation is one action away.
  // Replace with `page.getByTestId('products-list').getByTestId('product-title')`.
  readonly productTitles: Locator;

  // BRITTLE: a React-generated id, regenerated whenever the component tree or
  // the React version changes — no markup change needed to break it.
  // Replace with `page.getByTestId('nav-menu-button')`.
  readonly navMenuButton: Locator;

  // BRITTLE: the visible label. The storefront ships more than one locale, so a
  // translated string fails on any language it does not match.
  // Note: `getByRole('radio', { name: 'Price: Low -> High' })` is ALSO
  // locale-dependent here — the accessible name comes from the visible label.
  // Replace with the locale-independent `page.locator('label[for="price_asc"]')`.
  readonly priceLowToHigh: Locator;

  // BRITTLE: an nth-child over a list whose order the backend decides. When a
  // promo row is inserted it still matches exactly one element — the WRONG one,
  // which is the nastiest failure to diagnose.
  // Replace with `page.getByTestId('products-list').getByTestId('product-wrapper').first()`.
  readonly firstProductCard: Locator;

  // BRITTLE: derived from the overmatching `productTitles` above.
  // Replace with `page.getByTestId('products-list').getByTestId('price')`.
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsList = page.locator('ul.grid > li > a.group');
    this.productTitles = page.locator('ul.grid > li > a.group p.txt-medium');
    this.navMenuButton = page.locator('#headlessui-popover-button-_R_1mj9esnelb_');
    this.priceLowToHigh = page.getByText('Price: Low -> High');
    this.firstProductCard = page.locator('ul.grid > li:nth-child(1) > a');
    this.productPrices = this.productTitles.filter({ hasText: '€' });
  }

  async goto() {
    await this.page.goto('/dk/store');
  }

  /** Offline variant: opens a saved snapshot of the page, no stand needed. */
  async gotoFile(fileUrl: string) {
    await this.page.goto(fileUrl);
  }

  /**
   * The title of whatever element `firstProductCard` actually points at.
   *
   * This is what keeps the exercise honest: "found exactly one element" is not
   * the same as "found the right one". After the release the brittle nth-child
   * still matches one element — the promo row — which has no product title.
   */
  async firstCardTitle(): Promise<string> {
    const title = this.firstProductCard.getByTestId('product-title');
    return (await title.count()) === 1 ? ((await title.textContent()) ?? '') : '';
  }
}
