import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  globalIgnores(['node_modules/', 'playwright-report/', 'test-results/', 'playwright/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name=/^(locator|getBy[A-Z]\\w*|\\$|\\$\\$)$/]',
          message: 'Selectors live only in Page Objects (pages/). Add a locator or method there.',
        },
        {
          selector: "CallExpression[callee.object.name='page'][callee.property.name='goto']",
          message: 'Navigate through Page Object goto() methods, not page.goto() in tests.',
        },
      ],
    },
  },
  {
    // Setup files verify login via Page Object waits, not expect().
    files: ['tests/**/*.setup.ts'],
    rules: { 'playwright/expect-expect': 'off' },
  },
]);
