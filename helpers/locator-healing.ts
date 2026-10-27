import { Page, Locator } from '@playwright/test';

/**
 * A locator that tries several strategies, in priority order, and returns the
 * first one that matches exactly one element.
 *
 * Self-healing is for an element whose markup genuinely moves, where no single
 * strategy survives a release. It is NOT a substitute for a good locator: if a
 * `data-testid` exists and is stable, one locator is enough and a chain just
 * hides the day that testid gets renamed.
 *
 * Rules this helper enforces, because a self-healing mechanism without them
 * silently becomes a source of false positives:
 *
 *  - candidates are independent strategies (testid, role, attribute, relative
 *    position), not variants of one selector;
 *  - a fallback that fires is logged and marked degraded — if the first
 *    strategy never matches, the page has probably changed underneath the test;
 *  - if nothing matches, the error lists every strategy AND the selector it
 *    tried, so the failure says what was attempted and not just "not found".
 */
export type LocatorStrategy = {
  name: string;
  /** The selector this strategy builds, for logs and failure messages. */
  selector: string;
  build: (page: Page) => Locator;
};

export type ResolvedLocator = {
  locator: Locator;
  /** Strategy that matched. Equal to `strategies[0].name` when healthy. */
  matched: string;
  /** True when anything other than the first strategy matched. */
  degraded: boolean;
  /** Every strategy that matched zero or several elements, with the count. */
  rejected: { name: string; selector: string; matches: number }[];
};

export async function resolveLocator(page: Page, strategies: LocatorStrategy[]): Promise<ResolvedLocator> {
  const rejected: ResolvedLocator['rejected'] = [];

  for (const strategy of strategies) {
    const locator = strategy.build(page);
    const matches = await locator.count();
    if (matches === 1) {
      const degraded = strategy !== strategies[0];
      if (degraded) {
        console.warn(
          `[self-healing] "${strategy.name}" ${strategy.selector} matched instead of ` +
            `"${strategies[0].name}" ${strategies[0].selector}. The primary locator no longer finds ` +
            `the element — this is debt, not a fix. Tried before it: ${describe(rejected)}`,
        );
      }
      return { locator, matched: strategy.name, degraded, rejected };
    }
    rejected.push({ name: strategy.name, selector: strategy.selector, matches });
  }

  throw new Error(
    `No locator strategy matched exactly one element for this target. Tried, in order: ${describe(rejected)}`,
  );
}

// Only strategies that did not match exactly once get here, so the count is 0 or 2+.
function describe(rejected: ResolvedLocator['rejected']): string {
  return rejected.map(({ name, selector, matches }) => `${name} ${selector} (${matches} matches)`).join(', ');
}
