function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL || 'https://qa-sandbox-candidate-smoke.fly.dev',
  /**
   * The QA sandbox gates the whole host behind a session link
   * (`https://host/s/<id>`), which sets a `lane` cookie. Without it every
   * request returns 403 "A session link is required to use this environment."
   * Optional: the public fly.dev sandbox does not use it.
   */
  get sessionLink() {
    return process.env.SESSION_LINK || '';
  },
  get adminEmail() {
    return required('ADMIN_EMAIL');
  },
  get adminPassword() {
    return required('ADMIN_PASSWORD');
  },
};

export const ADMIN_STORAGE_STATE = 'playwright/.auth/admin.json';
