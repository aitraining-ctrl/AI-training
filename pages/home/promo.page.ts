import { Page } from '@playwright/test';
import { resolveLocator, type LocatorStrategy, type ResolvedLocator } from '../../helpers/locator-healing';

/**
 * The homepage promo slot — the one element in this exercise that genuinely
 * moves between releases, and therefore the only candidate for self-healing.
 *
 * Candidates are ordered by preference and each is a DIFFERENT strategy. Three
 * variations of one selector would all die together, which is worse than having
 * one: it looks like coverage.
 *
 * Add a candidate only when a real release has broken the previous first one,
 * and delete the ones that stop earning their place. A chain nobody prunes is
 * how a suite ends up passing against the wrong element.
 */
export class PromoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoFile(fileUrl: string) {
    await this.page.goto(fileUrl);
  }

  /** Strategies in priority order. Index 0 is the one you want to keep working. */
  bannerCandidates(): LocatorStrategy[] {
    return [
      {
        name: 'primary testid',
        selector: "getByTestId('promo-banner')",
        build: (p) => p.getByTestId('promo-banner'),
      },
      {
        name: 'role + accessible name',
        selector: "getByRole('link', { name: 'Summer sale' })",
        build: (p) => p.getByRole('link', { name: 'Summer sale' }),
      },
      {
        name: 'href attribute',
        selector: 'a[href*="/dk/promo"]',
        build: (p) => p.locator('a[href*="/dk/promo"]'),
      },
      {
        name: 'image src attribute',
        selector: 'img[src*="promo-summer"]',
        build: (p) => p.locator('img[src*="promo-summer"]'),
      },
    ];
  }

  /** Resolves the banner through the chain. Keeps selector calls out of the spec. */
  async resolveBanner(): Promise<ResolvedLocator> {
    return resolveLocator(this.page, this.bannerCandidates());
  }

  /** The URL the banner points at, whichever strategy found it. */
  async bannerHref(): Promise<string> {
    const { locator } = await this.resolveBanner();
    return (await locator.getAttribute('href')) ?? '';
  }
}
