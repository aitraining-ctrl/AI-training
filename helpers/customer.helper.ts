import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { CUSTOMER_DATA_FILE } from '../config/env';
import { Customer } from '../data/customer';

export function saveCustomer(customer: Customer) {
  mkdirSync(dirname(CUSTOMER_DATA_FILE), { recursive: true });
  writeFileSync(CUSTOMER_DATA_FILE, JSON.stringify(customer, null, 2));
}

export function loadCustomer(): Customer {
  return JSON.parse(readFileSync(CUSTOMER_DATA_FILE, 'utf-8')) as Customer;
}
