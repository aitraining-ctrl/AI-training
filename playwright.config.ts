import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { env, ADMIN_STORAGE_STATE, CUSTOMER_STORAGE_STATE } from './config/env';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Tests of one stand share one database: keep them sequential. */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Host of the stand (from SESSION_URL): page paths (e.g. '/dk/account') live in Page Objects. */
    baseURL: env.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: [/[\\/]admin[\\/]/, /[\\/]locators[\\/]/],
      use: { ...devices['Desktop Chrome'], storageState: CUSTOMER_STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'admin',
      testMatch: /[\\/]admin[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], storageState: ADMIN_STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      // Offline locator exercise: loads saved file:// DOM snapshots, no stand,
      // no auth, no setup. Run with `npm run test:locators`.
      name: 'locators',
      testMatch: /[\\/]locators[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
