# Medusa Store — E2E Tests (Playwright)

Automated UI tests for the Medusa Store QA Sandbox using **Playwright** and **TypeScript**.

## 🎯 Target

| Key          | Value                                          |
|--------------|------------------------------------------------|
| **Base URL** | `https://qa-sandbox-candidate-smoke.fly.dev`   |
| **Locale**   | `/dk` (all storefront paths start with it)     |
| **Coverage** | Login, Customer Account                        |

---

## 🛠 Tech Stack

| Layer         | Choice                                   |
|---------------|------------------------------------------|
| Framework     | Playwright Test                          |
| Language      | TypeScript (strict)                      |
| Pattern       | Page Object Model (POM)                  |
| Auth Strategy | `storageState` (login once in setup)     |
| Config        | `.env` via dotenv                        |
| Lint          | ESLint + `eslint-plugin-playwright`      |
| Reporter      | HTML                                     |

---

## 📁 Project Structure

```
AI-training/
├── config/
│   └── env.ts                       # Env variables + storageState path
├── pages/                           # Page Objects — selectors live ONLY here
│   ├── login/
│   │   └── login.page.ts
│   └── account/
│       ├── account-nav.component.ts # Side nav shared by /dk/account/* pages
│       ├── overview.page.ts
│       └── profile.page.ts
├── helpers/
│   └── auth.helper.ts               # Login flows reused by setup/tests
├── fixtures/
│   └── index.ts                     # Custom fixtures: import test/expect from here
├── tests/
│   ├── auth/
│   │   ├── global.setup.ts          # Logs in as admin, saves storageState
│   │   └── login.spec.ts
│   └── account/
│       └── profile-navigation.spec.ts
├── playwright/.auth/                # Saved sessions (gitignored)
├── .env.example
├── eslint.config.mjs
├── playwright.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))

### Installation

```powershell
npm install
npx playwright install chromium

# Create your local env file and fill in the sandbox credentials
Copy-Item .env.example .env
```

### Running

| Command               | What it does                               |
|-----------------------|--------------------------------------------|
| `npm test`            | Run all tests (headless)                   |
| `npm run test:headed` | Run with a visible browser                 |
| `npm run test:ui`     | Playwright UI mode                         |
| `npm run report`      | Open the last HTML report                  |
| `npm run lint`        | ESLint (enforces the architecture rules)   |
| `npm run typecheck`   | TypeScript check without emitting          |

```powershell
# Run a single file
npx playwright test tests/auth/login.spec.ts

# Only regenerate the auth session
npx playwright test --project=setup
```

---

## 🔐 Authentication

1. The `setup` project runs **first**, logs in as admin with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env` and saves the session to `playwright/.auth/admin.json`.
2. The `chromium` project loads that session for every test — **no repeated logins**.
3. Tests that check the login itself opt out of the saved session:

```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

> ⚠️ `.env` and `playwright/.auth/` are **gitignored** and must never be committed. In CI the credentials come from GitHub Secrets `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

## 🏗 Architecture Rules

| Rule | Description | Enforced by |
|------|-------------|-------------|
| **POM** | Every page/component has its own class in `pages/`. Selectors live **only** inside Page Objects. | ESLint: no `locator()` / `getBy*()` in `tests/` |
| **Navigation via POM** | Tests open pages with Page Object `goto()`, not `page.goto()`. | ESLint |
| **`data-testid` locators** | Use `getByTestId(...)`; scope with a parent (`this.root.getByTestId(...)`) instead of XPath or indexes. | Review |
| **Actions in POM, assertions in tests** | Page Objects expose locators and actions; `expect(...)` lives in the spec. | Review |
| **Web-first assertions** | `await expect(locator).toBeVisible()` etc. — they auto-wait. | Review |
| **No hard waits** | No `waitForTimeout`. Wait for an element or URL. | ESLint |
| **Test isolation** | Each test can run on its own, in any order. | Review |
| **Naming** | `ID: what is expected`, e.g. `AUTH-02: error is shown for a wrong password`. | Review |

---

## 📋 Test Cases

| ID      | Description                                    | File                                    | Status |
|---------|------------------------------------------------|-----------------------------------------|--------|
| AUTH-01 | Admin logs in with valid credentials           | `tests/auth/login.spec.ts`              | ✅     |
| AUTH-02 | Error is shown for a wrong password            | `tests/auth/login.spec.ts`              | ✅     |
| ACC-01  | Profile page opens from the account navigation | `tests/account/profile-navigation.spec.ts` | ✅  |

---

## ⚙️ Configuration

Key settings in `playwright.config.ts`:

| Setting      | Value                                   |
|--------------|-----------------------------------------|
| `testDir`    | `./tests`                               |
| `baseURL`    | `BASE_URL` from `.env` (host only)      |
| `retries`    | 1 on CI, 0 locally                      |
| `workers`    | 1 on CI, all cores locally              |
| `trace`      | On first retry                          |
| `screenshot` | Only on failure                         |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Missing env variable ADMIN_EMAIL` | Copy `.env.example` to `.env` and fill it in |
| `ENOENT: admin.json` | Run `npx playwright test --project=setup` first |
| `Strict mode violation` | Element found multiple times — scope it: `getByTestId('parent').getByTestId('child')` |
| PowerShell script error | Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| Timeout on `fill()` | Wrong selector — use `npx playwright codegen <url>` to find the `data-testid` |
| `waitForLoadState('networkidle')` never resolves | The storefront keeps background requests open; wait for a specific element instead |

---

## 📄 License

Private — QA Sandbox project.
