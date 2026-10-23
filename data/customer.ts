export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** Stand data persists between runs, so every customer gets a unique email. */
export function createCustomer(): Customer {
  const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return {
    firstName: 'Test',
    lastName: 'Customer',
    email: `qa+${id}@example.test`,
    password: `Pw-${id}-1aA!`,
  };
}
