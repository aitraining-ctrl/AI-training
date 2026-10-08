function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const env = {
  baseUrl: process.env.BASE_URL || 'https://qa-sandbox-candidate-smoke.fly.dev',
  get adminEmail() {
    return required('ADMIN_EMAIL');
  },
  get adminPassword() {
    return required('ADMIN_PASSWORD');
  },
};

export const ADMIN_STORAGE_STATE = 'playwright/.auth/admin.json';
