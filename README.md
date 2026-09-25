# Medusa Store — E2E Tests (Playwright)

Automated UI tests for the Medusa Store QA Sandbox using **Playwright** and **TypeScript**.

## 🎯 Target

| Key              | Value                                                          |
|------------------|----------------------------------------------------------------|
| **Base URL**     | `https://qa-sandbox-candidate-smoke.fly.dev`                   |
| **Admin Login**  | `` / ``                          |
| **Coverage**     | Storefront, Customer Account, Cart, Navigation                 |

---

## 🛠 Tech Stack

| Layer            | Choice                        |
|------------------|-------------------------------|
| Framework        | Playwright Test               |
| Language         | TypeScript                    |
| Pattern          | Page Object Model (POM)       |
| Auth Strategy    | `storageState` (reuse login)  |
| Reporter         | HTML                          |

---

## 📁 Project Structure

```
AI-training/
├── tests/                    # Test files and support code
│   ├── auth/                 # Auth setup & auth tests
│   │   ├── global.setup.ts   # Generates storageState (admin.json)
│   │   └── auth.login.spec.ts
│   ├── pages/                # Page Objects (selectors live here only)
│   │   ├── login/
│   │   │   └── login.page.ts
│   │   └── account/
│   │       ├── overview.page.ts
│   │       ├── profile.page.ts
│   │       ├── addresses.page.ts
│   │       └── orders.page.ts
│   ├── helpers/              # Reusable logic (API, cart, addresses)
│   ├── fixtures/             # Playwright custom fixtures
│   │   └── auth.fixtures.ts
│   ├── factories/            # Test data generators
│   ├── assertions/           # Custom matchers
│   └── auth/                 # Saved sessions (gitignored!)
│       └── admin.json
├── fixtures/                 # Shared fixtures (root level)
│   └── auth.fixtures.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))

### Installation

```powershell
# Clone the repository
git clone <your-repo-url>
cd AI-training

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```powershell
# Run all tests (headless)
npx playwright test

# Run with visible browser
npx playwright test --headed

# Run with Playwright UI mode (interactive)
npx playwright test --ui

# Run a specific test file
npx playwright test tests/auth/auth.login.spec.ts

# Run only the setup (generate auth state)
npx playwright test --project=setup

# View the HTML report
npx playwright show-report
```

---

## 🔐 Authentication

Tests use **reusable login sessions** via Playwright's `storageState`:

1. The `setup` project runs **first** and logs in as admin.
2. It saves cookies & localStorage to `tests/auth/admin.json`.
3. All other tests automatically load this file — **no repeated logins**.

```typescript
// In any test file:
test.use({ storageState: 'tests/auth/admin.json' });
```

> ⚠️ The `tests/auth/*.json` files are **gitignored** and must never be committed.

---

## 🏗 Architecture Rules

| Rule | Description |
|------|-------------|
| **POM** | Every page/component has its own class in `pages/`. Selectors live **only** inside Page Objects. |
| **No raw locators in tests** | Tests must not use `page.locator(...)` directly. Use Page Object methods or fixtures. |
| **Test isolation** | Each test has explicit setup/teardown. Any test can run independently. |

---

## 📋 Test Cases

| ID       | Description                              | Priority | Status |
|----------|------------------------------------------|----------|--------|
| AUTH-01  | Successful admin login → account page    | P0       | ✅      |

---

## ⚙️ Configuration

Key settings in `playwright.config.ts`:

| Setting        | Value                                              |
|----------------|----------------------------------------------------|
| `testDir`      | `./tests`                                          |
| `baseURL`      | `https://qa-sandbox-candidate-smoke.fly.dev`       |
| `retries`      | 1 on CI, 0 locally                                 |
| `workers`      | 1 on CI, all cores locally                         |
| `trace`        | On first retry                                     |
| `screenshot`   | Only on failure                                    |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `No tests found` | Check that `testDir` in `playwright.config.ts` matches your folder name |
| `ENOENT: admin.json` | Run `npx playwright test --project=setup` first to generate the auth file |
| `Strict mode violation` | Element found multiple times — chain locators: `getByTestId('parent').getByTestId('child')` |
| PowerShell script error | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Timeout on `fill()` | Wrong selector — use `npx playwright codegen <url>` to find correct selectors |

---

## 📄 License

Private — QA Sandbox project.