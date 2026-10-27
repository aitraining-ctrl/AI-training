import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect } from '../../fixtures';

/**
 * Locator maintenance exercise — topic 9.
 *
 * LOC-01 is broken on purpose. It asserts the SAME six locators against two
 * snapshots: the page as captured, and the same page after a routine release.
 * A locator that works on one and not the other is the whole lesson. It is
 * marked `test.fail(...)` so the suite stays green while the exercise is
 * unsolved — Playwright reports "passed but was expected to fail" once the
 * locators are fixed, which is the cue to remove the annotation.
 *
 * Offline by design — the tests load saved DOM snapshots, so they give the same
 * answer on every machine, in CI, and without a stand. Read `LOCATOR-EXERCISE.md`
 * before changing anything.
 */

const fixture = (name: string) => pathToFileURL(path.join(__dirname, 'fixtures', name)).href;

test.describe('Locator exercise', () => {
  test('LOC-01: the catalog locators survive a routine UI change', async ({ storePage }) => {
    // `test.fail` keeps CI green while the locators are unfixed. Fix them and
    // Playwright reports this test as "passed but was expected to fail".
    test.fail(true, 'StorePage locators are deliberately brittle — fix them, then remove this annotation');

    // First: the page as it is. Two of the six locators are already wrong here
    // (the class chain matches the four anchors instead of the one list, and
    // `productTitles` returns eight elements for four cards).
    await storePage.gotoFile(fixture('store-snapshot.html'));
    await expect(storePage.productsList).toHaveCount(1);
    await expect(storePage.productTitles).toHaveCount(4);
    await expect(storePage.productPrices).toHaveCount(4);
    await expect(storePage.navMenuButton).toBeVisible();
    await expect(storePage.priceLowToHigh).toHaveCount(1);
    expect(await storePage.firstCardTitle()).toBe('Medusa Sweatshirt');

    // Then the same page after a routine release: a class renamed, generated
    // ids regenerated, a label translated, a promo row inserted first. Every
    // assertion below is the same one the stable locators must also satisfy.
    await storePage.gotoFile(fixture('store-snapshot-after-ui-change.html'));
    await expect(storePage.productsList).toHaveCount(1);
    await expect(storePage.productTitles).toHaveCount(4);
    await expect(storePage.productPrices).toHaveCount(4);
    await expect(storePage.navMenuButton).toBeVisible();
    await expect(storePage.priceLowToHigh).toHaveCount(1);
    // Not just "found one": the first card must still be a PRODUCT CARD. The
    // brittle nth-child finds exactly one element here too — the promo row,
    // which contains no product title at all.
    expect(await storePage.firstCardTitle()).toBe('Medusa Sweatshirt');
  });

  test('LOC-02: before the redesign the primary strategy is enough', async ({ promoPage }) => {
    await promoPage.gotoFile(fixture('promo-before.html'));

    const resolved = await promoPage.resolveBanner();

    expect(resolved.degraded).toBe(false);
    expect(resolved.matched).toBe('primary testid');
    expect(resolved.rejected).toEqual([]);
    await expect(resolved.locator).toBeVisible();
  });

  test('LOC-03: after the redesign a fallback fires and the result is marked degraded', async ({ promoPage }) => {
    // Three of the four strategies died in the redesign. The campaign route is
    // the last one standing, so the chain falls back to it — and must say so.
    await promoPage.gotoFile(fixture('promo-after.html'));

    const resolved = await promoPage.resolveBanner();

    expect(resolved.degraded).toBe(true);
    expect(resolved.matched).not.toBe('primary testid');
    expect(resolved.rejected.map((r) => r.name)).toContain('primary testid');
    await expect(resolved.locator).toBeVisible();
  });

  test('LOC-04: an empty chain fails with every strategy it tried', async ({ promoPage }) => {
    // On a page with none of the targets, the error must name each strategy,
    // the selector it would have used, and its match count — otherwise the
    // failure reads "element not found" and the on-call engineer has to open
    // the helper to learn what it attempted.
    await promoPage.gotoFile(fixture('nothing-matches.html'));

    await expect(promoPage.resolveBanner()).rejects.toThrow(/Tried, in order:/);
    await expect(promoPage.resolveBanner()).rejects.toThrow(
      /primary testid getByTestId\('promo-banner'\) \(0 matches\)/,
    );
    await expect(promoPage.resolveBanner()).rejects.toThrow(/href attribute/);
  });
});
