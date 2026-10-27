# Locator exercise — topic 9

Deliberately brittle locators for practice with locator maintenance and
self-healing. **They are not a defect in this branch** — they are the point of
it. A companion to `FLAKY-TESTS.md`: that file exercises *timing* flakiness,
this one exercises *locator* fragility.

The suite is green and the exercise is offline. `npm test` runs the real
sandbox tests; the locator tests run against saved DOM snapshots, so they give
the same answer on every machine, in CI, and without a stand.

---

## The setup

`pages/store/store.page.ts` locates the storefront through class chains,
positional CSS, a React-generated id and a visible label. None of that was
necessary: the sandbox markup carries `data-testid` attributes on every one of
those elements. Each brittle locator has a comment saying why it is fragile.

`tests/locators/fixtures/` holds four saved snapshots of real /dk/store markup
(trimmed, but the class chains, ids and testids are intact):

| File | What it is |
|---|---|
| `store-snapshot.html` | the page as it is today |
| `store-snapshot-after-ui-change.html` | the same page after a routine release (see below) |
| `promo-before.html` / `promo-after.html` | the homepage promo slot before and after a redesign |

## Running

```bash
npm run test:locators      # the whole exercise
npx playwright test --project=locators --reporter=list   # same, explicit
npx playwright test --project=locators -g "LOC-01" -g "LOC-03"   # pick two
```

CI runs the exercise explicitly, before the `SESSION_URL` gate, so it runs on every push
even for a repository with no stand secrets. The e2e steps are scoped to
`--project=chromium --project=admin`, so the locator tests are not run a second time.

## What is supposed to happen

| Test | Behaviour | Today |
|---|---|---|
| `LOC-01` catalog locators survive a UI change | the same six locators pass against the page as captured AND after a routine release | **expected-fail** — the brittle locators die on the second snapshot |
| `LOC-02` primary strategy is enough | the promo chain resolves via the first candidate, not degraded, nothing rejected | passes |
| `LOC-03` fallback fires and is marked degraded | after the redesign only a non-primary strategy matches; the result is `degraded`, and the log says which one fired | passes |
| `LOC-04` empty chain fails loudly | on a page with none of the targets, the error lists every strategy and its match count | passes |

`LOC-01` is marked `test.fail(...)` so the suite stays green while the locators
are unfixed. Playwright treats that as "must fail" — the moment you fix
`StorePage`, `LOC-01` becomes **"passed but was expected to fail"**, which is
your cue to remove the annotation.

## Your task

1. Read each brittle member of `StorePage` and its comment. For each, say
   *what principle makes it fragile* (a class is styling, an id is generated, a
   label is translated, a position is the backend's choice).
2. Run `npm run test:locators` and read the `LOC-01` failure — the selector and
   the "element(s) not found" are the whole diagnosis.
3. **Do not change the test.** Fix the locators in `StorePage`. `LOC-01` itself
   checks both snapshots, so it fails until a locator works on the page as it is
   *and* after the release — a locator that only works on the file you wrote it
   against keeps the test red.
4. For each fix, check the match count on the *whole* page — not the fragment
   you copied. `page.locator('p')` may match the title *and* the price.
5. When every assertion in `LOC-01` passes, remove the `test.fail(...)` line and
   run the exercise again. Green means fixed. Leave `StorePage`'s public members
   (`goto`, `gotoFile`) alone — the tests reference them by name, and the
   exercise is about the locator, not the method.
6. Now the promo. Read `promo-before.html` and `promo-after.html`. Is there a
   *single* strategy that survives both? Try one, run `LOC-02`/`LOC-03`, and
   decide: if yes, you do not need self-healing here — one locator is the
   honest answer. If no, the chain in `pages/home/promo.page.ts` is the
   mechanism, and `LOC-03` shows what a fallback must report.
7. Run the whole suite: `npm test`, `npm run lint`, `npm run typecheck`.
8. Record what you changed — and what you rejected — in a change log here, one
   line per decision with the reason. A rejected suggestion is as informative
   as an accepted one; the next person reads the log to learn which strategies
   were ruled out and why.

A fix that "works" by adding an nth-child or a longer class chain is not a fix:
it changes the failure mode, it does not remove it. The moment a release moves
one wrapper, it is broken again — exactly the way the original was.

## Change log

Fill this in as you go. One line per decision, with the reason. Delete the
example lines and keep your own.

| Element | Proposed | Decision | Reason |
|---|---|---|---|
| `productsList` | `ul.grid > li > a.product-link` | rejected | still a class chain — the next rename breaks it again |
| `productsList` | `getByTestId('products-list')` | accepted | one match on both snapshots, no dependency on classes or order |
| `productTitles` | `p.txt-medium` | rejected | eight matches for four cards: also hits the price |
| `firstProductCard` | `li:nth-child(1) > a` | rejected | after the release it finds the promo row — one match, wrong element |
| `priceLowToHigh` | `getByText('Price: Low -> High')` | rejected | translated label fails in any other locale |

## What a self-healing candidate chain must do

When an element genuinely has no single stable locator, a candidate chain is
the fallback — and it has four hard requirements:

- candidates are **independent strategies** (`data-testid`, ARIA role +
  accessible name, a stable attribute, relative position), not variations of
  one selector;
- candidates are tried **in priority order**, with the one you most trust first;
- when anything other than the first strategy matches, the result is **marked
  degraded and written to the log** with the name of the strategy that fired —
  a silent fallback hides the breakage and accumulates debt;
- when nothing matches, the test **fails and lists every strategy it tried**,
  with its match count — so the failure says what was attempted, not "element
  not found".

`helpers/locator-healing.ts` implements exactly this, and `LOC-02`/`LOC-03`/
`LOC-04` pin its three behaviours.

## What the "redesign" actually changed

`store-snapshot-after-ui-change.html` is *not* a different page. Four things
changed, none of them a functional change and none of them a `data-testid`
rename:

1. the card anchor's utility class was renamed (`group` → `product-link`);
2. the React-generated headlessui ids were regenerated;
3. the sort label was localised to German;
4. a promo row (`<li class="promo-slot">`) was inserted as the first child of
   the product grid.

Every `data-testid` is unchanged, and the product order is unchanged. That is
what makes the file honest: nothing functional moved, and a stable locator
survives all four. Note the fourth change specifically — it is why
`firstProductCard` must be asserted by *what it points at*, not just by whether
it found something. After the release the nth-child still matches exactly one
element; it is the promo, not a product card.

## After fixing: fold into the normal suite

`tests/locators/` and the `locators` project are scaffolding for the exercise,
not an architecture. Once the locators are fixed:

- delete the `test.fail(...)` in `LOC-01` (the check in step 5);
- move `locators.spec.ts` out of its own project into `chromium` and delete
  the `locators` project from `playwright.config.ts`;
- delete `test:locators` from `package.json`;
- keep the fixtures only if the tests still meaningfully pin the external
  locator contract — the moment they stop failing on the after-change
  snapshot they are dead weight.

Delete this file last: it documents a temporary arrangement, and stale docs
are worse than none.
