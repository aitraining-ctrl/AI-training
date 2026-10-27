function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  /** Session link of your stand: opening it selects the stand via cookie. It is a secret. */
  get sessionUrl() {
    return required('SESSION_URL');
  },
  /** Host of the stand, derived from the session link. Page paths live in Page Objects. */
  get baseUrl() {
    const sessionUrl = process.env.SESSION_URL;
    if (!sessionUrl) {
      // Offline projects (e.g. the locator exercise) load file:// snapshots and
      // never reach a stand. The setup project still fails fast via SESSION_URL.
      return 'http://localhost';
    }
    try {
      return new URL(sessionUrl).origin;
    } catch {
      throw new Error('SESSION_URL is not a valid URL. Copy the full link from your task.');
    }
  },
  /**
   * Admin link of your stand from the access dialog (optional). Like the session link it selects
   * the stand via cookie, so without it the admin is opened at /app after the session link.
   */
  get adminUrl() {
    return process.env.ADMIN_URL || undefined;
  },
  /** Medusa Admin (/app) credentials of your stand. */
  get adminEmail() {
    return required('ADMIN_EMAIL');
  },
  get adminPassword() {
    return required('ADMIN_PASSWORD');
  },
};

/** Stand cookie only: no customer is logged in. */
export const SESSION_STORAGE_STATE = 'playwright/.auth/session.json';
/** Stand cookie + logged-in Medusa admin. Session of the `admin` project. */
export const ADMIN_STORAGE_STATE = 'playwright/.auth/admin.json';
/** Stand cookie + logged-in customer. Default session for tests. */
export const CUSTOMER_STORAGE_STATE = 'playwright/.auth/customer.json';
/** Credentials of the customer registered by the setup project. */
export const CUSTOMER_DATA_FILE = 'playwright/.auth/customer-data.json';
