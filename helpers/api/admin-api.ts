import { APIRequestContext } from '@playwright/test';

export interface AdminProduct {
  id: string;
  title: string;
  handle: string;
}

export interface AdminCustomer {
  id: string;
  email: string;
}

/**
 * Medusa Admin API (/admin/*) authorised by the admin session cookie from `admin.setup.ts`.
 * Use it to prepare data or check the result of a UI action without clicking through the admin.
 * The Store API (/store/*) is not wrapped: it also needs a publishable API key header.
 */
export class AdminApi {
  constructor(private request: APIRequestContext) {}

  async getPublishedProducts(): Promise<AdminProduct[]> {
    const body = await this.get<{ products: AdminProduct[] }>('/admin/products', {
      'status[]': 'published',
      fields: 'id,title,handle',
      limit: '100',
    });
    return body.products;
  }

  async findCustomerByEmail(email: string): Promise<AdminCustomer | undefined> {
    const body = await this.get<{ customers: AdminCustomer[] }>('/admin/customers', {
      q: email,
      fields: 'id,email',
    });
    return body.customers.find((customer) => customer.email === email);
  }

  /** Array filters use the `name[]` key, e.g. `{ 'status[]': 'published' }`. */
  private async get<T>(path: string, params: Record<string, string>): Promise<T> {
    const response = await this.request.get(path, { params: new URLSearchParams(params) });
    if (!response.ok()) {
      throw new Error(`GET ${path} returned ${response.status()}: ${await response.text()}`);
    }
    return (await response.json()) as T;
  }
}
